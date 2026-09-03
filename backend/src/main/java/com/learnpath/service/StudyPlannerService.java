package com.learnpath.service;

import com.learnpath.dto.StudyPlannerDtos.*;
import com.learnpath.model.entity.PlannerPreference;
import com.learnpath.model.entity.ScheduleAdjustment;
import com.learnpath.model.entity.StudySession;
import com.learnpath.model.entity.User;
import com.learnpath.repository.PlannerPreferenceRepository;
import com.learnpath.repository.ScheduleAdjustmentRepository;
import com.learnpath.repository.StudySessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudyPlannerService {

    private final StudySessionRepository sessionRepository;
    private final PlannerPreferenceRepository preferenceRepository;
    private final ScheduleAdjustmentRepository adjustmentRepository;

    @Transactional
    public WeeklyScheduleResponse getWeeklySchedule(User user) {
        LocalDate startOfWeek = LocalDate.now().with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = startOfWeek.plusDays(6);

        List<StudySession> existing = sessionRepository.findByUserIdAndSessionDateBetween(user.getId(), startOfWeek, endOfWeek);

        // Auto-seed initial 5 days of smart spaced-repetition sessions if none exist for this week
        if (existing.isEmpty()) {
            existing = List.of(
                    StudySession.builder().user(user).title("Spring Boot JPA Relationships & Indexing").sessionDate(startOfWeek).startTime(LocalTime.of(18, 0)).durationMinutes(45).sessionType("STUDY").explanationScheduled("Core career concept scheduled based on weak knowledge graph node.").build(),
                    StudySession.builder().user(user).title("Spaced Review: REST API Status Codes").sessionDate(startOfWeek.plusDays(1)).startTime(LocalTime.of(18, 0)).durationMinutes(30).sessionType("REVISION").explanationScheduled("48-hour spaced repetition review interval.").build(),
                    StudySession.builder().user(user).title("Hands-on Coding: Two-Pointer & Sliding Window").sessionDate(startOfWeek.plusDays(2)).startTime(LocalTime.of(18, 0)).durationMinutes(60).sessionType("STUDY").explanationScheduled("DSA Milestone prerequisite for technical interviews.").build(),
                    StudySession.builder().user(user).title("Adaptive Quiz: Database Constraints & ACID").sessionDate(startOfWeek.plusDays(3)).startTime(LocalTime.of(19, 0)).durationMinutes(25).sessionType("PRACTICE_QUIZ").explanationScheduled("Mastery checkpoint before advanced transaction locking.").build(),
                    StudySession.builder().user(user).title("Weekly Consolidation & Socratic Mentor Check-In").sessionDate(startOfWeek.plusDays(4)).startTime(LocalTime.of(18, 0)).durationMinutes(40).sessionType("STUDY").explanationScheduled("Weekly velocity review and goal reconciliation.").build()
            );
            sessionRepository.saveAll(existing);
        }

        int totalMins = existing.stream().mapToInt(StudySession::getDurationMinutes).sum();
        int completedMins = existing.stream().filter(StudySession::getIsCompleted).mapToInt(StudySession::getDurationMinutes).sum();

        List<StudySessionDto> dtos = existing.stream()
                .map(s -> StudySessionDto.builder()
                        .id(s.getId())
                        .title(s.getTitle())
                        .sessionDate(s.getSessionDate())
                        .startTime(s.getStartTime())
                        .durationMinutes(s.getDurationMinutes())
                        .sessionType(s.getSessionType())
                        .isCompleted(s.getIsCompleted())
                        .explanationScheduled(s.getExplanationScheduled())
                        .build())
                .collect(Collectors.toList());

        return WeeklyScheduleResponse.builder()
                .weekStartDate(startOfWeek)
                .weekEndDate(endOfWeek)
                .totalPlannedMinutes(totalMins)
                .completedMinutes(completedMins)
                .sessions(dtos)
                .build();
    }

    @Transactional
    public void toggleSessionCompletion(User user, Long sessionId) {
        StudySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));
        session.setIsCompleted(!session.getIsCompleted());
        sessionRepository.save(session);
    }

    @Transactional
    public void rescheduleSession(User user, RescheduleSessionRequest request) {
        StudySession session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + request.getSessionId()));

        LocalDate oldDate = session.getSessionDate();
        session.setSessionDate(request.getNewDate());
        sessionRepository.save(session);

        adjustmentRepository.save(ScheduleAdjustment.builder()
                .user(user)
                .originalDate(oldDate)
                .newDate(request.getNewDate())
                .reason(request.getReason() != null ? request.getReason() : "Student requested timetable adjustment")
                .adjustedAt(LocalDateTime.now())
                .build());
    }
}
