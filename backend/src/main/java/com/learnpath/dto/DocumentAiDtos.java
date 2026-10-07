package com.learnpath.dto;

import lombok.*;

import java.util.List;

public class DocumentAiDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FlashcardDto {
        private String term;
        private String definition;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SummarizeContentRequest {
        private String text;
        private String documentTitle;
        private String language;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SummarizeContentResponse {
        private String documentTitle;
        private String executiveSummary;
        private List<String> keyTakeaways;
        private List<FlashcardDto> flashcards;
        private int estimatedReadTimeMinutes;
        private int totalWords;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DocQuizRequest {
        private String text;
        private String documentTitle;
        private Integer count;
        private String difficulty;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DocQuizQuestionDto {
        private String questionText;
        private List<String> options;
        private int correctOptionIndex;
        private String explanation;
        private String difficulty;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DocQuizResponse {
        private String documentTitle;
        private String difficulty;
        private List<DocQuizQuestionDto> questions;
    }
}
