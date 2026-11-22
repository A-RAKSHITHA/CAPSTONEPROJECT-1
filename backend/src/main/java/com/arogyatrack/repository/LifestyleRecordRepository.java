package com.arogyatrack.repository;

import com.arogyatrack.entity.LifestyleRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LifestyleRecordRepository extends JpaRepository<LifestyleRecord, Long> {
    List<LifestyleRecord> findByUserIdOrderByRecordedAtDesc(Long userId);
    Optional<LifestyleRecord> findTopByUserIdOrderByRecordedAtDesc(Long userId);
}
