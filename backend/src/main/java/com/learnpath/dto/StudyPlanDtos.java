package com.learnpath.dto;

import com.learnpath.model.enums.KnowledgeLevel;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class StudyPlanDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GeneratePlanRequest {
        @NotBlank(message = "Goal is required")
        private String goalTitle;

        @Min(value = 7, message = "Duration must be at least 7 days")
        private Integer durationDays; // 7 or 30

        @Min(value = 1, message = "Weekly hours must be at least 1")
        private Integer availableHoursPerWeek;

        private Long courseId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudyPlanResponse {
        private Long id;
        private String goalTitle;
        private Integer durationDays;
        private Integer availableHoursPerWeek;
        private KnowledgeLevel startingKnowledgeLevel;
        private LocalDate startDate;
        private LocalDate targetDate;
        private boolean active;
        private int totalItems;
        private int completedItems;
        private double completionPercentage;
        private List<StudyPlanItemDto> items;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudyPlanItemDto {
        private Long id;
        private Integer dayNumber;
        private LocalDate scheduledDate;
        private Long topicId;
        private String topicTitle;
        private String title;
        private String description;
        private Integer estimatedMinutes;
        private boolean completed;
        private LocalDateTime completedAt;
    }
}
