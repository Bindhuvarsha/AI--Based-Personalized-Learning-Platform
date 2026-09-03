package com.learnpath.repository;

import com.learnpath.model.entity.AdaptiveQuizSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdaptiveQuizSessionRepository extends JpaRepository<AdaptiveQuizSession, Long> {

    @Query("SELECT s FROM AdaptiveQuizSession s WHERE s.user.id = :userId ORDER BY s.startedAt DESC")
    List<AdaptiveQuizSession> findByUserIdOrderByStartedAtDesc(@Param("userId") Long userId);

    @Query("SELECT s FROM AdaptiveQuizSession s WHERE s.user.id = :userId AND s.topic.id = :topicId AND s.isCompleted = false")
    Optional<AdaptiveQuizSession> findByUserIdAndTopicIdAndIsCompletedFalse(@Param("userId") Long userId, @Param("topicId") Long topicId);
}
