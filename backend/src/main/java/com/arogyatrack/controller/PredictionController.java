package com.arogyatrack.controller;

import com.arogyatrack.dto.AssessmentResponse;
import com.arogyatrack.entity.Prediction;
import com.arogyatrack.repository.PredictionRepository;
import com.arogyatrack.security.UserDetailsImpl;
import com.arogyatrack.service.HealthRecordService;
import com.arogyatrack.service.MlServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    @Autowired
    private PredictionRepository predictionRepository;

    @Autowired
    private HealthRecordService healthRecordService;

    @Autowired
    private MlServiceClient mlServiceClient;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Prediction>> getUserPredictions(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        verifyAccess(userId, principal);
        return ResponseEntity.ok(predictionRepository.findByUserIdOrderByPredictionDateDesc(userId));
    }

    @GetMapping("/{userId}/latest")
    public ResponseEntity<AssessmentResponse> getLatestAssessment(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        verifyAccess(userId, principal);
        AssessmentResponse response = healthRecordService.getLatestAssessment(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getModelMetrics() {
        return ResponseEntity.ok(mlServiceClient.getModelMetrics());
    }

    private void verifyAccess(Long targetUserId, UserDetailsImpl principal) {
        if (principal == null) throw new AccessDeniedException("Not authenticated");
        boolean isSelf = principal.getId().equals(targetUserId);
        boolean isStaff = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_NURSE") || a.getAuthority().equals("ROLE_ADMIN"));
        if (!isSelf && !isStaff) {
            throw new AccessDeniedException("You are not authorized to view these predictions.");
        }
    }
}
