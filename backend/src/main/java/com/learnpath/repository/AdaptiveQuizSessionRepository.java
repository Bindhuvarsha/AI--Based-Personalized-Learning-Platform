package com.learnpath.repository;

import com.learnpath.model.entity.AdaptiveQuizSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdaptiveQuizSessionRepository extends JpaRepository<AdaptiveQuizSession, Long> {
    List<AdaptiveQuizSession> findByUserIdOrderByStartedAtDesc(Long userId);
    Optional<AdaptiveQuizSession> findByUserIdAndTopicIdAndIsCompletedFalse(Long userId, Long topicId);
}
