package com.learnpath.repository;

import com.learnpath.model.entity.MentorMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorMessageRepository extends JpaRepository<MentorMessage, Long> {
    List<MentorMessage> findByMentorProfileIdOrderByCreatedAtAsc(Long mentorProfileId);
    List<MentorMessage> findTop20ByMentorProfileIdOrderByCreatedAtDesc(Long mentorProfileId);
}
