package com.learnpath.repository;

import com.learnpath.model.entity.ScheduleAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleAdjustmentRepository extends JpaRepository<ScheduleAdjustment, Long> {
    List<ScheduleAdjustment> findByUserIdOrderByAdjustedAtDesc(Long userId);
}
