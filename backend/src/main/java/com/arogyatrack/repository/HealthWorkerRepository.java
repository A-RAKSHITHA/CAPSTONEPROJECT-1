package com.arogyatrack.repository;

import com.arogyatrack.entity.HealthWorker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HealthWorkerRepository extends JpaRepository<HealthWorker, Long> {
    Optional<HealthWorker> findByUserId(Long userId);
}
