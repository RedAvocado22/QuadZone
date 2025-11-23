package com.quadzone.utils.email;

import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailSenderService {
    private static final Logger log = LoggerFactory.getLogger(EmailSenderService.class);
    private final JavaMailSender sender;

    @Value("${spring.mail.username}")
    private String from;
    
    @Value("${frontend.baseurl}")
    private String feBaseUrl;

    public void sendSimpleEmail(String to, String subject, String message) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(from);
        mail.setTo(to);
        mail.setSubject(subject);
        mail.setText(message);
        sender.send(mail);
    }

    public void sendHtmlEmail(String to, String subject, String content) {
        try {
            // MimeMessage is required for HTML emails (SimpleMailMessage doesn't support HTML)
            MimeMessage mail = sender.createMimeMessage();
            mail.setFrom(new InternetAddress(from));
            mail.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
            // Encode subject with UTF-8 to support Vietnamese characters
            mail.setSubject(subject, "UTF-8");
            // Set content with UTF-8 charset
            mail.setContent(content, "text/html; charset=UTF-8");
            mail.saveChanges();
            sender.send(mail);
        } catch (AddressException e) {
            log.error("Invalid mail address", e);
        } catch (MessagingException e) {
            log.error("Failed to send email", e);
        }
    }

    public void sendAccountActivationEmail(String to, String token) {
        SimpleMailMessage mail = new SimpleMailMessage();
        String url = feBaseUrl + "/activate/" + token;
        String message = "Click this link to activate your account: " + url;
        mail.setFrom(from);
        mail.setTo(to);
        mail.setSubject("Activate your account");
        mail.setText(message);
        sender.send(mail);
    }

    public void sendAccountResetPasswordEmail(String to, String token) {
        SimpleMailMessage mail = new SimpleMailMessage();
        String url = feBaseUrl + "/reset-password/" + token;
        String message = "Click this link to reset your password: " + url;
        mail.setFrom(from);
        mail.setTo(to);
        mail.setSubject("Reset your password");
        mail.setText(message);
        sender.send(mail);
    }

    public void sendAccountCreatedEmail(String email, String password) {
        SimpleMailMessage mail = new SimpleMailMessage();
        String message = String.format("""
                    Your account has been created successfully:
                    Username: %s
                    Password: %s
                
                    Remember to change your password after you logged in.
                """, email, password);
        mail.setFrom(from);
        mail.setTo(email);
        mail.setSubject("Created Account successfully");
        mail.setText(message);
        sender.send(mail);
    }

    public void sendContactDetailsRequestEmail(String to, String target, Long id) {
        SimpleMailMessage mail = new SimpleMailMessage();
        String url = feBaseUrl + "/contact/" + id + "/" + target + "/add-details";
        String message = String.format("""
                    We have read your contact, please fill in the form in this link to let us know more about you: %s
                
                    Please don't share this link with anyone.
                """, url);
        mail.setFrom(from);
        mail.setTo(to);
        mail.setSubject("Request more details");
        mail.setText(message);
        sender.send(mail);
    }

    public void sendBanUserEmail(String to, String reason) {
        SimpleMailMessage mail = new SimpleMailMessage();
        String message = String.format("""
                    Your account has been banned with the reason: %s
                
                    Contact us if you have any question.
                """, reason);
        mail.setFrom(from);
        mail.setTo(to);
        mail.setSubject("Account banned");
        mail.setText(message);
        sender.send(mail);
    }

    public void sendUnbanUserEmail(String to, String reason) {
        SimpleMailMessage mail = new SimpleMailMessage();
        String message = String.format("""
                    Your ban has been released with the reason: %s
                
                    Contact us if you have any question.
                """, reason);
        mail.setFrom(from);
        mail.setTo(to);
        mail.setSubject("Account released");
        mail.setText(message);
        sender.send(mail);
    }

    public void sendRejectCourseEmail(String to, String courseName, String reason) {
        SimpleMailMessage mail = new SimpleMailMessage();
        String message = String.format("Your \"%s\" course has been rejected with the reason: %s", courseName, reason);
        mail.setFrom(from);
        mail.setTo(to);
        mail.setSubject("Course rejected");
        mail.setText(message);
        sender.send(mail);
    }

    public void sendApproveCourseEmail(String to, String courseName, String reason) {
        SimpleMailMessage mail = new SimpleMailMessage();
        String message = String.format("Your \"%s\" course has been published with the reason: %s", courseName, reason);
        mail.setFrom(from);
        mail.setTo(to);
        mail.setSubject("Course approved");
        mail.setText(message);
        sender.send(mail);
    }

    /**
     * Send order confirmation email to customer
     * @param to Customer email address
     * @param orderNumber Order number (e.g., ORD-00001)
     * @param customerName Customer full name
     * @param totalAmount Total order amount
     * @param orderDate Order date
     * @param itemsCount Number of items in the order
     */
    public void sendOrderConfirmationEmail(String to, String orderNumber, String customerName, 
                                          Double totalAmount, java.time.LocalDateTime orderDate, 
                                          int itemsCount) {
        try {
            String trackingUrl = feBaseUrl + "/track-order?orderNumber=" + orderNumber;
            
            String htmlContent = String.format("""
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                        .order-info { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #4CAF50; }
                        .order-number { font-size: 24px; font-weight: bold; color: #4CAF50; margin: 10px 0; }
                        .track-button { display: inline-block; background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Order Confirmation</h1>
                        </div>
                        <div class="content">
                            <p>Dear %s,</p>
                            <p>Thank you for your order! We have received your order and it is being processed.</p>
                            
                            <div class="order-info">
                                <p><strong>Order Number:</strong></p>
                                <div class="order-number">%s</div>
                                <p><strong>Order Date:</strong> %s</p>
                                <p><strong>Total Amount:</strong> $%.2f</p>
                                <p><strong>Items:</strong> %d</p>
                            </div>
                            
                            <p>You can track your order status using the link below:</p>
                            <a href="%s" class="track-button">Track Your Order</a>
                            
                            <p>If you have any questions, please contact our support team.</p>
                            
                            <p>Best regards,<br>QuadZone Team</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email. Please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>
                """, customerName, orderNumber, 
                orderDate.format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy, HH:mm")),
                totalAmount, itemsCount, trackingUrl);
            
            sendHtmlEmail(to, "Order Confirmation - " + orderNumber, htmlContent);
            log.info("Order confirmation email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send order confirmation email to: {}", to, e);
        }
    }
}
