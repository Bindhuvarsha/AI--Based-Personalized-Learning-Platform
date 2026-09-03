package com.learnpath.repository;

import com.learnpath.model.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    @Query("SELECT a FROM QuizAttempt a WHERE a.user.id = :userId ORDER BY a.completedAt DESC")
    List<QuizAttempt> findByUserIdOrderByCompletedAtDesc(@Param("userId") Long userId);

    @Query("SELECT a FROM QuizAttempt a WHERE a.user.id = :userId AND a.topic.id = :topicId ORDER BY a.completedAt DESC")
    List<QuizAttempt> findByUserIdAndTopicIdOrderByCompletedAtDesc(@Param("userId") Long userId, @Param("topicId") Long topicId);

    @Query("SELECT a FROM QuizAttempt a WHERE a.user.id = :userId AND a.assessment.id = :assessmentId ORDER BY a.completedAt DESC")
    List<QuizAttempt> findByUserIdAndAssessmentIdOrderByCompletedAtDesc(@Param("userId") Long userId, @Param("assessmentId") Long assessmentId);
}
