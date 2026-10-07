package com.learnpath.dto;

import lombok.*;

import java.util.List;

public class TeacherDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScoreDistributionBucket {
        private String range;
        private int studentCount;
        private double percentage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopicStruggleStat {
        private Long topicId;
        private String topicTitle;
        private double failureRate;
        private double averageAttempts;
        private String recommendedIntervention;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AtRiskStudentSummary {
        private Long studentId;
        private String studentName;
        private String email;
        private String riskSeverity;
        private String triggerFactor;
        private String lastActive;
        private String actionSuggested;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CohortAnalyticsResponse {
        private int totalStudents;
        private int activeStudents7Days;
        private double averageClassScore;
        private double syllabusCompletionRate;
        private int atRiskStudentCount;
        private double averageStudyHours;
        private List<ScoreDistributionBucket> scoreDistribution;
        private List<TopicStruggleStat> strugglingTopics;
        private List<AtRiskStudentSummary> atRiskStudents;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeacherInterventionRequest {
        private Long studentId;
        private String message;
        private Long recommendedTopicId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeacherInterventionResponse {
        private boolean success;
        private String message;
    }
}
