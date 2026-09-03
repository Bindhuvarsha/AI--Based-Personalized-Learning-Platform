package com.learnpath.repository;

import com.learnpath.model.entity.SkillGapAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillGapAnalysisRepository extends JpaRepository<SkillGapAnalysis, Long> {
    List<SkillGapAnalysis> findByResumeDocumentUserId(Long userId);
    List<SkillGapAnalysis> findByResumeDocumentId(Long resumeDocumentId);
}
