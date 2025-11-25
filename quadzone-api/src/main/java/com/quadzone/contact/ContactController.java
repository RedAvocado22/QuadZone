package com.quadzone.contact;

import com.quadzone.contact.dto.ContactRequest;
import com.quadzone.utils.email.EmailSenderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;
    private final EmailSenderService emailSenderService;

    @PostMapping("/send")
    public ResponseEntity<String> sendContact(@RequestBody ContactRequest request) {
        try {
            contactService.saveContact(request);

            String adminEmail = "quadzone04@gmail.com";
            String emailSubject = "New Contact Form Submission: " + request.getSubject();
            String emailMessage = String.format(
                    "Name: %s\nEmail: %s\n\nSubject: %s\n\nMessage:\n%s",
                    request.getName(),
                    request.getEmail(),
                    request.getSubject(),
                    request.getMessage()
            );

            emailSenderService.sendSimpleEmail(adminEmail, emailSubject, emailMessage);

            String userSubject = "Thank you for contacting us";
            String userMessage = String.format(
                    "Dear %s,\n\nThank you for contacting us. We have received your message and will get back to you soon.\n\nYour message:\n%s\n\nBest regards,\nQuadZone Team",
                    request.getName(),
                    request.getMessage()
            );

            emailSenderService.sendSimpleEmail(request.getEmail(), userSubject, userMessage);

            return ResponseEntity.ok("Contact form submitted successfully");
        } catch (Exception e) {
            log.error("Error sending contact email", e);
            return ResponseEntity.internalServerError().body("Failed to send contact form");
        }
    }
}
