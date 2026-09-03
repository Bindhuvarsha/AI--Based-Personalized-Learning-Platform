package com.learnpath.repository;

import com.learnpath.model.entity.MentorMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorMessageRepository extends JpaRepository<MentorMessage, Long> {

    @Query("SELECT m FROM MentorMessage m WHERE m.mentorProfile.id = :mentorProfileId ORDER BY m.createdAt ASC")
    List<MentorMessage> findByMentorProfileIdOrderByCreatedAtAsc(@Param("mentorProfileId") Long mentorProfileId);

    @Query("SELECT m FROM MentorMessage m WHERE m.mentorProfile.id = :mentorProfileId ORDER BY m.createdAt DESC LIMIT 20")
    List<MentorMessage> findTop20ByMentorProfileIdOrderByCreatedAtDesc(@Param("mentorProfileId") Long mentorProfileId);
}
