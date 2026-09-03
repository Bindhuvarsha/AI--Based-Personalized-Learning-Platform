package com.learnpath.repository;

import com.learnpath.model.entity.DifficultyAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DifficultyAdjustmentRepository extends JpaRepository<DifficultyAdjustment, Long> {
    List<DifficultyAdjustment> findBySessionIdOrderByAdjustedAtAsc(Long sessionId);
}
