package com.learnpath.repository;

import com.learnpath.model.entity.ResumeRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeRecommendationRepository extends JpaRepository<ResumeRecommendation, Long> {
    List<ResumeRecommendation> findByAnalysisId(Long analysisId);
}
