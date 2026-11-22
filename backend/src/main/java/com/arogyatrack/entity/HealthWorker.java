package com.arogyatrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_workers")
public class HealthWorker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 150)
    private String specialization;

    @Column(name = "assigned_area", nullable = false, length = 150)
    private String assignedArea;

    @Column(length = 150)
    private String qualification;

    @Column(length = 50)
    private String status; // ACTIVE, ON_LEAVE

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "ACTIVE";
        if (this.specialization == null) this.specialization = "Community Health Care";
    }

    public HealthWorker() {}

    public HealthWorker(User user, String assignedArea, String qualification) {
        this.user = user;
        this.assignedArea = assignedArea;
        this.qualification = qualification;
        this.status = "ACTIVE";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getAssignedArea() { return assignedArea; }
    public void setAssignedArea(String assignedArea) { this.assignedArea = assignedArea; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
