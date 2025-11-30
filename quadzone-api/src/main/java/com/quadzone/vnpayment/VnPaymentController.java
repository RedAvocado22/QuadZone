package com.quadzone.vnpayment;

import com.quadzone.vnpayment.dto.VnPaymentRequest;
import com.quadzone.vnpayment.dto.VnPaymentResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
public class VnPaymentController {

    private final VnPaymentService vnPaymentService;

    public VnPaymentController(VnPaymentService vnPaymentService) {
        this.vnPaymentService = vnPaymentService;
    }

    // API Tạo thanh toán
    @PostMapping("/create")
    public ResponseEntity<?> createPayment(
            HttpServletRequest request,
            @RequestBody @Valid VnPaymentRequest vnPaymentRequest // Validate request
    ) {
        String paymentUrl = vnPaymentService.createPaymentUrl(request, vnPaymentRequest);
        return ResponseEntity.ok(paymentUrl);
    }

    @GetMapping("/vnpay-return")
    public void vnPayReturn(
            HttpServletRequest request,
            HttpServletResponse response,
            @ModelAttribute VnPaymentResponse responseDto) throws IOException {

        // Kiểm tra xem có param "redirect" không
        // Nếu có "redirect" param -> đây là request từ VNPay (redirect)
        // Nếu không có "redirect" param -> đây là request từ frontend (AJAX)
        String redirectParam = request.getParameter("redirect");
        boolean isVnPayRedirect = redirectParam != null && !redirectParam.isEmpty();

        if (isVnPayRedirect) {
            // Request từ VNPay - redirect về frontend
            handleVnPayCallback(request, response, responseDto);
        } else {
            // Request từ frontend - trả về JSON response
            handleFrontendRequest(request, response, responseDto);
        }
    }

    /**
     * Xử lý request từ frontend (AJAX/API call)
     * Chỉ verify và trả về response, không xử lý payment lại (đã xử lý ở lần redirect đầu)
     */
    private void handleFrontendRequest(
            HttpServletRequest request,
            HttpServletResponse response,
            @ModelAttribute VnPaymentResponse responseDto) throws IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Verify chữ ký từ VNPay
        boolean isValidSignature = vnPaymentService.verifyPaymentResponse(request);

        if (!isValidSignature) {
            response.setStatus(400);
            response.getWriter().write("{\"error\":\"Invalid Checksum\"}");
            return;
        }

        // Build response từ request params (đảm bảo lấy đúng giá trị)
        try {
            String vnpTxnRef = request.getParameter("vnp_TxnRef");
            String vnpAmount = request.getParameter("vnp_Amount");
            String vnpResponseCode = request.getParameter("vnp_ResponseCode");
            String vnpSecureHash = request.getParameter("vnp_SecureHash");
            String vnpOrderInfo = request.getParameter("vnp_OrderInfo");
            String vnpTransactionNo = request.getParameter("vnp_TransactionNo");
            String vnpBankCode = request.getParameter("vnp_BankCode");
            String vnpPayDate = request.getParameter("vnp_PayDate");
            
            // Build response
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
                    "00".equals(vnpResponseCode) ? "Giao dịch thành công" : "Giao dịch thất bại"
            );
            
            response.setStatus(200);
            response.getWriter().write(convertToJson(paymentResponse));
        } catch (Exception e) {
            response.setStatus(500);
            response.getWriter().write("{\"error\":\"Error processing response: " + e.getMessage() + "\"}");
        }
    }

    /**
     * Xử lý callback từ VNPay (redirect)
     */
    private void handleVnPayCallback(
            HttpServletRequest request,
            HttpServletResponse response,
            @ModelAttribute VnPaymentResponse responseDto) throws IOException {

        // Lấy redirect URL từ tham số (nếu có) - đây là URL frontend được truyền từ CheckoutPage
        String redirectUrl = request.getParameter("redirect");
        
        // Build frontend URL - mặc định là localhost:5173/vnpay-result
        String frontendBaseUrl;
        if (redirectUrl != null && !redirectUrl.isEmpty()) {
            try {
                // Decode redirect URL nếu đã được encode
                frontendBaseUrl = java.net.URLDecoder.decode(redirectUrl, java.nio.charset.StandardCharsets.UTF_8.toString());
                // Loại bỏ query string nếu có (chỉ lấy base URL)
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

        // Verify chữ ký từ VNPay
        boolean isValidSignature = vnPaymentService.verifyPaymentResponse(request);

        if (!isValidSignature) {
            // Checksum sai - redirect về frontend với error
            String errorUrl = frontendBaseUrl + "?error=InvalidChecksum";
            response.sendRedirect(errorUrl);
            return;
        }

        // Xử lý payment callback và cập nhật order/payment trong database
        try {
            // Process payment callback - cập nhật order và payment status trong database
            vnPaymentService.processPaymentCallback(responseDto);
            
            // Build query string với TẤT CẢ params từ VNPay (để frontend có thể verify lại)
            StringBuilder queryString = new StringBuilder();
            boolean firstParam = true;
            
            // Lấy tất cả params từ VNPay (loại bỏ redirect param)
            for (var paramNames = request.getParameterNames(); paramNames.hasMoreElements(); ) {
                String paramName = paramNames.nextElement();
                if (!"redirect".equals(paramName)) {
                    String paramValue = request.getParameter(paramName);
                    if (paramValue != null && !paramValue.isEmpty()) {
                        if (!firstParam) {
                            queryString.append("&");
                        }
                        try {
                            // Encode lại để đảm bảo URL hợp lệ
                            queryString.append(paramName)
                                       .append("=")
                                       .append(java.net.URLEncoder.encode(paramValue, java.nio.charset.StandardCharsets.UTF_8.toString()));
                        } catch (Exception e) {
                            queryString.append(paramName).append("=").append(paramValue);
                        }
                        firstParam = false;
                    }
                }
            }
            
            // Redirect về frontend với tất cả params từ VNPay
            String finalUrl = frontendBaseUrl + "?" + queryString.toString();
            response.sendRedirect(finalUrl);
            
        } catch (Exception e) {
            // Xử lý lỗi khi process payment
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
