package com.arogyatrack.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "followups")
public class FollowUp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "nurse_id", nullable = false)
    private User nurse;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "prediction_id")
    private Prediction prediction;

    @Column(nullable = false, length = 50)
    private String priority = "Low"; // High, Moderate, Low

    @Column(nullable = false, length = 50)
    private String status = "Pending"; // Pending, Contacted, Follow-up Completed, Needs Further Review

    @Column(name = "followup_date", nullable = false)
    private LocalDate followupDate;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "action_taken", columnDefinition = "TEXT")
    private String actionTaken;

    @Column(name = "next_followup_date")
    private LocalDate nextFollowupDate;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.followupDate == null) this.followupDate = LocalDate.now();
        if (this.status == null) this.status = "Pending";
        if (this.priority == null) this.priority = "Low";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public FollowUp() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public User getNurse() { return nurse; }
    public void setNurse(User nurse) { this.nurse = nurse; }

    public Prediction getPrediction() { return prediction; }
    public void setPrediction(Prediction prediction) { this.prediction = prediction; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getFollowupDate() { return followupDate; }
    public void setFollowupDate(LocalDate followupDate) { this.followupDate = followupDate; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public String getActionTaken() { return actionTaken; }
    public void setActionTaken(String actionTaken) { this.actionTaken = actionTaken; }

    public LocalDate getNextFollowupDate() { return nextFollowupDate; }
    public void setNextFollowupDate(LocalDate nextFollowupDate) { this.nextFollowupDate = nextFollowupDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
