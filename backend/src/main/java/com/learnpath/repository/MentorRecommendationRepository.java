package com.learnpath.repository;

import com.learnpath.model.entity.MentorRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorRecommendationRepository extends JpaRepository<MentorRecommendation, Long> {
    List<MentorRecommendation> findByMentorProfileIdAndIsActionedFalseOrderByPriorityAsc(Long mentorProfileId);
    List<MentorRecommendation> findByMentorProfileIdOrderByCreatedAtDesc(Long mentorProfileId);
}
