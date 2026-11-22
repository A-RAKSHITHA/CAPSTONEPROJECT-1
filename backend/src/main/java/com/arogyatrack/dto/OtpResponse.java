package com.arogyatrack.dto;

public class OtpResponse {
    private boolean success;
    private String message;
    private String email;
    private long expiresInSeconds;
    private String demoOtp;

    public OtpResponse() {}

    public OtpResponse(boolean success, String message, String email, long expiresInSeconds, String demoOtp) {
        this.success = success;
        this.message = message;
        this.email = email;
        this.expiresInSeconds = expiresInSeconds;
        this.demoOtp = demoOtp;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public long getExpiresInSeconds() {
        return expiresInSeconds;
    }

    public void setExpiresInSeconds(long expiresInSeconds) {
        this.expiresInSeconds = expiresInSeconds;
    }

    public String getDemoOtp() {
        return demoOtp;
    }

    public void setDemoOtp(String demoOtp) {
        this.demoOtp = demoOtp;
    }
}
