package com.arogyatrack.service;

import com.arogyatrack.dto.MessageRequest;
import com.arogyatrack.entity.Message;
import com.arogyatrack.entity.User;
import com.arogyatrack.repository.MessageRepository;
import com.arogyatrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public Message sendMessage(MessageRequest request, Long authUserId) {
        Long senderId = request.getSenderId() != null ? request.getSenderId() : authUserId;

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));

        User userContext = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Community member context not found"));

        // Determine receiver: if sender is the member, receiver is assigned nurse; if sender is nurse, receiver is member
        User receiver;
        if (request.getReceiverId() != null) {
            receiver = userRepository.findById(request.getReceiverId())
                    .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));
        } else if (sender.getId().equals(userContext.getId())) {
            receiver = userContext.getAssignedNurse();
            if (receiver == null) {
                // Default to an available health worker if not yet explicitly assigned
                List<User> nurses = userRepository.findByRole("ROLE_NURSE");
                receiver = nurses.isEmpty() ? sender : nurses.get(0);
            }
        } else {
            receiver = userContext;
        }

        // Detect language if not provided
        String lang = request.getLanguage();
        if (lang == null || lang.isBlank()) {
            lang = detectLanguage(request.getMessage());
        }

        Message msg = new Message();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setUser(userContext);
        msg.setMessage(request.getMessage());
        msg.setLanguage(lang);
        msg.setReadStatus(false);

        Message saved = messageRepository.save(msg);

        // Alert the receiver
        notificationService.createNotification(
                userContext,
                receiver.getRole().equals("ROLE_NURSE") ? receiver : null,
                "New message from " + sender.getFullName() + ": \"" + truncate(request.getMessage(), 40) + "\"",
                "MESSAGE"
        );

        return saved;
    }

    public List<Message> getConversation(Long userId, Long authUserId, String authRole) {
        // Authorization check: User can only see their own messages unless nurse/admin
        if ("ROLE_USER".equals(authRole) && !userId.equals(authUserId)) {
            throw new AccessDeniedException("You are not authorized to view this conversation.");
        }

        return messageRepository.findByUserIdOrderBySentAtAsc(userId);
    }

    @Transactional
    public void markAsRead(Long userId, Long receiverId) {
        messageRepository.markConversationAsRead(userId, receiverId);
    }

    @Transactional
    public Message markSingleAsRead(Long messageId) {
        Message msg = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));
        msg.setReadStatus(true);
        return messageRepository.save(msg);
    }

    private String detectLanguage(String text) {
        if (text == null) return "EN";
        boolean hasTelugu = false;
        boolean hasLatin = false;

        for (char c : text.toCharArray()) {
            Character.UnicodeBlock block = Character.UnicodeBlock.of(c);
            if (block == Character.UnicodeBlock.TELUGU) {
                hasTelugu = true;
            } else if (Character.isLetter(c) && (block == Character.UnicodeBlock.BASIC_LATIN || block == Character.UnicodeBlock.LATIN_1_SUPPLEMENT)) {
                hasLatin = true;
            }
        }

        if (hasTelugu && hasLatin) return "MIXED";
        if (hasTelugu) return "TE";
        return "EN";
    }

    private String truncate(String text, int maxLen) {
        if (text == null) return "";
        return text.length() <= maxLen ? text : text.substring(0, maxLen) + "...";
    }
}
