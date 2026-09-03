package com.learnpath.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class KnowledgeGraphDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GraphNodeDto {
        private Long id;
        private String code;
        private String name;
        private String category;
        private String difficulty;
        private Double masteryScore;
        private String status; // MASTERED, DEVELOPING, WEAK, LOCKED, RECOMMENDED
        private Integer estimatedHours;
        private Long courseId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GraphEdgeDto {
        private Long id;
        private String source;
        private String target;
        private String relationType;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KnowledgeGraphResponse {
        private List<GraphNodeDto> nodes;
        private List<GraphEdgeDto> edges;
        private int totalConcepts;
        private int masteredCount;
        private int weakCount;
        private int developingCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrerequisiteLookupResponse {
        private GraphNodeDto concept;
        private List<GraphNodeDto> prerequisites;
        private List<GraphNodeDto> dependents;
    }
}
