package com.learnpath.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class AssignmentFeatureDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RubricDto {
        private Long id;
        private String criterionName;
        private Integer maxPoints;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignmentSummaryDto {
        private Long id;
        private Long courseId;
        private String title;
        private String description;
        private Integer maxScore;
        private LocalDateTime dueDate;
        private List<RubricDto> rubrics;
        private String submissionStatus;
        private Double earnedScore;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignmentSubmitRequest {
        private String contentText;
        private String fileUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EvaluationResultDto {
        private Long submissionId;
        private Double overallScore;
        private Double maxScore;
        private Double percentage;
        private List<String> strengths;
        private List<String> weaknesses;
        private List<String> missingConcepts;
        private List<String> quotedEvidence;
        private String improvementSuggestions;
        private String rubricBreakdownJson;
        private Boolean isOverriddenByTeacher;
        private Double teacherOverriddenScore;
        private String teacherComments;
        private LocalDateTime evaluatedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeacherOverrideRequest {
        private Double overriddenScore;
        private String teacherComments;
    }
}
