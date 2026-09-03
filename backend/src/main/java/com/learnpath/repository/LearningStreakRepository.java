package com.learnpath.repository;

import com.learnpath.model.entity.LearningStreak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LearningStreakRepository extends JpaRepository<LearningStreak, Long> {
    Optional<LearningStreak> findByUserId(Long userId);
}
