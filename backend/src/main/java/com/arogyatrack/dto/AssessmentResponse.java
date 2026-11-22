package com.arogyatrack.dto;

import java.time.LocalDateTime;

public class AssessmentResponse {

    private Long predictionId;
    private Long recordId;
    private Long userId;
    private String assessmentResult; // "Increased Risk", "Low Risk"
    private String assessmentSummary;
    private Boolean priorityReview;
    private String priorityLevel;
    private Double riskProbability;
    private LocalDateTime assessmentDate;
    private String followUpStatus;
    private String healthWorkerReviewStatus;

    // Dual Model Breakdown
    private Integer lrPrediction;
    private Double lrProbability;
    private String lrRiskLabel;

    private Integer rfPrediction;
    private Double rfProbability;
    private String rfRiskLabel;

    public AssessmentResponse() {}

    // Getters and Setters
    public Long getPredictionId() { return predictionId; }
    public void setPredictionId(Long predictionId) { this.predictionId = predictionId; }

    public Long getRecordId() { return recordId; }
    public void setRecordId(Long recordId) { this.recordId = recordId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getAssessmentResult() { return assessmentResult; }
    public void setAssessmentResult(String assessmentResult) { this.assessmentResult = assessmentResult; }

    public String getAssessmentSummary() { return assessmentSummary; }
    public void setAssessmentSummary(String assessmentSummary) { this.assessmentSummary = assessmentSummary; }

    public Boolean getPriorityReview() { return priorityReview; }
    public void setPriorityReview(Boolean priorityReview) { this.priorityReview = priorityReview; }

    public String getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(String priorityLevel) { this.priorityLevel = priorityLevel; }

    public Double getRiskProbability() { return riskProbability; }
    public void setRiskProbability(Double riskProbability) { this.riskProbability = riskProbability; }

    public LocalDateTime getAssessmentDate() { return assessmentDate; }
    public void setAssessmentDate(LocalDateTime assessmentDate) { this.assessmentDate = assessmentDate; }

    public String getFollowUpStatus() { return followUpStatus; }
    public void setFollowUpStatus(String followUpStatus) { this.followUpStatus = followUpStatus; }

    public String getHealthWorkerReviewStatus() { return healthWorkerReviewStatus; }
    public void setHealthWorkerReviewStatus(String healthWorkerReviewStatus) { this.healthWorkerReviewStatus = healthWorkerReviewStatus; }

    public Integer getLrPrediction() { return lrPrediction; }
    public void setLrPrediction(Integer lrPrediction) { this.lrPrediction = lrPrediction; }

    public Double getLrProbability() { return lrProbability; }
    public void setLrProbability(Double lrProbability) { this.lrProbability = lrProbability; }

    public String getLrRiskLabel() { return lrRiskLabel; }
    public void setLrRiskLabel(String lrRiskLabel) { this.lrRiskLabel = lrRiskLabel; }

    public Integer getRfPrediction() { return rfPrediction; }
    public void setRfPrediction(Integer rfPrediction) { this.rfPrediction = rfPrediction; }

    public Double getRfProbability() { return rfProbability; }
    public void setRfProbability(Double rfProbability) { this.rfProbability = rfProbability; }

    public String getRfRiskLabel() { return rfRiskLabel; }
    public void setRfRiskLabel(String rfRiskLabel) { this.rfRiskLabel = rfRiskLabel; }
}
