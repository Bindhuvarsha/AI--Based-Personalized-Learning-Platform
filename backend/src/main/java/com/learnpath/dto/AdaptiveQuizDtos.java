package com.learnpath.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class AdaptiveQuizDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdaptiveSessionStartResponse {
        private Long sessionId;
        private Long topicId;
        private String topicTitle;
        private String currentDifficulty;
        private AssessmentDtos.QuestionDto firstQuestion;
        private int questionNumber;
        private int totalPlannedQuestions;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdaptiveSubmitAnswerRequest {
        private Long sessionId;
        private Long questionId;
        private Integer selectedOptionIndex;
        private Integer timeSpentSeconds;
        private Integer confidenceScore; // 1 to 5
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdaptiveSubmitAnswerResponse {
        private boolean isCorrect;
        private String explanation;
        private String previousDifficulty;
        private String currentDifficulty;
        private boolean difficultyChanged;
        private String changeReason;
        private AssessmentDtos.QuestionDto nextQuestion;
        private boolean isQuizCompleted;
        private int currentScore;
        private int totalAnswered;
        private Double currentMasteryScore;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DifficultyAdjustmentDto {
        private int questionNumber;
        private String previousDifficulty;
        private String newDifficulty;
        private String reason;
        private String triggerEvent;
    }
}
