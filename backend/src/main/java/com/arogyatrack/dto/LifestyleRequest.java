package com.arogyatrack.dto;

import jakarta.validation.constraints.NotBlank;

public class LifestyleRequest {

    private Long userId;

    @NotBlank(message = "Food habits information is required")
    private String foodHabits;

    @NotBlank(message = "Water intake is required")
    private String waterIntake;

    @NotBlank(message = "Physical activity is required")
    private String physicalActivity;

    private String exerciseFrequency;
    private String sleepDuration;
    private String smokingStatus;
    private String alcoholConsumption;

    public LifestyleRequest() {}

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

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
}
