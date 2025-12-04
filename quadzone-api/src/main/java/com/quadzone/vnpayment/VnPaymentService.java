package com.quadzone.vnpayment;

import com.quadzone.global.ExchangeRateService;
import com.quadzone.order.OrderService;
import com.quadzone.vnpayment.dto.VnPaymentRequest;
import com.quadzone.vnpayment.dto.VnPaymentResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Slf4j
public class VnPaymentService {

    private final String tmnCode;
    private final String hashSecret;
    private final String paymentUrl;
    private final ExchangeRateService exchangeRateService;
    private final OrderService orderService;

    public VnPaymentService(
            @Value("${vnpayment.tmn-code}") String tmnCode,
            @Value("${vnpayment.hash-secret}") String hashSecret,
            @Value("${vnpayment.url}") String paymentUrl,
            ExchangeRateService exchangeRateService,
            OrderService orderService) {
        this.tmnCode = tmnCode;
        this.hashSecret = hashSecret;
        this.paymentUrl = paymentUrl;
        this.exchangeRateService = exchangeRateService;
        this.orderService = orderService;
    }

    public String createPaymentUrl(HttpServletRequest request, VnPaymentRequest vnpRequest) {
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", tmnCode);

        long amount = (long) (vnpRequest.amount() * 100 * exchangeRateService.getUsdToVnd());
        vnpParams.put("vnp_Amount", String.valueOf(amount));

        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", vnpRequest.orderId());
        vnpParams.put("vnp_OrderInfo", vnpRequest.orderInfo());
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", buildCallbackUrl(request, vnpRequest.returnUrl()));

        vnpParams.put("vnp_IpAddr", getIpAddress(request));

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        dateFormat.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));

        vnpParams.put("vnp_CreateDate", dateFormat.format(cld.getTime()));

        cld.add(Calendar.MINUTE, 15);
        vnpParams.put("vnp_ExpireDate", dateFormat.format(cld.getTime()));

        return buildQueryUrl(vnpParams);
    }

    /**
     * Verify payment response hash
     * @param request Request sends back from VNPay
     * @return true
     */
    public boolean verifyPaymentResponse(HttpServletRequest request) {
        try {
            Map<String, String> fields = new HashMap<>();

            for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements(); ) {
                String fieldName = params.nextElement();
                if (fieldName.startsWith("vnp_")) {
                    String fieldValue = request.getParameter(fieldName);
                    if (fieldValue != null && !fieldValue.isEmpty()) {
                        fields.put(fieldName, fieldValue); 
                    }
                }
            }

            log.info("VNPay callback parameters count: {}", fields.size());
            log.debug("VNPay callback parameters: {}", fields);

            String vnp_SecureHash = request.getParameter("vnp_SecureHash");

            if (vnp_SecureHash == null || vnp_SecureHash.isEmpty()) {
                log.error("vnp_SecureHash is missing from callback");
                return false;
            }

            if (fields.containsKey("vnp_SecureHashType")) {
                fields.remove("vnp_SecureHashType");
            }
            if (fields.containsKey("vnp_SecureHash")) {
                fields.remove("vnp_SecureHash");
            }

            String signValue = hashAllFields(fields);

            log.info("Hash verification - Calculated: {}, Received: {}", signValue, vnp_SecureHash);

            boolean isValid = signValue.equalsIgnoreCase(vnp_SecureHash);

            if (!isValid) {
                log.warn("Hash verification FAILED. Calculated: {}, Received: {}", signValue, vnp_SecureHash);
                log.warn("Fields used for hash calculation: {}", fields.keySet());
            } else {
                log.info("Hash verification SUCCESS");
            }

            return isValid;

        } catch (Exception e) {
            log.error("Error verifying payment response", e);
            return false;
        }
    }

    private String buildQueryUrl(Map<String, String> vnpParams) {
        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);

        StringBuilder query = new StringBuilder();
        StringBuilder signData = new StringBuilder();

        for (String fieldName : fieldNames) {
            String fieldValue = vnpParams.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                try {
                    signData.append(fieldName);
                    signData.append('=');
                    signData.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                    signData.append('&');

                    query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                    query.append('&');
                } catch (Exception e) {
                    log.error("Error formatting params", e);
                }
            }
        }

        String queryUrl = query.length() > 0 ? query.substring(0, query.length() - 1) : "";
        String signDataStr = signData.length() > 0 ? signData.substring(0, signData.length() - 1) : "";

        String vnpSecureHash = hmacSHA512(hashSecret, signDataStr);
        return paymentUrl + "?" + queryUrl + "&vnp_SecureHash=" + vnpSecureHash;
    }

    private String buildCallbackUrl(HttpServletRequest request, String clientReturnUrl) {
        String requestUrl = request.getRequestURL().toString();
        String contextPath = request.getRequestURI();
        String baseUrl = requestUrl.substring(0, requestUrl.length() - contextPath.length());
        String callbackUrl = baseUrl + "/api/v1/payments/vnpay-return";

        if (clientReturnUrl != null && !clientReturnUrl.isBlank()) {
            try {
                callbackUrl += "?redirect=" + URLEncoder.encode(clientReturnUrl, StandardCharsets.UTF_8);
            } catch (Exception e) {
                log.error("Failed to encode client return URL", e);
            }
        }
        return callbackUrl;
    }

    private String hashAllFields(Map<String, String> fields) {
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);

        StringBuilder sb = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                sb.append(fieldName);
                sb.append("=");
                try {
                    String encodedValue = URLEncoder.encode(fieldValue, StandardCharsets.UTF_8);
                    sb.append(encodedValue);
                } catch (Exception e) {
                    log.warn("Failed to encode field value: {}", fieldValue, e);
                    sb.append(fieldValue);
                }

                if (itr.hasNext()) {
                    sb.append("&");
                }
            }
        }

        String signData = sb.toString();
        log.debug("Sign data for hash: {}", signData);

        return hmacSHA512(hashSecret, signData);
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac hmacSHA512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmacSHA512.init(secretKeySpec);
            byte[] hashBytes = hmacSHA512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate payment hash", e);
        }
    }

    // Hàm lấy IP
    private String getIpAddress(HttpServletRequest request) {
        String ipAdress;
        try {
            ipAdress = request.getHeader("X-FORWARDED-FOR");
            if (ipAdress == null) {
                ipAdress = request.getRemoteAddr();
            }
        } catch (Exception e) {
            ipAdress = "Invalid IP:" + e.getMessage();
        }
        return ipAdress;
    }

    /**
     * Handle callback from VNPay after payment
     * Call OrderService to update order và payment status
     *
     * @param responseDto Response from VNPay
     * @return VnPaymentResponse Updated response
     */
    public VnPaymentResponse processPaymentCallback(VnPaymentResponse responseDto) {
        String orderNumber = responseDto.vnp_TxnRef();
        String responseCode = responseDto.vnp_ResponseCode();

        if ("00".equals(responseCode)) {
            try {
                orderService.confirmPayment(
                        orderNumber,
                        responseDto.vnp_TransactionNo(),
                        responseDto.vnp_PayDate()
                );
                log.info("Payment confirmed for order: {}", orderNumber);
            } catch (Exception e) {
                log.error("Error confirming payment for order: {}", orderNumber, e);
                throw new RuntimeException("Failed to confirm payment", e);
            }

            return new VnPaymentResponse(
                    responseDto.vnp_TxnRef(),
                    responseDto.vnp_Amount(),
                    responseDto.vnp_ResponseCode(),
                    "SUCCESS",
                    responseDto.vnp_SecureHash(),
                    responseDto.vnp_OrderInfo(),
                    responseDto.vnp_TransactionNo(),
                    responseDto.vnp_BankCode(),
                    responseDto.vnp_PayDate(),
                    "Success payment");
        } else {
            try {
                orderService.markPaymentAsFailed(orderNumber);
                log.info("Payment marked as failed for order: {}", orderNumber);
            } catch (Exception e) {
                log.error("Error marking payment as failed for order: {}", orderNumber, e);
            }

            return new VnPaymentResponse(
                    responseDto.vnp_TxnRef(),
                    responseDto.vnp_Amount(),
                    responseDto.vnp_ResponseCode(),
                    "FAILED",
                    responseDto.vnp_SecureHash(),
                    responseDto.vnp_OrderInfo(),
                    responseDto.vnp_TransactionNo(),
                    responseDto.vnp_BankCode(),
                    responseDto.vnp_PayDate(),
                    "Failed to confirm payment");
        }
    }
}
