package com.arogyatrack.dto;

public class AuthResponse {

    private String token;
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String villageCommunity;
    private String district;
    private Integer age;
    private String gender;
    private Long assignedNurseId;
    private String assignedNurseName;
    private String profilePhoto;

    public AuthResponse() {}

    public AuthResponse(String token, Long id, String fullName, String email, String role, String villageCommunity, String district) {
        this.token = token;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.villageCommunity = villageCommunity;
        this.district = district;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

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

    public Long getAssignedNurseId() { return assignedNurseId; }
    public void setAssignedNurseId(Long assignedNurseId) { this.assignedNurseId = assignedNurseId; }

    public String getAssignedNurseName() { return assignedNurseName; }
    public void setAssignedNurseName(String assignedNurseName) { this.assignedNurseName = assignedNurseName; }

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }
}
