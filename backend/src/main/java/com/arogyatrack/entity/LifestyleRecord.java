package com.arogyatrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lifestyle_records")
public class LifestyleRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "food_habits")
    private String foodHabits;

    @Column(name = "water_intake", length = 100)
    private String waterIntake;

    @Column(name = "physical_activity")
    private String physicalActivity;

    @Column(name = "exercise_frequency", length = 100)
    private String exerciseFrequency;

    @Column(name = "sleep_duration", length = 100)
    private String sleepDuration;

    @Column(name = "smoking_status", length = 100)
    private String smokingStatus;

    @Column(name = "alcohol_consumption", length = 100)
    private String alcoholConsumption;

    @Column(name = "recorded_at", updatable = false)
    private LocalDateTime recordedAt;

    @PrePersist
    protected void onCreate() {
        this.recordedAt = LocalDateTime.now();
    }

    public LifestyleRecord() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getFoodHabits() { return foodHabits; }
    public void setFoodHabits(String foodHabits) { this.foodHabits = foodHabits; }

    public String getWaterIntake() { return waterIntake; }
    public void setWaterIntake(String waterIntake) { this.waterIntake = waterIntake; }

    public String getPhysicalActivity() { return physicalActivity; }
    public void setPhysicalActivity(String physicalActivity) { this.physicalActivity = physicalActivity; }

    public String getExerciseFrequency() { return exerciseFrequency; }
    public void setExerciseFrequency(String exerciseFrequency) { this.exerciseFrequency = exerciseFrequency; }

    public String getSleepDuration() { return sleepDuration; }
    public void setSleepDuration(String sleepDuration) { this.sleepDuration = sleepDuration; }

    public String getSmokingStatus() { return smokingStatus; }
    public void setSmokingStatus(String smokingStatus) { this.smokingStatus = smokingStatus; }

    public String getAlcoholConsumption() { return alcoholConsumption; }
    public void setAlcoholConsumption(String alcoholConsumption) { this.alcoholConsumption = alcoholConsumption; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
