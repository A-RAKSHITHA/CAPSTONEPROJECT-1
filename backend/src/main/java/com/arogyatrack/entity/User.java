package com.arogyatrack.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "phone_number", nullable = false, length = 30)
    private String phoneNumber;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 50)
    private String role; // ROLE_USER, ROLE_NURSE, ROLE_ADMIN

    @Column(name = "village_community", nullable = false, length = 150)
    private String villageCommunity;

    @Column(nullable = false, length = 150)
    private String district;

    private Integer age;

    @Column(length = 30)
    private String gender;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_nurse_id")
    private User assignedNurse;

    @Lob
    @Column(name = "profile_photo", columnDefinition = "LONGTEXT")
    private String profilePhoto;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.role == null) {
            this.role = "ROLE_USER";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public User() {}

    public User(Long id, String fullName, String email, String phoneNumber, String password, String role, String villageCommunity, String district) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.role = role;
        this.villageCommunity = villageCommunity;
        this.district = district;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getVillageCommunity() { return villageCommunity; }
    public void setVillageCommunity(String villageCommunity) { this.villageCommunity = villageCommunity; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public User getAssignedNurse() { return assignedNurse; }
    public void setAssignedNurse(User assignedNurse) { this.assignedNurse = assignedNurse; }

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
