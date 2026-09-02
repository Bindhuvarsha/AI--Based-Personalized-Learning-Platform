package com.learnpath.dto;

import com.learnpath.model.enums.DifficultyLevel;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class QuizDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuizDetailsDto {
        private Long topicId;
        private String topicTitle;
        private String courseTitle;
        private DifficultyLevel currentDifficulty;
        private List<AssessmentDtos.QuestionDto> questions;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuizSubmitRequest {
        private Long topicId;
        private List<AssessmentDtos.AnswerSubmission> answers;
        private Integer timeSpentSeconds;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuizResultDto {
        private Long attemptId;
        private Long topicId;
        private String topicTitle;
        private int score;
        private int totalQuestions;
        private double percentage;
        private boolean passed;
        private String nextDifficulty;
        private String feedbackMessage;
        private List<AssessmentDtos.QuestionReviewDto> reviews;
        private LocalDateTime completedAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuizHistoryItemDto {
        private Long attemptId;
        private Long topicId;
        private String topicTitle;
        private int score;
        private int totalQuestions;
        private double percentage;
        private boolean passed;
        private Integer timeSpentSeconds;
        private LocalDateTime completedAt;
    }
}
