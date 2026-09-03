package com.learnpath.repository;

import com.learnpath.model.entity.CodeSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodeSubmissionRepository extends JpaRepository<CodeSubmission, Long> {
    List<CodeSubmission> findByUserIdOrderBySubmittedAtDesc(Long userId);
    List<CodeSubmission> findByExerciseIdAndUserId(Long exerciseId, Long userId);
}
