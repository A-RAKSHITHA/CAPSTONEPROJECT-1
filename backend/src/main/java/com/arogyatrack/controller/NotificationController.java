package com.arogyatrack.controller;

import com.arogyatrack.entity.Notification;
import com.arogyatrack.security.UserDetailsImpl;
import com.arogyatrack.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        verifyAccess(userId, principal);
        return ResponseEntity.ok(notificationService.getNotificationsForUser(userId));
    }

    @GetMapping("/nurse/{nurseId}")
    public ResponseEntity<List<Notification>> getNurseNotifications(
            @PathVariable Long nurseId,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        verifyAccess(nurseId, principal);
        return ResponseEntity.ok(notificationService.getNotificationsForNurse(nurseId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    private void verifyAccess(Long targetUserId, UserDetailsImpl principal) {
        if (principal == null) throw new AccessDeniedException("Not authenticated");
        boolean isSelf = principal.getId().equals(targetUserId);
        boolean isStaff = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_NURSE") || a.getAuthority().equals("ROLE_ADMIN"));
        if (!isSelf && !isStaff) {
            throw new AccessDeniedException("You are not authorized to view these alerts.");
        }
    }
}
