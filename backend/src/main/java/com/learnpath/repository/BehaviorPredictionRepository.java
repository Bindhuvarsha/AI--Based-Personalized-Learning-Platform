package com.learnpath.repository;

import com.learnpath.model.entity.BehaviorPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BehaviorPredictionRepository extends JpaRepository<BehaviorPrediction, Long> {
    Optional<BehaviorPrediction> findFirstByUserIdOrderByPredictedAtDesc(Long userId);
    List<BehaviorPrediction> findByUserIdOrderByPredictedAtDesc(Long userId);
}
