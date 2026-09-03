package com.learnpath.repository;

import com.learnpath.model.entity.StudyPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudyPlanRepository extends JpaRepository<StudyPlan, Long> {

    @Query("SELECT p FROM StudyPlan p WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
    List<StudyPlan> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);

    @Query("SELECT p FROM StudyPlan p WHERE p.user.id = :userId AND p.active = true ORDER BY p.createdAt DESC")
    Optional<StudyPlan> findFirstByUserIdAndActiveTrueOrderByCreatedAtDesc(@Param("userId") Long userId);
}
