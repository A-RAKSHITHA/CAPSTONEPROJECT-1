package com.arogyatrack.dto;

import jakarta.validation.constraints.NotNull;

public class HealthWorkerAssignRequest {

    @NotNull(message = "Health worker ID is required")
    private Long nurseId;

    public HealthWorkerAssignRequest() {}

    public HealthWorkerAssignRequest(Long nurseId) {
        this.nurseId = nurseId;
    }

    public Long getNurseId() { return nurseId; }
    public void setNurseId(Long nurseId) { this.nurseId = nurseId; }
}
