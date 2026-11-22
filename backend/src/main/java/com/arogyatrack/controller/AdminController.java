package com.arogyatrack.controller;

import com.arogyatrack.dto.DashboardStatsDto;
import com.arogyatrack.dto.HealthWorkerAssignRequest;
import com.arogyatrack.entity.FollowUp;
import com.arogyatrack.entity.Prediction;
import com.arogyatrack.entity.User;
import com.arogyatrack.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/statistics")
    public ResponseEntity<DashboardStatsDto> getStatistics() {
        return ResponseEntity.ok(adminService.getDashboardStatistics());
    }

    @GetMapping("/trends")
    public ResponseEntity<DashboardStatsDto> getTrends() {
        return ResponseEntity.ok(adminService.getDashboardStatistics());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllCommunityMembers());
    }

    @GetMapping("/health-workers")
    public ResponseEntity<List<User>> getAllHealthWorkers() {
        return ResponseEntity.ok(adminService.getAllHealthWorkers());
    }

    @GetMapping("/assessments")
    public ResponseEntity<List<Prediction>> getAllAssessments() {
        return ResponseEntity.ok(adminService.getAllAssessments());
    }

    @GetMapping("/predictions")
    public ResponseEntity<List<Prediction>> getAllPredictions() {
        return ResponseEntity.ok(adminService.getAllAssessments());
    }

    @GetMapping("/followups")
    public ResponseEntity<List<FollowUp>> getAllFollowUps() {
        return ResponseEntity.ok(adminService.getAllFollowUps());
    }

    @PutMapping("/users/{userId}/assign-nurse")
    public ResponseEntity<User> assignHealthWorker(
            @PathVariable Long userId,
            @Valid @RequestBody HealthWorkerAssignRequest request) {
        User updated = adminService.assignHealthWorker(userId, request.getNurseId());
        return ResponseEntity.ok(updated);
    }
}
