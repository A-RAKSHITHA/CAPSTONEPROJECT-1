package com.arogyatrack.controller;

import com.arogyatrack.dto.LifestyleRequest;
import com.arogyatrack.entity.LifestyleRecord;
import com.arogyatrack.security.UserDetailsImpl;
import com.arogyatrack.service.LifestyleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/lifestyle")
public class LifestyleController {

    @Autowired
    private LifestyleService lifestyleService;

    @PostMapping
    public ResponseEntity<LifestyleRecord> saveLifestyleRecord(
            @Valid @RequestBody LifestyleRequest request,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        Long userId = request.getUserId() != null ? request.getUserId() : principal.getId();
        verifyAccess(userId, principal);
        LifestyleRecord record = lifestyleService.saveLifestyleRecord(request, principal.getId());
        return ResponseEntity.ok(record);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<LifestyleRecord> getLatestLifestyleRecord(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        verifyAccess(userId, principal);
        return ResponseEntity.ok(lifestyleService.getLatestLifestyleRecord(userId));
    }

    @GetMapping("/{userId}/history")
    public ResponseEntity<List<LifestyleRecord>> getLifestyleHistory(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        verifyAccess(userId, principal);
        return ResponseEntity.ok(lifestyleService.getLifestyleHistory(userId));
    }

    private void verifyAccess(Long targetUserId, UserDetailsImpl principal) {
        if (principal == null) throw new AccessDeniedException("Not authenticated");
        boolean isSelf = principal.getId().equals(targetUserId);
        boolean isStaff = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_NURSE") || a.getAuthority().equals("ROLE_ADMIN"));
        if (!isSelf && !isStaff) {
            throw new AccessDeniedException("You are not authorized to view this lifestyle information.");
        }
    }
}
