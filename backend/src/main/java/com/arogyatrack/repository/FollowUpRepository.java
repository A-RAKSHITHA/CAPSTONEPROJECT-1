package com.arogyatrack.repository;

import com.arogyatrack.entity.FollowUp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {
    List<FollowUp> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<FollowUp> findByNurseIdOrderByCreatedAtDesc(Long nurseId);
    List<FollowUp> findByNurseIdAndStatus(Long nurseId, String status);
    Optional<FollowUp> findTopByUserIdOrderByCreatedAtDesc(Long userId);
    Long countByStatus(String status);
    Long countByNurseIdAndStatus(Long nurseId, String status);
}
