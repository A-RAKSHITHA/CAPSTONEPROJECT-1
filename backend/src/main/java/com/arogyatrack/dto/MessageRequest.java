package com.arogyatrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MessageRequest {

    private Long senderId;
    private Long receiverId;

    @NotNull(message = "Community member context ID is required")
    private Long userId;

    @NotBlank(message = "Message text cannot be empty")
    private String message;

    private String language = "EN"; // EN, TE, MIXED

    public MessageRequest() {}

    public MessageRequest(Long senderId, Long receiverId, Long userId, String message, String language) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.userId = userId;
        this.message = message;
        this.language = language;
    }

    // Getters and Setters
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
