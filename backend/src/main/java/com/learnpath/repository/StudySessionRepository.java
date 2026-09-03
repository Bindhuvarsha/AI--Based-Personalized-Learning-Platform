package com.learnpath.repository;

import com.learnpath.model.entity.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, Long> {

    List<StudySession> findByUserIdOrderBySessionDateAscStartTimeAsc(Long userId);

    List<StudySession> findByUserIdAndSessionDateBetween(Long userId, LocalDate from, LocalDate to);

    @Query("SELECT s FROM StudySession s WHERE s.user.id = :userId AND s.isCompleted = false")
    List<StudySession> findByUserIdAndIsCompletedFalse(@Param("userId") Long userId);
}
