package com.learnpath.repository;

import com.learnpath.model.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserIdOrderByCompletedAtDesc(Long userId);
    List<QuizAttempt> findByUserIdAndTopicIdOrderByCompletedAtDesc(Long userId, Long topicId);
    List<QuizAttempt> findByUserIdAndAssessmentIdOrderByCompletedAtDesc(Long userId, Long assessmentId);
}
