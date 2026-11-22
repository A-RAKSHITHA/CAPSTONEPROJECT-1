package com.arogyatrack.controller;

import com.arogyatrack.dto.AuthResponse;
import com.arogyatrack.dto.LoginRequest;
import com.arogyatrack.dto.RegisterRequest;
import com.arogyatrack.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private com.arogyatrack.service.OtpService otpService;

    @PostMapping("/send-otp")
    public ResponseEntity<com.arogyatrack.dto.OtpResponse> sendRegistrationOtp(@Valid @RequestBody com.arogyatrack.dto.SendOtpRequest request) {
        com.arogyatrack.dto.OtpResponse response = otpService.generateAndSendOtp(request.getEmail(), request.getFullName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        AuthResponse response = authService.registerUser(signUpRequest);
        return ResponseEntity.ok(response);
    }
}
