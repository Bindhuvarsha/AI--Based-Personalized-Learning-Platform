package com.learnpath.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class StudyPlannerDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlannerPreferenceDto {
        private Double dailyAvailableHours;
        private String preferredStudyTime;
        private String weeklyRestDays;
        private LocalDate targetExamDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudySessionDto {
        private Long id;
        private String title;
        private LocalDate sessionDate;
        private LocalTime startTime;
        private Integer durationMinutes;
        private String sessionType; // STUDY, REVISION, PRACTICE_QUIZ, REST
        private Boolean isCompleted;
        private String explanationScheduled;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeeklyScheduleResponse {
        private LocalDate weekStartDate;
        private LocalDate weekEndDate;
        private Integer totalPlannedMinutes;
        private Integer completedMinutes;
        private List<StudySessionDto> sessions;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RescheduleSessionRequest {
        private Long sessionId;
        private LocalDate newDate;
        private String reason;
    }
}
