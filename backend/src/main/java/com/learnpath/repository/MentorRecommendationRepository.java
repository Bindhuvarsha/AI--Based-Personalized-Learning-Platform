package com.learnpath.repository;

import com.learnpath.model.entity.MentorRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorRecommendationRepository extends JpaRepository<MentorRecommendation, Long> {

    @Query("SELECT r FROM MentorRecommendation r WHERE r.mentorProfile.id = :mentorProfileId AND r.isActioned = false ORDER BY r.priority ASC")
    List<MentorRecommendation> findByMentorProfileIdAndIsActionedFalseOrderByPriorityAsc(@Param("mentorProfileId") Long mentorProfileId);

    @Query("SELECT r FROM MentorRecommendation r WHERE r.mentorProfile.id = :mentorProfileId ORDER BY r.createdAt DESC")
    List<MentorRecommendation> findByMentorProfileIdOrderByCreatedAtDesc(@Param("mentorProfileId") Long mentorProfileId);
}
