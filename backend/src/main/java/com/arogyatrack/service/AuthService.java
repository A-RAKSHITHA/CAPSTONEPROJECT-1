package com.arogyatrack.service;

import com.arogyatrack.dto.AuthResponse;
import com.arogyatrack.dto.LoginRequest;
import com.arogyatrack.dto.RegisterRequest;
import com.arogyatrack.entity.HealthWorker;
import com.arogyatrack.entity.User;
import com.arogyatrack.repository.HealthWorkerRepository;
import com.arogyatrack.repository.UserRepository;
import com.arogyatrack.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HealthWorkerRepository healthWorkerRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private OtpService otpService;

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return buildAuthResponse(jwt, user);
    }

    @Transactional
    public AuthResponse registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new IllegalArgumentException("This email is already registered.");
        }

        // Verify Email OTP
        otpService.verifyOtp(signUpRequest.getEmail(), signUpRequest.getOtp());

        if (!signUpRequest.getPassword().equals(signUpRequest.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and Confirm Password do not match.");
        }

        String phone = signUpRequest.getPhoneNumber();
        if (phone == null || !phone.matches("^[0-9]{10}$")) {
            throw new IllegalArgumentException("Phone number must be exactly 10 digits.");
        }

        String pwd = signUpRequest.getPassword();
        if (pwd == null || !pwd.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?~`]).{8,}$")) {
            throw new IllegalArgumentException("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
        }

        // Create new user's account
        User user = new User();
        user.setFullName(signUpRequest.getFullName());
        user.setEmail(signUpRequest.getEmail());
        user.setPhoneNumber(signUpRequest.getPhoneNumber());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setVillageCommunity(signUpRequest.getVillageCommunity());
        user.setDistrict(signUpRequest.getDistrict());
        user.setAge(signUpRequest.getAge());
        user.setGender(signUpRequest.getGender());

        String requestedRole = signUpRequest.getRole();
        if (requestedRole != null && requestedRole.equalsIgnoreCase("ROLE_NURSE")) {
            user.setRole("ROLE_NURSE");
        } else if (requestedRole != null && requestedRole.equalsIgnoreCase("ROLE_ADMIN")) {
            user.setRole("ROLE_ADMIN");
        } else {
            user.setRole("ROLE_USER");
        }

        // If registering as community member, automatically assign to an available Health Worker
        if ("ROLE_USER".equals(user.getRole())) {
            List<User> nurses = userRepository.findByRole("ROLE_NURSE");
            if (!nurses.isEmpty()) {
                user.setAssignedNurse(nurses.get(0));
            }
        }

        User savedUser = userRepository.save(user);

        // If registered as Health Worker, create health_workers record
        if ("ROLE_NURSE".equals(savedUser.getRole())) {
            HealthWorker hw = new HealthWorker(savedUser, savedUser.getVillageCommunity(), "ANM Community Nurse");
            healthWorkerRepository.save(hw);
        }

        // Welcome notification
        notificationService.createNotification(
                savedUser,
                savedUser.getAssignedNurse(),
                "Namaste " + savedUser.getFullName() + "! Welcome to ArogyaTrack.",
                "MESSAGE"
        );

        String jwt = jwtUtils.generateTokenFromEmail(savedUser.getEmail(), savedUser.getId(), savedUser.getRole());
        return buildAuthResponse(jwt, savedUser);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        AuthResponse res = new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getVillageCommunity(),
                user.getDistrict()
        );
        res.setAge(user.getAge());
        res.setGender(user.getGender());

        if (user.getAssignedNurse() != null) {
            res.setAssignedNurseId(user.getAssignedNurse().getId());
            res.setAssignedNurseName(user.getAssignedNurse().getFullName());
        }

        res.setProfilePhoto(user.getProfilePhoto());

        return res;
    }
}
