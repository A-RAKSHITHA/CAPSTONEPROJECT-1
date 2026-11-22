package com.arogyatrack.repository;

import com.arogyatrack.entity.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {
    List<HealthRecord> findByUserIdOrderByRecordedAtDesc(Long userId);
    Optional<HealthRecord> findTopByUserIdOrderByRecordedAtDesc(Long userId);
    Long countByUserId(Long userId);
}
