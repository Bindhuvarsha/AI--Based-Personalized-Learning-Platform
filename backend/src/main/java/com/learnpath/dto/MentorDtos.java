package com.learnpath.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class MentorDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MentorProfileDto {
        private String persona;
        private String learningGoal;
        private String targetCareer;
        private Integer weeklyStudyTargetHours;
        private String tone;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MentorChatRequest {
        private String message;
        private String language; // ENGLISH, HINDI, KANNADA
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MentorChatResponse {
        private String reply;
        private String language;
        private List<String> evidenceCited;
        private List<MentorRecommendationDto> recommendations;
        private LocalDateTime timestamp;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MentorRecommendationDto {
        private Long id;
        private String title;
        private String reason;
        private String actionType;
        private String actionPayload;
        private Integer priority;
        private Boolean isActioned;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyAdviceResponse {
        private String date;
        private String greeting;
        private String dailyGoal;
        private String rationale;
        private List<String> priorityTopics;
        private String motivationalQuote;
        private Integer streakDays;
        private List<MentorRecommendationDto> recommendations;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeeklyReviewResponse {
        private Integer totalStudyHours;
        private Integer conceptsMastered;
        private Double quizAverage;
        private String velocityAssessment; // ON_TRACK, SLOWING_DOWN, SURGING
        private List<String> areasToReview;
        private List<String> nextWeekFocus;
    }
}
