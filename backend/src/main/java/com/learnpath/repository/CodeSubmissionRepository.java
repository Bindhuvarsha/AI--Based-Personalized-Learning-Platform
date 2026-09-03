package com.learnpath.repository;

import com.learnpath.model.entity.CodeSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodeSubmissionRepository extends JpaRepository<CodeSubmission, Long> {

    @Query("SELECT s FROM CodeSubmission s WHERE s.user.id = :userId ORDER BY s.submittedAt DESC")
    List<CodeSubmission> findByUserIdOrderBySubmittedAtDesc(@Param("userId") Long userId);

    @Query("SELECT s FROM CodeSubmission s WHERE s.exercise.id = :exerciseId AND s.user.id = :userId")
    List<CodeSubmission> findByExerciseIdAndUserId(@Param("exerciseId") Long exerciseId, @Param("userId") Long userId);
}
