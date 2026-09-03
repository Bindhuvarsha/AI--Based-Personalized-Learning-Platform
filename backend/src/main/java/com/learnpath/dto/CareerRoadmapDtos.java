package com.learnpath.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class CareerRoadmapDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CareerPathDto {
        private Long id;
        private String title;
        private String description;
        private String averageSalaryRange;
        private String industryDemand;
        private String icon;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CareerRoadmapItemDto {
        private Long id;
        private String title;
        private String category;
        private Integer orderIndex;
        private Boolean isCompleted;
        private String conceptCode;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PortfolioProjectDto {
        private Long id;
        private String title;
        private String description;
        private String skillsCovered;
        private String starterRepoUrl;
        private String difficulty;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CareerRoadmapResponse {
        private Long roadmapId;
        private String careerTitle;
        private String careerDescription;
        private Double readinessScore;
        private Integer estimatedWeeks;
        private List<CareerRoadmapItemDto> items;
        private List<PortfolioProjectDto> portfolioProjects;
    }
}
