package com.arogyatrack.repository;

import com.arogyatrack.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findByUserIdOrderByPredictionDateDesc(Long userId);
    Optional<Prediction> findTopByUserIdOrderByPredictionDateDesc(Long userId);
    List<Prediction> findByPriorityReviewTrueOrderByPredictionDateDesc();
    
    @Query("SELECT p FROM Prediction p WHERE p.user.assignedNurse.id = :nurseId AND p.priorityReview = true ORDER BY p.predictionDate DESC")
    List<Prediction> findPriorityReviewsForNurse(Long nurseId);

    Long countByPriorityReviewTrue();
    Long countByPrediction(Integer prediction);
}
