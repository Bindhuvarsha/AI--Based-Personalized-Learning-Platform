package com.learnpath.repository;

import com.learnpath.model.entity.StudyPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudyPlanRepository extends JpaRepository<StudyPlan, Long> {
    List<StudyPlan> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<StudyPlan> findFirstByUserIdAndActiveTrueOrderByCreatedAtDesc(Long userId);
}
