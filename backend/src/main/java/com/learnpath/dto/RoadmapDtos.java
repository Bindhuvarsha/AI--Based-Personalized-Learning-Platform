package com.learnpath.dto;

import com.learnpath.model.enums.KnowledgeLevel;
import com.learnpath.model.enums.ProgressStatus;
import lombok.*;

import java.util.List;

public class RoadmapDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoadmapResponse {
        private Long courseId;
        private String courseTitle;
        private int totalTopics;
        private int completedTopics;
        private double progressPercentage;
        private List<RoadmapNode> nodes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoadmapNode {
        private Long topicId;
        private String title;
        private String description;
        private Integer orderIndex;
        private List<Long> prerequisiteTopicIds;
        private boolean isUnlocked;
        private ProgressStatus status;
        private KnowledgeLevel knowledgeLevel;
        private Double masteryScore;
        private Integer estimatedMinutes;
        private boolean recommendedNext;
    }
}
