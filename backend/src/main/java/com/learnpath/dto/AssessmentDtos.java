package com.learnpath.dto;

import com.learnpath.model.enums.DifficultyLevel;
import com.learnpath.model.enums.KnowledgeLevel;
import com.learnpath.model.enums.QuestionType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class AssessmentDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AssessmentResponse {
        private Long id;
        private String title;
        private String subject;
        private DifficultyLevel difficulty;
        private String description;
        private List<QuestionDto> questions;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionDto {
        private Long id;
        private Long topicId;
        private String topicTitle;
        private String questionText;
        private QuestionType questionType;
        private List<String> options;
        private DifficultyLevel difficulty;
        private Integer points;
        // Notice correctOptionIndex and explanation are NOT included when fetching for taking assessment!
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SubmitAssessmentRequest {
        private Long assessmentId;
        private List<AnswerSubmission> answers;
        private Integer totalTimeSpentSeconds;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnswerSubmission {
        private Long questionId;
        private Integer selectedOptionIndex;
        private Integer timeSpentSeconds;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AssessmentResultResponse {
        private Long attemptId;
        private Long assessmentId;
        private String assessmentTitle;
        private String subject;
        private int totalQuestions;
        private int correctAnswers;
        private double overallScore;
        private boolean passed;
        private List<TopicScoreResult> topicScores;
        private List<QuestionReviewDto> questionReviews;
        private LocalDateTime completedAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TopicScoreResult {
        private Long topicId;
        private String topicTitle;
        private int totalQuestions;
        private int correctQuestions;
        private double percentage;
        private KnowledgeLevel knowledgeLevel;
        private String statusRecommendation;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionReviewDto {
        private Long questionId;
        private String questionText;
        private List<String> options;
        private Integer selectedOptionIndex;
        private Integer correctOptionIndex;
        private boolean correct;
        private String explanation;
        private String topicTitle;
    }
}
