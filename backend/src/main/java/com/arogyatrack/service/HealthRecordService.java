package com.arogyatrack.service;

import com.arogyatrack.dto.AssessmentResponse;
import com.arogyatrack.dto.HealthRecordRequest;
import com.arogyatrack.entity.*;
import com.arogyatrack.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class HealthRecordService {

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private PredictionRepository predictionRepository;

    @Autowired
    private FollowUpRepository followUpRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private MlServiceClient mlServiceClient;

    @Transactional
    public AssessmentResponse submitHealthCheck(HealthRecordRequest request, Long authUserId) {
        Long targetUserId = request.getUserId() != null ? request.getUserId() : authUserId;

        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("Community member not found"));

        // 1. Create and save new HealthRecord (never overwrite historical records)
        HealthRecord record = new HealthRecord();
        record.setUser(user);
        record.setAge(request.getAge());
        record.setBp(request.getBp());
        record.setSg(request.getSg());
        record.setAl(request.getAl());
        record.setSu(request.getSu());
        record.setRbc(request.getRbc());
        record.setPc(request.getPc());
        record.setPcc(request.getPcc());
        record.setBa(request.getBa());
        record.setBgr(request.getBgr());
        record.setBu(request.getBu());
        record.setSc(request.getSc());
        record.setSod(request.getSod());
        record.setPot(request.getPot());
        record.setHemo(request.getHemo());
        record.setPcv(request.getPcv());
        record.setWc(request.getWc());
        record.setRc(request.getRc());
        record.setHtn(request.getHtn());
        record.setDm(request.getDm());
        record.setCad(request.getCad());
        record.setAppet(request.getAppet());
        record.setPe(request.getPe());
        record.setAne(request.getAne());

        HealthRecord savedRecord = healthRecordRepository.save(record);

        // 2. Call ML Service with finalized features
        Map<String, Object> featureMap = request.toMlFeatureMap();
        Map<String, Object> mlResult = mlServiceClient.getAssessment(featureMap);

        // Extract ML outputs
        Integer consensusPred = (Integer) mlResult.getOrDefault("consensus_prediction", 0);
        String assessmentResult = (String) mlResult.getOrDefault("assessment_result", "Low Risk");
        String assessmentSummary = (String) mlResult.getOrDefault("assessment_summary", "Assessment completed.");
        Boolean isPriority = (Boolean) mlResult.getOrDefault("priority_review", false);
        String priorityLevel = (String) mlResult.getOrDefault("priority_level", "Low");
        Double riskProb = ((Number) mlResult.getOrDefault("risk_probability", 0.0)).doubleValue();

        @SuppressWarnings("unchecked")
        Map<String, Object> lrData = (Map<String, Object>) mlResult.get("logistic_regression");
        Integer lrPred = lrData != null ? (Integer) lrData.get("prediction") : null;
        Double lrProb = lrData != null && lrData.get("probability") != null ? ((Number) lrData.get("probability")).doubleValue() : null;
        String lrRiskLabel = lrData != null ? (String) lrData.get("risk_label") : null;

        @SuppressWarnings("unchecked")
        Map<String, Object> rfData = (Map<String, Object>) mlResult.get("random_forest");
        Integer rfPred = rfData != null ? (Integer) rfData.get("prediction") : null;
        Double rfProb = rfData != null && rfData.get("probability") != null ? ((Number) rfData.get("probability")).doubleValue() : null;
        String rfRiskLabel = rfData != null ? (String) rfData.get("risk_label") : null;

        // 3. Store Prediction in MySQL
        Prediction prediction = new Prediction();
        prediction.setUser(user);
        prediction.setHealthRecord(savedRecord);
        prediction.setModelName("Random Forest + Logistic Regression Dual Ensemble");
        prediction.setPrediction(consensusPred);
        prediction.setPredictionProbability(riskProb);
        prediction.setAssessmentResult(assessmentResult);
        prediction.setPriorityReview(isPriority);
        prediction.setPriorityLevel(priorityLevel);
        prediction.setLrPrediction(lrPred);
        prediction.setLrProbability(lrProb);
        prediction.setRfPrediction(rfPred);
        prediction.setRfProbability(rfProb);

        Prediction savedPrediction = predictionRepository.save(prediction);

        // 4. Follow-up & Priority Review Workflow
        User assignedNurse = user.getAssignedNurse();
        FollowUp followUp = null;

        if (isPriority) {
            // Apply priority review rule
            followUp = new FollowUp();
            followUp.setUser(user);
            followUp.setNurse(assignedNurse != null ? assignedNurse : user); // Fallback if no nurse assigned yet
            followUp.setPrediction(savedPrediction);
            followUp.setPriority(priorityLevel);
            followUp.setStatus("Pending");
            followUp.setFollowupDate(LocalDate.now());
            followUp.setRemarks("Auto-scheduled based on health assessment risk prioritization.");
            followUp.setNextFollowupDate(LocalDate.now().plusDays(2));
            followUpRepository.save(followUp);

            // Alert for Assigned Health Worker
            if (assignedNurse != null) {
                notificationService.createNotification(
                        user,
                        assignedNurse,
                        "Priority Review: " + user.getFullName() + " has completed an assessment requiring health worker review.",
                        "PRIORITY_REVIEW"
                );
            }
        }

        // Notification for User
        notificationService.createNotification(
                user,
                assignedNurse,
                isPriority
                        ? "Your health check has been completed and shared with your health worker for priority review."
                        : "Your health check has been completed. Readings are within monitored community ranges.",
                "ASSESSMENT"
        );

        // 5. Construct and return response
        AssessmentResponse response = new AssessmentResponse();
        response.setPredictionId(savedPrediction.getId());
        response.setRecordId(savedRecord.getId());
        response.setUserId(user.getId());
        response.setAssessmentResult(assessmentResult);
        response.setAssessmentSummary(assessmentSummary);
        response.setPriorityReview(isPriority);
        response.setPriorityLevel(priorityLevel);
        response.setRiskProbability(riskProb);
        response.setAssessmentDate(savedPrediction.getPredictionDate());
        response.setFollowUpStatus(followUp != null ? followUp.getStatus() : "No Action Required");
        response.setHealthWorkerReviewStatus(isPriority ? "Pending Health Worker Review" : "Standard Monitoring");

        response.setLrPrediction(lrPred);
        response.setLrProbability(lrProb);
        response.setLrRiskLabel(lrRiskLabel);

        response.setRfPrediction(rfPred);
        response.setRfProbability(rfProb);
        response.setRfRiskLabel(rfRiskLabel);

        return response;
    }

    public List<HealthRecord> getUserHealthRecords(Long userId) {
        return healthRecordRepository.findByUserIdOrderByRecordedAtDesc(userId);
    }

    public HealthRecord getHealthRecordById(Long recordId) {
        return healthRecordRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Health record not found with ID: " + recordId));
    }

    public AssessmentResponse getLatestAssessment(Long userId) {
        Prediction pred = predictionRepository.findTopByUserIdOrderByPredictionDateDesc(userId)
                .orElse(null);

        if (pred == null) return null;

        FollowUp fu = followUpRepository.findTopByUserIdOrderByCreatedAtDesc(userId).orElse(null);

        AssessmentResponse response = new AssessmentResponse();
        response.setPredictionId(pred.getId());
        response.setRecordId(pred.getHealthRecord().getId());
        response.setUserId(userId);
        response.setAssessmentResult(pred.getAssessmentResult());
        response.setAssessmentSummary(pred.getPriorityReview()
                ? "Assessment indicates increased risk and requires health worker review."
                : "Assessment indicates stable readings within monitored community ranges.");
        response.setPriorityReview(pred.getPriorityReview());
        response.setPriorityLevel(pred.getPriorityLevel());
        response.setRiskProbability(pred.getPredictionProbability());
        response.setAssessmentDate(pred.getPredictionDate());
        response.setFollowUpStatus(fu != null ? fu.getStatus() : "No Follow-up Scheduled");
        response.setHealthWorkerReviewStatus(fu != null ? fu.getStatus() : "Not Reviewed");

        response.setLrPrediction(pred.getLrPrediction());
        response.setLrProbability(pred.getLrProbability());
        response.setLrRiskLabel(pred.getLrPrediction() != null && pred.getLrPrediction() == 1 ? "Increased Risk" : "Low Risk");

        response.setRfPrediction(pred.getRfPrediction());
        response.setRfProbability(pred.getRfProbability());
        response.setRfRiskLabel(pred.getRfPrediction() != null && pred.getRfPrediction() == 1 ? "Increased Risk" : "Low Risk");

        return response;
    }
}
