package com.learnpath.repository;

import com.learnpath.model.entity.LearnerConceptStatus;
import com.learnpath.model.enums.KnowledgeLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearnerConceptStatusRepository extends JpaRepository<LearnerConceptStatus, Long> {
    Optional<LearnerConceptStatus> findByUserIdAndConceptId(Long userId, Long conceptId);
    List<LearnerConceptStatus> findByUserId(Long userId);
    List<LearnerConceptStatus> findByUserIdAndKnowledgeLevel(Long userId, KnowledgeLevel knowledgeLevel);
}
