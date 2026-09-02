package com.learnpath.dto;

import com.learnpath.model.enums.DifficultyLevel;
import com.learnpath.model.enums.MaterialType;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class CourseDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CourseResponse {
        private Long id;
        private String title;
        private String description;
        private String category;
        private DifficultyLevel difficulty;
        private boolean published;
        private int topicsCount;
        private List<TopicSummaryDto> topics;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TopicSummaryDto {
        private Long id;
        private String title;
        private String description;
        private Integer orderIndex;
        private String prerequisites;
        private Integer estimatedMinutes;
        private int materialsCount;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TopicDetailResponse {
        private Long id;
        private Long courseId;
        private String courseTitle;
        private String title;
        private String description;
        private Integer orderIndex;
        private String prerequisites;
        private Integer estimatedMinutes;
        private List<LearningMaterialDto> materials;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LearningMaterialDto {
        private Long id;
        private Long topicId;
        private String title;
        private MaterialType materialType;
        private String content;
        private String fileUrl;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateCourseRequest {
        @NotBlank(message = "Title is required")
        private String title;
        private String description;
        @NotBlank(message = "Category is required")
        private String category;
        private DifficultyLevel difficulty;
        private Boolean published;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateTopicRequest {
        @NotBlank(message = "Title is required")
        private String title;
        private String description;
        private Integer orderIndex;
        private String prerequisites;
        private Integer estimatedMinutes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateMaterialRequest {
        @NotBlank(message = "Title is required")
        private String title;
        private MaterialType materialType;
        private String content;
        private String fileUrl;
    }
}
