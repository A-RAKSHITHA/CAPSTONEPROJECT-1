package com.arogyatrack.service;

import com.arogyatrack.entity.Notification;
import com.arogyatrack.entity.User;
import com.arogyatrack.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(User user, User nurse, String message, String type) {
        Notification notification = new Notification(user, nurse, message, type);
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getNotificationsForNurse(Long nurseId) {
        return notificationRepository.findByNurseIdOrderByCreatedAtDesc(nurseId);
    }

    @Transactional
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with ID: " + notificationId));
        notification.setStatus("read");
        return notificationRepository.save(notification);
    }
}
