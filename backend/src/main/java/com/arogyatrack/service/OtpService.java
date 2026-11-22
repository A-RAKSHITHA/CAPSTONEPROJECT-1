package com.arogyatrack.service;

import com.arogyatrack.dto.OtpResponse;
import com.arogyatrack.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private static final Logger logger = LoggerFactory.getLogger(OtpService.class);
    private static final long OTP_VALIDITY_SECONDS = 300; // 5 minutes
    private static final int MAX_ATTEMPTS = 5;

    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, OtpEntry> otpCache = new ConcurrentHashMap<>();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public static class OtpEntry {
        private final String code;
        private final Instant expiresAt;
        private int attempts;

        public OtpEntry(String code, Instant expiresAt) {
            this.code = code;
            this.expiresAt = expiresAt;
            this.attempts = 0;
        }

        public String getCode() {
            return code;
        }

        public Instant getExpiresAt() {
            return expiresAt;
        }

        public int getAttempts() {
            return attempts;
        }

        public void incrementAttempts() {
            this.attempts++;
        }
    }

    /**
     * Generates a secure 6-digit OTP, stores it with 5-minute expiry, and sends it to the user's email.
     */
    public OtpResponse generateAndSendOtp(String rawEmail, String fullName) {
        if (rawEmail == null || rawEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("Email address is required.");
        }

        String email = rawEmail.trim().toLowerCase();

        // Check if an account already exists with this email
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email (" + email + ") already exists. Please sign in instead.");
        }

        // Generate 6-digit numeric OTP
        int number = secureRandom.nextInt(1_000_000);
        String code = String.format("%06d", number);

        // Store with 5-minute expiry
        Instant expiresAt = Instant.now().plusSeconds(OTP_VALIDITY_SECONDS);
        otpCache.put(email, new OtpEntry(code, expiresAt));

        logger.info("Generated registration OTP for email: {}", email);

        // Dispatch email
        emailService.sendOtpEmail(email, fullName, code);

        return new OtpResponse(
                true,
                "Verification code successfully sent to " + email,
                email,
                OTP_VALIDITY_SECONDS,
                code // Returned for instant testing / demo presentations
        );
    }

    /**
     * Verifies the OTP provided by the user and consumes it upon success.
     */
    public boolean verifyOtp(String rawEmail, String providedCode) {
        if (rawEmail == null || rawEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("Email address is required for verification.");
        }
        if (providedCode == null || providedCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Verification code is required.");
        }

        String email = rawEmail.trim().toLowerCase();
        String code = providedCode.trim();

        OtpEntry entry = otpCache.get(email);
        if (entry == null) {
            throw new IllegalArgumentException("No verification code found or it has expired. Please click 'Resend Code'.");
        }

        if (Instant.now().isAfter(entry.getExpiresAt())) {
            otpCache.remove(email);
            throw new IllegalArgumentException("Verification code has expired. Please request a new code.");
        }

        if (entry.getAttempts() >= MAX_ATTEMPTS) {
            otpCache.remove(email);
            throw new IllegalArgumentException("Too many incorrect attempts. Please request a new verification code.");
        }

        if (!entry.getCode().equals(code)) {
            entry.incrementAttempts();
            int remaining = MAX_ATTEMPTS - entry.getAttempts();
            throw new IllegalArgumentException("Invalid verification code. " + (remaining > 0 ? remaining + " attempt(s) remaining." : "Please request a new code."));
        }

        // Valid OTP - consume it so it cannot be reused
        otpCache.remove(email);
        logger.info("Successfully verified registration OTP for email: {}", email);
        return true;
    }
}
