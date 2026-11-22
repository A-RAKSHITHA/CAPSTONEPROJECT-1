package com.arogyatrack.controller;

import com.arogyatrack.dto.AssessmentResponse;
import com.arogyatrack.dto.HealthRecordRequest;
import com.arogyatrack.entity.HealthRecord;
import com.arogyatrack.security.UserDetailsImpl;
import com.arogyatrack.service.HealthRecordService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/health-records")
public class HealthRecordController {

    @Autowired
    private HealthRecordService healthRecordService;

    @PostMapping
    public ResponseEntity<AssessmentResponse> submitHealthRecord(
            @Valid @RequestBody HealthRecordRequest request,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        
        Long userId = request.getUserId() != null ? request.getUserId() : principal.getId();
        verifyAccess(userId, principal);

        AssessmentResponse response = healthRecordService.submitHealthCheck(request, principal.getId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<HealthRecord>> getRecordsByUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        verifyAccess(userId, principal);
        return ResponseEntity.ok(healthRecordService.getUserHealthRecords(userId));
    }

    @GetMapping("/{userId}/{recordId}")
    public ResponseEntity<HealthRecord> getRecordById(
            @PathVariable Long userId,
            @PathVariable Long recordId,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        verifyAccess(userId, principal);
        return ResponseEntity.ok(healthRecordService.getHealthRecordById(recordId));
    }

    private void verifyAccess(Long targetUserId, UserDetailsImpl principal) {
        if (principal == null) throw new AccessDeniedException("Not authenticated");
        boolean isSelf = principal.getId().equals(targetUserId);
        boolean isStaff = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_NURSE") || a.getAuthority().equals("ROLE_ADMIN"));
        if (!isSelf && !isStaff) {
            throw new AccessDeniedException("You are not authorized to access this health information.");
        }
    }
}
