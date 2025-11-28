package com.quadzone.vnpayment;

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

    public VnPaymentService(
            @Value("${vnpayment.tmn-code}") String tmnCode,
            @Value("${vnpayment.hash-secret}") String hashSecret,
            @Value("${vnpayment.url}") String paymentUrl) {
        this.tmnCode = tmnCode;
        this.hashSecret = hashSecret;
        this.paymentUrl = paymentUrl;
    }

    /**
     * Generate payment URL with VN Payment
     *
     * @param orderId Order ID
     * @param amount  Amount in VND (will be multiplied by 100 internally, e.g., 1000 VND should be passed as 1000)
     * @param orderInfo Order description
     * @param returnUrl URL to return after payment
     * @return Payment URL
     */
    public String createPaymentUrl(String orderId, Long amount, String orderInfo, String returnUrl) {
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", tmnCode);
        vnpParams.put("vnp_Amount", String.valueOf(amount * 100));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", orderId);
        vnpParams.put("vnp_OrderInfo", orderInfo);
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", returnUrl);
        vnpParams.put("vnp_IpAddr", "127.0.0.1");

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        dateFormat.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        vnpParams.put("vnp_CreateDate", dateFormat.format(new Date()));

        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);

        StringBuilder query = new StringBuilder();
        StringBuilder signData = new StringBuilder();

        for (String fieldName : fieldNames) {
            String fieldValue = vnpParams.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                query.append('&');

                signData.append(fieldName);
                signData.append('=');
                signData.append(fieldValue);
                signData.append('&');
            }
        }

        // Remove last '&'
        if (query.length() > 0) {
            query.deleteCharAt(query.length() - 1);
        }
        if (signData.length() > 0) {
            signData.deleteCharAt(signData.length() - 1);
        }

        String vnpSecureHash = hmacSHA512(hashSecret, signData.toString());
        query.append("&vnp_SecureHash=").append(vnpSecureHash);

        return paymentUrl + "?" + query.toString();
    }

    /**
     * Verify payment response hash
     *
     * @param params Payment response parameters
     * @return true if hash is valid
     */
    public boolean verifyPaymentResponse(Map<String, String> params) {
        String vnpSecureHash = params.remove("vnp_SecureHash");
        if (vnpSecureHash == null || vnpSecureHash.isEmpty()) {
            return false;
        }

        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder signData = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty() && !fieldName.equals("vnp_SecureHash")) {
                signData.append(fieldName);
                signData.append('=');
                signData.append(fieldValue);
                signData.append('&');
            }
        }

        if (signData.length() > 0) {
            signData.deleteCharAt(signData.length() - 1);
        }

        String calculatedHash = hmacSHA512(hashSecret, signData.toString());
        return calculatedHash.equals(vnpSecureHash);
    }

    /**
     * Generate HMAC SHA512 hash
     */
    private String hmacSHA512(String key, String data) {
        try {
            Mac hmacSHA512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmacSHA512.init(secretKeySpec);
            byte[] hashBytes = hmacSHA512.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            log.error("Error generating HMAC SHA512 hash", e);
            throw new RuntimeException("Failed to generate payment hash", e);
        }
    }

    /**
     * Get payment status from response code
     *
     * @param responseCode VN Payment response code
     * @return Payment status message
     */
    public String getPaymentStatusMessage(String responseCode) {
        if (responseCode == null) {
            return "Unknown";
        }

        switch (responseCode) {
            case "00":
                return "Giao dịch thành công";
            case "07":
                return "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)";
            case "09":
                return "Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking";
            case "10":
                return "Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần";
            case "11":
                return "Đã hết hạn chờ thanh toán. Xin vui lòng thực hiện lại giao dịch";
            case "12":
                return "Thẻ/Tài khoản bị khóa";
            case "13":
                return "Nhập sai mật khẩu xác thực giao dịch (OTP). Xin vui lòng thực hiện lại giao dịch";
            case "51":
                return "Tài khoản không đủ số dư để thực hiện giao dịch";
            case "65":
                return "Tài khoản đã vượt quá hạn mức giao dịch trong ngày";
            case "75":
                return "Ngân hàng thanh toán đang bảo trì";
            case "79":
                return "Nhập sai mật khẩu đăng nhập InternetBanking quá số lần quy định";
            default:
                return "Lỗi không xác định";
        }
    }
}
