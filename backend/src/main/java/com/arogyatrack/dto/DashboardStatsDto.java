package com.arogyatrack.dto;

import java.util.Map;

public class DashboardStatsDto {

    private Long totalCommunityMembers = 0L;
    private Long totalHealthWorkers = 0L;
    private Long totalAssessments = 0L;
    private Long priorityReviews = 0L;
    private Long pendingFollowups = 0L;
    private Long completedFollowups = 0L;
    private Long unreadAlerts = 0L;

    // Trends and Distribution
    private Map<String, Long> assessmentsByResult;
    private Map<String, Long> followupsByStatus;

    public DashboardStatsDto() {}

    // Getters and Setters
    public Long getTotalCommunityMembers() { return totalCommunityMembers; }
    public void setTotalCommunityMembers(Long totalCommunityMembers) { this.totalCommunityMembers = totalCommunityMembers; }

    public Long getTotalHealthWorkers() { return totalHealthWorkers; }
    public void setTotalHealthWorkers(Long totalHealthWorkers) { this.totalHealthWorkers = totalHealthWorkers; }

    public Long getTotalAssessments() { return totalAssessments; }
    public void setTotalAssessments(Long totalAssessments) { this.totalAssessments = totalAssessments; }

    public Long getPriorityReviews() { return priorityReviews; }
    public void setPriorityReviews(Long priorityReviews) { this.priorityReviews = priorityReviews; }

    public Long getPendingFollowups() { return pendingFollowups; }
    public void setPendingFollowups(Long pendingFollowups) { this.pendingFollowups = pendingFollowups; }

    public Long getCompletedFollowups() { return completedFollowups; }
    public void setCompletedFollowups(Long completedFollowups) { this.completedFollowups = completedFollowups; }

    public Long getUnreadAlerts() { return unreadAlerts; }
    public void setUnreadAlerts(Long unreadAlerts) { this.unreadAlerts = unreadAlerts; }

    public Map<String, Long> getAssessmentsByResult() { return assessmentsByResult; }
    public void setAssessmentsByResult(Map<String, Long> assessmentsByResult) { this.assessmentsByResult = assessmentsByResult; }

    public Map<String, Long> getFollowupsByStatus() { return followupsByStatus; }
    public void setFollowupsByStatus(Map<String, Long> followupsByStatus) { this.followupsByStatus = followupsByStatus; }
}
