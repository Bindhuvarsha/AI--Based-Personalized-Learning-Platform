package com.learnpath.dto;

import com.learnpath.model.enums.RecommendationType;
import lombok.*;

import java.time.LocalDateTime;

public class RecommendationDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecommendationItemDto {
        private Long id;
        private RecommendationType type;
        private Long targetId;
        private String title;
        private String reason;
        private Double priorityScore;
        private String category;
        private LocalDateTime createdAt;
    }
}
