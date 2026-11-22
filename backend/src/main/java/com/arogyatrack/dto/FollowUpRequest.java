package com.arogyatrack.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class FollowUpRequest {

    private Long id;

    @NotNull(message = "Community member ID is required")
    private Long userId;

    private Long nurseId;
    private Long predictionId;

    private String priority = "Low";
    private String status = "Pending"; // Pending, Contacted, Follow-up Completed, Needs Further Review

    private LocalDate followupDate;
    private String remarks;
    private String actionTaken;
    private LocalDate nextFollowupDate;

    public FollowUpRequest() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getNurseId() { return nurseId; }
    public void setNurseId(Long nurseId) { this.nurseId = nurseId; }

    public Long getPredictionId() { return predictionId; }
    public void setPredictionId(Long predictionId) { this.predictionId = predictionId; }

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
}
