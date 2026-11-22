package com.arogyatrack.controller;

import com.arogyatrack.entity.*;
import com.arogyatrack.repository.*;
import com.arogyatrack.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/health-workers")
public class HealthWorkerController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private PredictionRepository predictionRepository;

    @Autowired
    private FollowUpRepository followUpRepository;

    @Autowired
    private LifestyleRecordRepository lifestyleRecordRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@AuthenticationPrincipal UserDetailsImpl principal) {
        verifyNurseOrAdmin(principal);

        Long nurseId = principal.getId();
        List<User> assignedMembers = userRepository.findByAssignedNurseId(nurseId);
        List<Prediction> priorityReviews = predictionRepository.findPriorityReviewsForNurse(nurseId);
        Long pendingFollowUps = followUpRepository.countByNurseIdAndStatus(nurseId, "Pending");
        Long completedFollowUps = followUpRepository.countByNurseIdAndStatus(nurseId, "Follow-up Completed");
        Long unreadAlerts = notificationRepository.countByNurseIdAndStatus(nurseId, "unread");

        Map<String, Object> stats = new HashMap<>();
        stats.put("assignedMembersCount", assignedMembers.size());
        stats.put("priorityReviewsCount", priorityReviews.size());
        stats.put("pendingFollowUpsCount", pendingFollowUps);
        stats.put("completedFollowUpsCount", completedFollowUps);
        stats.put("unreadAlertsCount", unreadAlerts);
        stats.put("priorityReviews", priorityReviews.stream().limit(5).toList());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAssignedMembers(@AuthenticationPrincipal UserDetailsImpl principal) {
        verifyNurseOrAdmin(principal);

        Long nurseId = principal.getId();
        boolean isAdmin = principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        List<User> members = isAdmin ? userRepository.findByRole("ROLE_USER") : userRepository.findByAssignedNurseId(nurseId);

        List<Map<String, Object>> result = new ArrayList<>();
        for (User u : members) {
            Map<String, Object> map = new HashMap<>();
            map.put("user", u);
            map.put("latestPrediction", predictionRepository.findTopByUserIdOrderByPredictionDateDesc(u.getId()).orElse(null));
            map.put("latestFollowUp", followUpRepository.findTopByUserIdOrderByCreatedAtDesc(u.getId()).orElse(null));
            result.add(map);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/priority-list")
    public ResponseEntity<List<Map<String, Object>>> getPriorityList(@AuthenticationPrincipal UserDetailsImpl principal) {
        verifyNurseOrAdmin(principal);

        Long nurseId = principal.getId();
        boolean isAdmin = principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        List<Prediction> predictions = isAdmin
                ? predictionRepository.findByPriorityReviewTrueOrderByPredictionDateDesc()
                : predictionRepository.findPriorityReviewsForNurse(nurseId);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Prediction p : predictions) {
            Map<String, Object> item = new HashMap<>();
            item.put("prediction", p);
            item.put("user", p.getUser());
            item.put("healthRecord", p.getHealthRecord());
            item.put("latestFollowUp", followUpRepository.findTopByUserIdOrderByCreatedAtDesc(p.getUser().getId()).orElse(null));
            result.add(item);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> getMemberDetailsForNurse(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        verifyNurseOrAdmin(principal);

        User member = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Community member not found"));

        List<HealthRecord> records = healthRecordRepository.findByUserIdOrderByRecordedAtDesc(id);
        List<Prediction> predictions = predictionRepository.findByUserIdOrderByPredictionDateDesc(id);
        List<LifestyleRecord> lifestyles = lifestyleRecordRepository.findByUserIdOrderByRecordedAtDesc(id);
        List<FollowUp> followUps = followUpRepository.findByUserIdOrderByCreatedAtDesc(id);

        Map<String, Object> details = new HashMap<>();
        details.put("member", member);
        details.put("healthRecords", records);
        details.put("predictions", predictions);
        details.put("lifestyleRecords", lifestyles);
        details.put("followUps", followUps);
        details.put("latestAssessment", predictions.isEmpty() ? null : predictions.get(0));
        details.put("latestLifestyle", lifestyles.isEmpty() ? null : lifestyles.get(0));

        return ResponseEntity.ok(details);
    }

    @GetMapping("/followups")
    public ResponseEntity<List<FollowUp>> getHealthWorkerFollowups(@AuthenticationPrincipal UserDetailsImpl principal) {
        verifyNurseOrAdmin(principal);

        Long nurseId = principal.getId();
        boolean isAdmin = principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return ResponseEntity.ok(isAdmin ? followUpRepository.findAll() : followUpRepository.findByNurseIdOrderByCreatedAtDesc(nurseId));
    }

    private void verifyNurseOrAdmin(UserDetailsImpl principal) {
        if (principal == null) throw new AccessDeniedException("Not authenticated");
        boolean isStaff = principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_NURSE") || a.getAuthority().equals("ROLE_ADMIN"));
        if (!isStaff) {
            throw new AccessDeniedException("You are not authorized to view health worker dashboards.");
        }
    }
}
