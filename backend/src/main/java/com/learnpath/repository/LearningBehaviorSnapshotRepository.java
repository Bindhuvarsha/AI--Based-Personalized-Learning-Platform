package com.learnpath.repository;

import com.learnpath.model.entity.LearningBehaviorSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningBehaviorSnapshotRepository extends JpaRepository<LearningBehaviorSnapshot, Long> {
    List<LearningBehaviorSnapshot> findByUserIdOrderBySnapshotDateDesc(Long userId);
    List<LearningBehaviorSnapshot> findTop5ByUserIdOrderBySnapshotDateDesc(Long userId);
}
