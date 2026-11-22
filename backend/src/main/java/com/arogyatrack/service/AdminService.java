package com.arogyatrack.service;

import com.arogyatrack.dto.DashboardStatsDto;
import com.arogyatrack.entity.FollowUp;
import com.arogyatrack.entity.Prediction;
import com.arogyatrack.entity.User;
import com.arogyatrack.repository.FollowUpRepository;
import com.arogyatrack.repository.HealthRecordRepository;
import com.arogyatrack.repository.PredictionRepository;
import com.arogyatrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private PredictionRepository predictionRepository;

    @Autowired
    private FollowUpRepository followUpRepository;

    public DashboardStatsDto getDashboardStatistics() {
        DashboardStatsDto stats = new DashboardStatsDto();

        stats.setTotalCommunityMembers(userRepository.countByRole("ROLE_USER"));
        stats.setTotalHealthWorkers(userRepository.countByRole("ROLE_NURSE"));
        stats.setTotalAssessments(predictionRepository.count());
        stats.setPriorityReviews(predictionRepository.countByPriorityReviewTrue());
        stats.setPendingFollowups(followUpRepository.countByStatus("Pending"));
        stats.setCompletedFollowups(followUpRepository.countByStatus("Follow-up Completed"));

        // Assessment results distribution
        Map<String, Long> assessmentsByResult = new HashMap<>();
        assessmentsByResult.put("Increased Risk", predictionRepository.countByPrediction(1));
        assessmentsByResult.put("Low Risk", predictionRepository.countByPrediction(0));
        stats.setAssessmentsByResult(assessmentsByResult);

        // Follow-up status distribution
        Map<String, Long> fuDist = new HashMap<>();
        fuDist.put("Pending", followUpRepository.countByStatus("Pending"));
        fuDist.put("Contacted", followUpRepository.countByStatus("Contacted"));
        fuDist.put("Follow-up Completed", followUpRepository.countByStatus("Follow-up Completed"));
        fuDist.put("Needs Further Review", followUpRepository.countByStatus("Needs Further Review"));
        stats.setFollowupsByStatus(fuDist);

        return stats;
    }

    public List<User> getAllCommunityMembers() {
        return userRepository.findByRole("ROLE_USER");
    }

    public List<User> getAllHealthWorkers() {
        return userRepository.findByRole("ROLE_NURSE");
    }

    public List<Prediction> getAllAssessments() {
        return predictionRepository.findAll();
    }

    public List<FollowUp> getAllFollowUps() {
        return followUpRepository.findAll();
    }

    @Transactional
    public User assignHealthWorker(Long userId, Long nurseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Community member not found"));

        User nurse = userRepository.findById(nurseId)
                .orElseThrow(() -> new IllegalArgumentException("Health worker not found"));

        if (!"ROLE_NURSE".equals(nurse.getRole())) {
            throw new IllegalArgumentException("Selected user is not a health worker");
        }

        user.setAssignedNurse(nurse);
        return userRepository.save(user);
    }
}
