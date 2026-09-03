package com.learnpath.repository;

import com.learnpath.model.entity.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    List<StudySession> findByUserIdOrderBySessionDateAscStartTimeAsc(Long userId);
    List<StudySession> findByUserIdAndSessionDateBetween(Long userId, LocalDate from, LocalDate to);
    List<StudySession> findByUserIdAndIsCompletedFalse(Long userId);
}
