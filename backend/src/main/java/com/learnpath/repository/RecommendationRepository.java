package com.learnpath.repository;

import com.learnpath.model.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByUserIdAndDismissedFalseOrderByPriorityScoreDescCreatedAtDesc(Long userId);
    void deleteByUserId(Long userId);
}
