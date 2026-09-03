package com.learnpath.repository;

import com.learnpath.model.entity.VoiceMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoiceMessageRepository extends JpaRepository<VoiceMessage, Long> {

    @Query("SELECT m FROM VoiceMessage m WHERE m.voiceSession.id = :sessionId ORDER BY m.createdAt ASC")
    List<VoiceMessage> findBySessionIdOrderByCreatedAtAsc(@Param("sessionId") Long sessionId);

    List<VoiceMessage> findByVoiceSessionIdOrderByCreatedAtAsc(Long voiceSessionId);
}
