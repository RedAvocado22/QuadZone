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
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(from);
            mail.setTo(to);
            mail.setSubject(subject);
            mail.setText(message);
            sender.send(mail);
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
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
        try {
            String url = feBaseUrl + "/activate/" + token;
            String htmlContent = buildActivationEmailHtml(url);

            MimeMessage mail = sender.createMimeMessage();
            mail.setFrom(new InternetAddress(from));
            mail.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
            mail.setSubject("Activate Your QuadZone Account");
            mail.setContent(htmlContent, "text/html");
            sender.send(mail);
            log.info("Activation email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send activation email to: {}", to, e);
            throw new RuntimeException("Failed to send activation email: " + e.getMessage(), e);
        }
    }

    private String buildActivationEmailHtml(String activationUrl) {
        return String.format("""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Activate Your Account</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
                <table role="presentation" style="width: 100%%; border-collapse: collapse; background-color: #f4f4f4;">
                    <tr>
                        <td style="padding: 40px 20px;">
                            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); border-radius: 8px 8px 0 0;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to QuadZone</h1>
                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px;">
                                        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                            Thank you for registering with QuadZone! We're excited to have you on board.
                                        </p>
                                        <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                                            To complete your registration and activate your account, please click the button below:
                                        </p>

                                        <!-- CTA Button -->
                                        <table role="presentation" style="width: 100%%; margin: 30px 0;">
                                            <tr>
                                                <td style="text-align: center;">
                                                    <a href="%s" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">Activate My Account</a>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Alternative Link -->
                                        <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                            If the button doesn't work, you can copy and paste this link into your browser:
                                        </p>
                                        <p style="margin: 10px 0 20px; word-break: break-all;">
                                            <a href="%s" style="color: #667eea; text-decoration: none; font-size: 14px;">%s</a>
                                        </p>

                                        <!-- Security Note -->
                                        <div style="margin-top: 30px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px;">
                                            <p style="margin: 0; color: #666666; font-size: 13px; line-height: 1.6;">
                                                <strong style="color: #333333;">Security Note:</strong> This activation link will expire after a certain period. If it expires, you can request a new activation email by attempting to log in.
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                                        <p style="margin: 0 0 10px; color: #666666; font-size: 14px; line-height: 1.6; text-align: center;">
                                            If you didn't create an account with QuadZone, please ignore this email.
                                        </p>
                                        <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.6; text-align: center;">
                                            © %d QuadZone. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """, activationUrl, activationUrl, activationUrl, java.time.Year.now().getValue());
    }

    public void sendAccountResetPasswordEmail(String to, String token) {
        try {
            String url = feBaseUrl + "/reset-password/" + token;
            String htmlContent = buildResetPasswordEmailHtml(url);

            MimeMessage mail = sender.createMimeMessage();
            mail.setFrom(new InternetAddress(from));
            mail.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
            mail.setSubject("Reset Your QuadZone Password");
            mail.setContent(htmlContent, "text/html");
            sender.send(mail);
            log.info("Password reset email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", to, e);
            throw new RuntimeException("Failed to send password reset email: " + e.getMessage(), e);
        }
    }

    private String buildResetPasswordEmailHtml(String resetUrl) {
        return String.format("""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Your Password</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
                <table role="presentation" style="width: 100%%; border-collapse: collapse; background-color: #f4f4f4;">
                    <tr>
                        <td style="padding: 40px 20px;">
                            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); border-radius: 8px 8px 0 0;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Password Reset Request</h1>
                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px;">
                                        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                            We received a request to reset your password for your QuadZone account.
                                        </p>
                                        <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                                            Click the button below to create a new password. If you didn't request this, you can safely ignore this email.
                                        </p>

                                        <!-- CTA Button -->
                                        <table role="presentation" style="width: 100%%; margin: 30px 0;">
                                            <tr>
                                                <td style="text-align: center;">
                                                    <a href="%s" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">Reset My Password</a>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Alternative Link -->
                                        <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                            If the button doesn't work, you can copy and paste this link into your browser:
                                        </p>
                                        <p style="margin: 10px 0 20px; word-break: break-all;">
                                            <a href="%s" style="color: #667eea; text-decoration: none; font-size: 14px;">%s</a>
                                        </p>

                                        <!-- Security Note -->
                                        <div style="margin-top: 30px; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                                            <p style="margin: 0; color: #856404; font-size: 13px; line-height: 1.6;">
                                                <strong style="color: #856404;">Security Note:</strong> This password reset link will expire after a certain period for your security. If it expires, you can request a new password reset link from the login page.
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                                        <p style="margin: 0 0 10px; color: #666666; font-size: 14px; line-height: 1.6; text-align: center;">
                                            If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                                        </p>
                                        <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.6; text-align: center;">
                                            © %d QuadZone. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """, resetUrl, resetUrl, resetUrl, java.time.Year.now().getValue());
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
            String htmlContent = buildOrderConfirmationEmailHtml(customerName, orderNumber, totalAmount, orderDate, itemsCount, trackingUrl);

            MimeMessage mail = sender.createMimeMessage();
            mail.setFrom(new InternetAddress(from));
            mail.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
            // Encode subject with UTF-8 to support Vietnamese characters
            mail.setSubject("Order Confirmation - " + orderNumber, "UTF-8");
            // Set content with UTF-8 charset
            mail.setContent(htmlContent, "text/html; charset=UTF-8");
            mail.saveChanges();
            sender.send(mail);
            log.info("Order confirmation email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send order confirmation email to: {}", to, e);
            throw new RuntimeException("Failed to send order confirmation email: " + e.getMessage(), e);
        }
    }

    private String buildOrderConfirmationEmailHtml(String customerName, String orderNumber,
                                                   Double totalAmount, java.time.LocalDateTime orderDate,
                                                   int itemsCount, String trackingUrl) {
        String formattedDate = orderDate.format(java.time.format.DateTimeFormatter.ofPattern("dd MMMM yyyy, HH:mm"));
        String formattedAmount = String.format("$%.2f", totalAmount);

        return String.format("""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Confirmation</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
                <table role="presentation" style="width: 100%%; border-collapse: collapse; background-color: #f4f4f4;">
                    <tr>
                        <td style="padding: 40px 20px;">
                            <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, #4CAF50 0%%, #45a049 100%%); border-radius: 8px 8px 0 0;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Order Confirmation</h1>
                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px;">
                                        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                            Dear %s,
                                        </p>
                                        <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                                            Thank you for your order! We have received your order and it is being processed. We'll send you a confirmation once your order ships.
                                        </p>

                                        <!-- Order Details -->
                                        <table role="presentation" style="width: 100%%; margin: 30px 0; background-color: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                                            <tr>
                                                <td style="padding: 25px;">
                                                    <table role="presentation" style="width: 100%%;">
                                                        <tr>
                                                            <td style="padding-bottom: 15px;">
                                                                <p style="margin: 0; color: #666666; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Order Number</p>
                                                                <p style="margin: 5px 0 0; color: #4CAF50; font-size: 24px; font-weight: 700;">%s</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 15px 0; border-top: 1px solid #e9ecef; border-bottom: 1px solid #e9ecef;">
                                                                <table role="presentation" style="width: 100%%;">
                                                                    <tr>
                                                                        <td style="padding: 8px 0;">
                                                                            <p style="margin: 0; color: #666666; font-size: 14px;">Order Date:</p>
                                                                            <p style="margin: 5px 0 0; color: #333333; font-size: 16px; font-weight: 600;">%s</p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="padding: 8px 0;">
                                                                            <p style="margin: 0; color: #666666; font-size: 14px;">Total Amount:</p>
                                                                            <p style="margin: 5px 0 0; color: #333333; font-size: 16px; font-weight: 600;">%s</p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="padding: 8px 0;">
                                                                            <p style="margin: 0; color: #666666; font-size: 14px;">Items:</p>
                                                                            <p style="margin: 5px 0 0; color: #333333; font-size: 16px; font-weight: 600;">%d item(s)</p>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- CTA Button -->
                                        <table role="presentation" style="width: 100%%; margin: 30px 0;">
                                            <tr>
                                                <td style="text-align: center;">
                                                    <a href="%s" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #4CAF50 0%%, #45a049 100%%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(76, 175, 80, 0.3);">Track Your Order</a>
                                                </td>
                                            </tr>
                                        </table>

                                        <!-- Alternative Link -->
                                        <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                            You can also track your order by visiting:
                                        </p>
                                        <p style="margin: 10px 0 20px; word-break: break-all;">
                                            <a href="%s" style="color: #4CAF50; text-decoration: none; font-size: 14px;">%s</a>
                                        </p>

                                        <!-- Support Note -->
                                        <div style="margin-top: 30px; padding: 15px; background-color: #e8f5e9; border-left: 4px solid #4CAF50; border-radius: 4px;">
                                            <p style="margin: 0; color: #2e7d32; font-size: 13px; line-height: 1.6;">
                                                <strong style="color: #1b5e20;">Need Help?</strong> If you have any questions about your order, please contact our support team. We're here to help!
                                            </p>
                                        </div>

                                        <p style="margin: 30px 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                            Best regards,<br>
                                            <strong style="color: #4CAF50;">QuadZone Team</strong>
                                        </p>
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
                                        <p style="margin: 0 0 10px; color: #666666; font-size: 14px; line-height: 1.6; text-align: center;">
                                            This is an automated email. Please do not reply to this email.
                                        </p>
                                        <p style="margin: 0; color: #999999; font-size: 12px; line-height: 1.6; text-align: center;">
                                            © %d QuadZone. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """, customerName, orderNumber, formattedDate, formattedAmount, itemsCount,
            trackingUrl, trackingUrl, trackingUrl, java.time.Year.now().getValue());
    }
}
