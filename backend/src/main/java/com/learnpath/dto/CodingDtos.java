package com.learnpath.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class CodingDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CodingExerciseDto {
        private Long id;
        private String title;
        private String description;
        private String language;
        private String difficulty;
        private String starterCode;
        private String testCasesJson;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CodeRunRequest {
        private Long exerciseId;
        private String sourceCode;
        private String language;
        private String customInput;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CodeRunResponse {
        private Long submissionId;
        private String executionStatus; // SUCCESS, COMPILATION_ERROR, RUNTIME_ERROR, TIMEOUT
        private String stdout;
        private String stderr;
        private Long executionTimeMs;
        private Long memoryKb;
        private List<String> syntaxErrors;
        private List<String> codeSmells;
        private List<String> securityConcerns;
        private String timeComplexity;
        private String spaceComplexity;
        private String suggestions;
        private String correctedCodeDiff;
        private Boolean allTestsPassed;
    }
}
