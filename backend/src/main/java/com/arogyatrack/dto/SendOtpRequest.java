package com.arogyatrack.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class SendOtpRequest {

    @NotBlank(message = "Email address is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    private String fullName;

    public SendOtpRequest() {}

    public SendOtpRequest(String email, String fullName) {
        this.email = email;
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}
