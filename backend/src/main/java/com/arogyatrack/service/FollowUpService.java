package com.arogyatrack.service;

import com.arogyatrack.dto.FollowUpRequest;
import com.arogyatrack.entity.FollowUp;
import com.arogyatrack.entity.Prediction;
import com.arogyatrack.entity.User;
import com.arogyatrack.repository.FollowUpRepository;
import com.arogyatrack.repository.PredictionRepository;
import com.arogyatrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class FollowUpService {

    @Autowired
    private FollowUpRepository followUpRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PredictionRepository predictionRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public FollowUp createOrUpdateFollowUp(FollowUpRequest request, Long authUserId) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Community member not found"));

        User nurse = userRepository.findById(request.getNurseId() != null ? request.getNurseId() : authUserId)
                .orElseThrow(() -> new IllegalArgumentException("Health worker not found"));

        FollowUp followUp;
        if (request.getId() != null) {
            followUp = followUpRepository.findById(request.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Follow-up not found"));
        } else {
            followUp = new FollowUp();
            followUp.setUser(user);
            followUp.setNurse(nurse);
        }

        if (request.getPredictionId() != null) {
            Prediction pred = predictionRepository.findById(request.getPredictionId()).orElse(null);
            followUp.setPrediction(pred);
        }

        followUp.setPriority(request.getPriority() != null ? request.getPriority() : "Low");
        followUp.setStatus(request.getStatus() != null ? request.getStatus() : "Pending");
        followUp.setFollowupDate(request.getFollowupDate() != null ? request.getFollowupDate() : LocalDate.now());
        followUp.setRemarks(request.getRemarks());
        followUp.setActionTaken(request.getActionTaken());
        followUp.setNextFollowupDate(request.getNextFollowupDate());

        FollowUp saved = followUpRepository.save(followUp);

        // Alert user
        String msg = "Follow-up update from your Health Worker (" + nurse.getFullName() + "): Status is now " + saved.getStatus();
        if (saved.getNextFollowupDate() != null) {
            msg += ". Next follow-up is scheduled for " + saved.getNextFollowupDate() + ".";
        }
        notificationService.createNotification(user, nurse, msg, "FOLLOW_UP");

        return saved;
    }

    public List<FollowUp> getFollowUpsForUser(Long userId) {
        return followUpRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<FollowUp> getFollowUpsForNurse(Long nurseId) {
        return followUpRepository.findByNurseIdOrderByCreatedAtDesc(nurseId);
    }

    public List<FollowUp> getAllFollowUps() {
        return followUpRepository.findAll();
    }
}
