package com.arogyatrack.controller;

import com.arogyatrack.dto.FollowUpRequest;
import com.arogyatrack.entity.FollowUp;
import com.arogyatrack.security.UserDetailsImpl;
import com.arogyatrack.service.FollowUpService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/followups")
public class FollowUpController {

    @Autowired
    private FollowUpService followUpService;

    @PostMapping
    public ResponseEntity<FollowUp> createFollowUp(
            @Valid @RequestBody FollowUpRequest request,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        verifyNurseOrAdmin(principal);
        FollowUp followUp = followUpService.createOrUpdateFollowUp(request, principal.getId());
        return ResponseEntity.ok(followUp);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FollowUp> updateFollowUp(
            @PathVariable Long id,
            @RequestBody FollowUpRequest request,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        verifyNurseOrAdmin(principal);
        request.setId(id);
        FollowUp followUp = followUpService.createOrUpdateFollowUp(request, principal.getId());
        return ResponseEntity.ok(followUp);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<FollowUp>> getFollowUpsForUser(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        verifyAccess(userId, principal);
        return ResponseEntity.ok(followUpService.getFollowUpsForUser(userId));
    }

    private void verifyNurseOrAdmin(UserDetailsImpl principal) {
        if (principal == null) throw new AccessDeniedException("Not authenticated");
        boolean isStaff = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_NURSE") || a.getAuthority().equals("ROLE_ADMIN"));
        if (!isStaff) {
            throw new AccessDeniedException("Only Health Workers can record or update follow-up actions.");
        }
    }

    private void verifyAccess(Long targetUserId, UserDetailsImpl principal) {
        if (principal == null) throw new AccessDeniedException("Not authenticated");
        boolean isSelf = principal.getId().equals(targetUserId);
        boolean isStaff = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_NURSE") || a.getAuthority().equals("ROLE_ADMIN"));
        if (!isSelf && !isStaff) {
            throw new AccessDeniedException("You are not authorized to view these follow-ups.");
        }
    }
}
