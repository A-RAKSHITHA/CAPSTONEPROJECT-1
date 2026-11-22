package com.arogyatrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "record_id", nullable = false)
    private HealthRecord healthRecord;

    @Column(name = "model_name", nullable = false, length = 100)
    private String modelName;

    @Column(nullable = false)
    private Integer prediction; // 1 (Increased Risk) or 0 (Low Risk)

    @Column(name = "prediction_probability")
    private Double predictionProbability;

    @Column(name = "assessment_result", nullable = false, length = 100)
    private String assessmentResult; // "Increased Risk", "Low Risk"

    @Column(name = "priority_review", nullable = false)
    private Boolean priorityReview = false;

    @Column(name = "priority_level", length = 50)
    private String priorityLevel; // "High", "Moderate", "Low"

    @Column(name = "lr_prediction")
    private Integer lrPrediction;

    @Column(name = "lr_probability")
    private Double lrProbability;

    @Column(name = "rf_prediction")
    private Integer rfPrediction;

    @Column(name = "rf_probability")
    private Double rfProbability;

    @Column(name = "prediction_date", updatable = false)
    private LocalDateTime predictionDate;

    @PrePersist
    protected void onCreate() {
        this.predictionDate = LocalDateTime.now();
    }

    public Prediction() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public HealthRecord getHealthRecord() { return healthRecord; }
    public void setHealthRecord(HealthRecord healthRecord) { this.healthRecord = healthRecord; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public Integer getPrediction() { return prediction; }
    public void setPrediction(Integer prediction) { this.prediction = prediction; }

    public Double getPredictionProbability() { return predictionProbability; }
    public void setPredictionProbability(Double predictionProbability) { this.predictionProbability = predictionProbability; }

    public String getAssessmentResult() { return assessmentResult; }
    public void setAssessmentResult(String assessmentResult) { this.assessmentResult = assessmentResult; }

    public Boolean getPriorityReview() { return priorityReview; }
    public void setPriorityReview(Boolean priorityReview) { this.priorityReview = priorityReview; }

    public String getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(String priorityLevel) { this.priorityLevel = priorityLevel; }

    public Integer getLrPrediction() { return lrPrediction; }
    public void setLrPrediction(Integer lrPrediction) { this.lrPrediction = lrPrediction; }

    public Double getLrProbability() { return lrProbability; }
    public void setLrProbability(Double lrProbability) { this.lrProbability = lrProbability; }

    public Integer getRfPrediction() { return rfPrediction; }
    public void setRfPrediction(Integer rfPrediction) { this.rfPrediction = rfPrediction; }

    public Double getRfProbability() { return rfProbability; }
    public void setRfProbability(Double rfProbability) { this.rfProbability = rfProbability; }

    public LocalDateTime getPredictionDate() { return predictionDate; }
    public void setPredictionDate(LocalDateTime predictionDate) { this.predictionDate = predictionDate; }
}
