package com.learnpath.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class BehaviorDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BehaviorPredictionResponse {
        private String riskCategory; // LOW, MODERATE, HIGH, CRITICAL
        private Double struggleProbability;
        private List<String> contributingFactors;
        private String recommendedIntervention;
        private String modelVersion;
        private String disclaimer;
        private Double avgQuizScore;
        private Double scoreTrendSlope;
        private Integer inactivityDays;
        private Double completionRate;
        private LocalDateTime predictedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModelMetricsDto {
        private String modelName;
        private String versionString;
        private String algorithm;
        private Double accuracy;
        private Double precision;
        private Double recall;
        private Boolean isActive;
        private LocalDateTime deployedAt;
    }
}
