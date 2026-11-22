package com.arogyatrack.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    /**
     * Dispatches an OTP verification email to the user.
     * Uses real JavaMailSender when SMTP is configured, and gracefully logs OTP for local testing/demo.
     */
    public boolean sendOtpEmail(String toEmail, String recipientName, String otpCode) {
        String displayName = (recipientName != null && !recipientName.isBlank()) ? recipientName.trim() : "Valued Member";

        // Console Banner for immediate visibility during development and demo presentations
        logger.info("\n" +
                "======================================================================\n" +
                "  AROGYATRACK EMAIL DISPATCH (Account Registration)\n" +
                "  To: {} ({})\n" +
                "  Verification OTP: [{}]\n" +
                "  Validity: 5 Minutes\n" +
                "======================================================================",
                toEmail, displayName, otpCode);

        // If JavaMailSender is available and configured with a sender address, attempt real email transmission
        if (mailSender != null && mailFrom != null && !mailFrom.isBlank()) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(mailFrom, "ArogyaTrack Health Portal");
                helper.setTo(toEmail);
                helper.setSubject("ArogyaTrack - Verification Code: " + otpCode);

                String htmlContent = buildOtpHtmlEmail(displayName, otpCode);
                helper.setText(htmlContent, true);

                mailSender.send(message);
                logger.info("Successfully dispatched OTP email via SMTP to {}", toEmail);
                return true;
            } catch (Exception e) {
                logger.warn("SMTP transmission to {} was skipped/failed (will proceed with fallback OTP): {}", toEmail, e.getMessage());
            }
        } else {
            logger.info("SMTP configuration not active. OTP [{}] logged successfully for dev/demo mode.", otpCode);
        }

        return true;
    }

    private String buildOtpHtmlEmail(String name, String otp) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head><meta charset='UTF-8'><title>ArogyaTrack Verification Code</title></head>" +
                "<body style='font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;'>" +
                "  <div style='max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);'>" +
                "    <div style='background: linear-gradient(135deg, #0f766e 0%, #065f46 100%); padding: 28px 24px; text-align: center; color: #ffffff;'>" +
                "      <h1 style='margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;'>ArogyaTrack</h1>" +
                "      <p style='margin: 6px 0 0 0; font-size: 13px; opacity: 0.9;'>Rural Kidney Health Risk Monitoring System</p>" +
                "    </div>" +
                "    <div style='padding: 32px 28px;'>" +
                "      <p style='font-size: 16px; line-height: 1.5; margin-top: 0;'>Namaste <strong>" + name + "</strong>,</p>" +
                "      <p style='font-size: 14px; line-height: 1.6; color: #475569;'>Thank you for registering on ArogyaTrack. To verify your email address and activate your account, please enter the one-time verification code below:</p>" +
                "      <div style='margin: 28px 0; text-align: center;'>" +
                "        <span style='display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 6px; padding: 14px 28px; background-color: #f0fdf4; color: #15803d; border: 2px dashed #86efac; border-radius: 12px; font-family: monospace;'>" + otp + "</span>" +
                "      </div>" +
                "      <p style='font-size: 13px; color: #64748b; line-height: 1.5;'>This verification code is valid for <strong>5 minutes</strong>. If you did not initiate this request, you can safely ignore this email.</p>" +
                "      <hr style='border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;' />" +
                "      <p style='font-size: 12px; color: #94a3b8; text-align: center; margin: 0;'>Track Health &bull; Connect Care &bull; Stay Well &bull; ArogyaTrack</p>" +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>";
    }
}
