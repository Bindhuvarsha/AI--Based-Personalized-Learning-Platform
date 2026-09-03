package com.learnpath.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class VisionDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageSolveResponse {
        private Long questionId;
        private String originalFilename;
        private String imageUrl;
        private String extractedText;
        private Double ocrConfidence;
        private String stepByStepExplanation;
        private String finalAnswer;
        private List<String> formulaDerivations;
        private List<String> relatedTopics;
        private Double solutionConfidence;
        private String disclaimer;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageHistoryDto {
        private Long id;
        private String originalFilename;
        private String imageUrl;
        private String extractedSnippet;
        private String finalAnswerSnippet;
        private LocalDateTime uploadedAt;
    }
}
