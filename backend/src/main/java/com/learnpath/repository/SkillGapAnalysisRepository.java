package com.learnpath.repository;

import com.learnpath.model.entity.SkillGapAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillGapAnalysisRepository extends JpaRepository<SkillGapAnalysis, Long> {

    @Query("SELECT s FROM SkillGapAnalysis s WHERE s.resumeDocument.user.id = :userId")
    List<SkillGapAnalysis> findByResumeDocumentUserId(@Param("userId") Long userId);

    List<SkillGapAnalysis> findByResumeDocumentId(Long resumeDocumentId);
}
