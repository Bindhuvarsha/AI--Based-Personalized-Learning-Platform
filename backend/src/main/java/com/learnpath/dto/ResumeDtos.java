package com.learnpath.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class ResumeDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExtractedSkillDto {
        private Long id;
        private String skillName;
        private String category;
        private String evidenceText;
        private Boolean isVerified;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResumeUploadResponse {
        private Long documentId;
        private String filename;
        private int extractedSkillsCount;
        private String previewText;
        private List<ExtractedSkillDto> extractedSkills;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillItemDto {
        private String skill;
        private String status; // MATCHED, PARTIAL, MISSING
        private String evidenceOrAction;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResumeRecommendationDto {
        private String title;
        private String category; // TOPIC, PROJECT, CERTIFICATION, RESUME_FORMAT
        private String recommendationText;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillGapAnalysisResponse {
        private Long analysisId;
        private String jobTitle;
        private Double matchPercentage;
        private List<SkillItemDto> matchedSkills;
        private List<SkillItemDto> partialSkills;
        private List<SkillItemDto> missingSkills;
        private List<ResumeRecommendationDto> recommendations;
    }
}
