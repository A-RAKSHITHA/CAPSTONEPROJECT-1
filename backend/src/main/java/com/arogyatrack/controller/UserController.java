package com.arogyatrack.controller;

import com.arogyatrack.dto.AssessmentResponse;
import com.arogyatrack.entity.*;
import com.arogyatrack.repository.*;
import com.arogyatrack.security.UserDetailsImpl;
import com.arogyatrack.service.HealthRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

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

    @Autowired
    private HealthRecordService healthRecordService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl principal) {
        verifyAccess(id, principal);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedData,
                                           @AuthenticationPrincipal UserDetailsImpl principal) {
        verifyAccess(id, principal);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));

        if (updatedData.getFullName() != null) user.setFullName(updatedData.getFullName());
        if (updatedData.getPhoneNumber() != null) user.setPhoneNumber(updatedData.getPhoneNumber());
        if (updatedData.getVillageCommunity() != null) user.setVillageCommunity(updatedData.getVillageCommunity());
        if (updatedData.getDistrict() != null) user.setDistrict(updatedData.getDistrict());
        if (updatedData.getAge() != null) user.setAge(updatedData.getAge());
        if (updatedData.getGender() != null) user.setGender(updatedData.getGender());
        if (updatedData.getProfilePhoto() != null) user.setProfilePhoto(updatedData.getProfilePhoto());

        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/{id}/photo")
    public ResponseEntity<Map<String, String>> updateProfilePhoto(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal UserDetailsImpl principal) {
        verifyAccess(id, principal);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));

        String photo = payload.get("profilePhoto");
        user.setProfilePhoto(photo);
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Profile photo updated successfully");
        response.put("profilePhoto", photo);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/dashboard")
    public ResponseEntity<Map<String, Object>> getUserDashboard(@PathVariable Long id,
                                                                @AuthenticationPrincipal UserDetailsImpl principal) {
        verifyAccess(id, principal);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        AssessmentResponse latestAssessment = healthRecordService.getLatestAssessment(id);
        FollowUp latestFollowUp = followUpRepository.findTopByUserIdOrderByCreatedAtDesc(id).orElse(null);
        HealthRecord latestRecord = healthRecordRepository.findTopByUserIdOrderByRecordedAtDesc(id).orElse(null);
        LifestyleRecord latestLifestyle = lifestyleRecordRepository.findTopByUserIdOrderByRecordedAtDesc(id).orElse(null);
        List<Notification> unreadAlerts = notificationRepository.findByUserIdOrderByCreatedAtDesc(id);

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("user", user);
        dashboard.put("latestAssessment", latestAssessment);
        dashboard.put("latestFollowUp", latestFollowUp);
        dashboard.put("latestHealthRecord", latestRecord);
        dashboard.put("latestLifestyle", latestLifestyle);
        dashboard.put("assignedHealthWorker", user.getAssignedNurse());
        dashboard.put("unreadAlertsCount", unreadAlerts.stream().filter(n -> "unread".equals(n.getStatus())).count());
        dashboard.put("recentAlerts", unreadAlerts.stream().limit(5).toList());

        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<Map<String, Object>> getMyHealthJourney(@PathVariable Long id,
                                                                  @AuthenticationPrincipal UserDetailsImpl principal) {
        verifyAccess(id, principal);

        List<HealthRecord> records = healthRecordRepository.findByUserIdOrderByRecordedAtDesc(id);
        List<Prediction> predictions = predictionRepository.findByUserIdOrderByPredictionDateDesc(id);
        List<FollowUp> followUps = followUpRepository.findByUserIdOrderByCreatedAtDesc(id);
        List<LifestyleRecord> lifestyles = lifestyleRecordRepository.findByUserIdOrderByRecordedAtDesc(id);

        // Combined chronological events
        List<Map<String, Object>> timeline = new ArrayList<>();

        for (HealthRecord hr : records) {
            Map<String, Object> event = new HashMap<>();
            event.put("type", "HEALTH_CHECK");
            event.put("date", hr.getRecordedAt());
            event.put("title", "Health Check Completed");
            event.put("description", "Recorded Blood Pressure: " + hr.getBp() + ", Creatinine: " + hr.getSc() + " mg/dL");
            event.put("data", hr);
            timeline.add(event);
        }

        for (Prediction p : predictions) {
            Map<String, Object> event = new HashMap<>();
            event.put("type", "ASSESSMENT");
            event.put("date", p.getPredictionDate());
            event.put("title", "Assessment: " + p.getAssessmentResult());
            event.put("description", p.getPriorityReview()
                    ? "Flagged for Health Worker priority review (Risk probability: " + Math.round(p.getPredictionProbability() * 100) + "%)"
                    : "Stable readings within monitored community ranges");
            event.put("data", p);
            timeline.add(event);
        }

        for (FollowUp f : followUps) {
            Map<String, Object> event = new HashMap<>();
            event.put("type", "FOLLOW_UP");
            event.put("date", f.getCreatedAt());
            event.put("title", "Health Worker Review & Follow-up");
            event.put("description", "Status: " + f.getStatus() + (f.getRemarks() != null ? " - " + f.getRemarks() : ""));
            event.put("data", f);
            timeline.add(event);
        }

        for (LifestyleRecord l : lifestyles) {
            Map<String, Object> event = new HashMap<>();
            event.put("type", "LIFESTYLE");
            event.put("date", l.getRecordedAt());
            event.put("title", "Lifestyle Habits Updated");
            event.put("description", "Physical activity: " + l.getPhysicalActivity() + ", Water: " + l.getWaterIntake());
            event.put("data", l);
            timeline.add(event);
        }

        // Sort chronological descending
        timeline.sort((a, b) -> {
            Comparable da = (Comparable) a.get("date");
            Comparable db = (Comparable) b.get("date");
            return db.compareTo(da);
        });

        Map<String, Object> result = new HashMap<>();
        result.put("timeline", timeline);
        result.put("records", records);
        result.put("predictions", predictions);
        result.put("followUps", followUps);
        result.put("lifestyles", lifestyles);

        return ResponseEntity.ok(result);
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
