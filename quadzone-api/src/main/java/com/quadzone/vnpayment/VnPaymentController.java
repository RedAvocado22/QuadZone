package com.quadzone.vnpayment;

import com.quadzone.vnpayment.dto.VnPaymentRequest;
import com.quadzone.vnpayment.dto.VnPaymentResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static java.nio.charset.StandardCharsets.UTF_8;

@RestController
@RequestMapping("/api/v1/payments")
public class VnPaymentController {

    private final VnPaymentService vnPaymentService;

    public VnPaymentController(VnPaymentService vnPaymentService) {
        this.vnPaymentService = vnPaymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(
            HttpServletRequest request,
            @RequestBody @Valid VnPaymentRequest vnPaymentRequest
    ) {
        String paymentUrl = vnPaymentService.createPaymentUrl(request, vnPaymentRequest);
        return ResponseEntity.ok(paymentUrl);
    }

    @GetMapping("/vnpay-return")
    public void vnPayReturn(
            HttpServletRequest request,
            HttpServletResponse response,
            @ModelAttribute VnPaymentResponse responseDto) throws IOException {

        String redirectParam = request.getParameter("redirect");
        boolean isVnPayRedirect = redirectParam != null && !redirectParam.isEmpty();

        if (isVnPayRedirect) {
            handleVnPayCallback(request, response, responseDto);
        } else {
            handleFrontendRequest(request, response, responseDto);
        }
    }

    private void handleFrontendRequest(
            HttpServletRequest request,
            HttpServletResponse response,
            @ModelAttribute VnPaymentResponse responseDto) throws IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        boolean isValidSignature = vnPaymentService.verifyPaymentResponse(request);

        if (!isValidSignature) {
            response.setStatus(400);
            response.getWriter().write("{\"error\":\"Invalid Checksum\"}");
            return;
        }

        try {
            String vnpTxnRef = request.getParameter("vnp_TxnRef");
            String vnpAmount = request.getParameter("vnp_Amount");
            String vnpResponseCode = request.getParameter("vnp_ResponseCode");
            String vnpSecureHash = request.getParameter("vnp_SecureHash");
            String vnpOrderInfo = request.getParameter("vnp_OrderInfo");
            String vnpTransactionNo = request.getParameter("vnp_TransactionNo");
            String vnpBankCode = request.getParameter("vnp_BankCode");
            String vnpPayDate = request.getParameter("vnp_PayDate");
            
            VnPaymentResponse paymentResponse = new VnPaymentResponse(
                    vnpTxnRef != null ? vnpTxnRef : "",
                    vnpAmount != null ? vnpAmount : "",
                    vnpResponseCode != null ? vnpResponseCode : "",
                    "00".equals(vnpResponseCode) ? "SUCCESS" : "FAILED",
                    vnpSecureHash != null ? vnpSecureHash : "",
                    vnpOrderInfo,
                    vnpTransactionNo,
                    vnpBankCode,
                    vnpPayDate,
                    "00".equals(vnpResponseCode) ? "Payment successful" : "Failed to confirm payment"
            );
            
            response.setStatus(200);
            response.getWriter().write(convertToJson(paymentResponse));
        } catch (Exception e) {
            response.setStatus(500);
            response.getWriter().write("{\"error\":\"Error processing response: " + e.getMessage() + "\"}");
        }
    }

    private void handleVnPayCallback(
            HttpServletRequest request,
            HttpServletResponse response,
            @ModelAttribute VnPaymentResponse responseDto) throws IOException {

        String redirectUrl = request.getParameter("redirect");
        
        String frontendBaseUrl;
        if (redirectUrl != null && !redirectUrl.isEmpty()) {
            try {
                frontendBaseUrl = java.net.URLDecoder.decode(redirectUrl, UTF_8);
                int queryIndex = frontendBaseUrl.indexOf('?');
                if (queryIndex > 0) {
                    frontendBaseUrl = frontendBaseUrl.substring(0, queryIndex);
                }
            } catch (Exception e) {
                frontendBaseUrl = "http://localhost:5173/vnpay-result";
            }
        } else {
            frontendBaseUrl = "http://localhost:5173/vnpay-result";
        }

        boolean isValidSignature = vnPaymentService.verifyPaymentResponse(request);

        if (!isValidSignature) {
            String errorUrl = frontendBaseUrl + "?error=InvalidChecksum";
            response.sendRedirect(errorUrl);
            return;
        }

        try {
            vnPaymentService.processPaymentCallback(responseDto);
            StringBuilder queryString = new StringBuilder();
            boolean firstParam = true;
            for (var paramNames = request.getParameterNames(); paramNames.hasMoreElements(); ) {
                String paramName = paramNames.nextElement();
                if (!"redirect".equals(paramName)) {
                    String paramValue = request.getParameter(paramName);
                    if (paramValue != null && !paramValue.isEmpty()) {
                        if (!firstParam) {
                            queryString.append("&");
                        }
                        try {
                            queryString.append(paramName)
                                       .append("=")
                                       .append(java.net.URLEncoder.encode(paramValue, UTF_8));
                        } catch (Exception e) {
                            queryString.append(paramName).append("=").append(paramValue);
                        }
                        firstParam = false;
                    }
                }
            }
            
            String finalUrl = frontendBaseUrl + "?" + queryString;
            response.sendRedirect(finalUrl);
            
        } catch (Exception e) {
            String errorUrl = frontendBaseUrl + "?error=ProcessingError&orderNumber=" +
                            (responseDto.vnp_TxnRef() != null ? responseDto.vnp_TxnRef() : "");
            response.sendRedirect(errorUrl);
        }
    }

    /**
     * Convert VnPaymentResponse to JSON string
     */
    private String convertToJson(VnPaymentResponse response) {
        return String.format(
            "{\"vnp_TxnRef\":\"%s\",\"vnp_Amount\":\"%s\",\"vnp_ResponseCode\":\"%s\",\"vnp_TransactionStatus\":\"%s\",\"vnp_SecureHash\":\"%s\",\"vnp_OrderInfo\":\"%s\",\"vnp_TransactionNo\":\"%s\",\"vnp_BankCode\":\"%s\",\"vnp_PayDate\":\"%s\",\"message\":\"%s\"}",
            escapeJson(response.vnp_TxnRef()),
            escapeJson(response.vnp_Amount()),
            escapeJson(response.vnp_ResponseCode()),
            escapeJson(response.vnp_TransactionStatus()),
            escapeJson(response.vnp_SecureHash()),
            escapeJson(response.vnp_OrderInfo()),
            escapeJson(response.vnp_TransactionNo()),
            escapeJson(response.vnp_BankCode()),
            escapeJson(response.vnp_PayDate()),
            escapeJson(response.message())
        );
    }

    private String escapeJson(String str) {
        if (str == null) return "";
        return str.replace("\\", "\\\\")
                  .replace("\"", "\\\"")
                  .replace("\n", "\\n")
                  .replace("\r", "\\r")
                  .replace("\t", "\\t");
    }
}
