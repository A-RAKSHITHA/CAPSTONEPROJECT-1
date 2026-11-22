package com.arogyatrack.service;

import com.arogyatrack.dto.LifestyleRequest;
import com.arogyatrack.entity.LifestyleRecord;
import com.arogyatrack.entity.User;
import com.arogyatrack.repository.LifestyleRecordRepository;
import com.arogyatrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LifestyleService {

    @Autowired
    private LifestyleRecordRepository lifestyleRecordRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public LifestyleRecord saveLifestyleRecord(LifestyleRequest request, Long authUserId) {
        Long targetUserId = request.getUserId() != null ? request.getUserId() : authUserId;

        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        LifestyleRecord record = new LifestyleRecord();
        record.setUser(user);
        record.setFoodHabits(request.getFoodHabits());
        record.setWaterIntake(request.getWaterIntake());
        record.setPhysicalActivity(request.getPhysicalActivity());
        record.setExerciseFrequency(request.getExerciseFrequency());
        record.setSleepDuration(request.getSleepDuration());
        record.setSmokingStatus(request.getSmokingStatus());
        record.setAlcoholConsumption(request.getAlcoholConsumption());

        LifestyleRecord saved = lifestyleRecordRepository.save(record);

        // Alert user of update
        notificationService.createNotification(
                user,
                user.getAssignedNurse(),
                "Lifestyle records updated successfully.",
                "HEALTH_UPDATE"
        );

        return saved;
    }

    public List<LifestyleRecord> getLifestyleHistory(Long userId) {
        return lifestyleRecordRepository.findByUserIdOrderByRecordedAtDesc(userId);
    }

    public LifestyleRecord getLatestLifestyleRecord(Long userId) {
        return lifestyleRecordRepository.findTopByUserIdOrderByRecordedAtDesc(userId).orElse(null);
    }
}
