package com.learnpath.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class StudyGroupDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudyGroupDto {
        private Long id;
        private String name;
        private String description;
        private String topicFocus;
        private String targetCareer;
        private String language;
        private Integer memberCount;
        private Integer maxMembers;
        private Boolean isJoined;
        private Boolean isOwner;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateStudyGroupRequest {
        private String name;
        private String description;
        private String topicFocus;
        private String targetCareer;
        private String language;
        private Integer maxMembers;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GroupMessageDto {
        private Long id;
        private Long senderId;
        private String senderName;
        private String content;
        private Boolean isCurrentUser;
        private LocalDateTime sentAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PostMessageRequest {
        private String content;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GroupRecommendationDto {
        private Long groupId;
        private String groupName;
        private String topicFocus;
        private Double matchScore;
        private String matchReason;
    }
}
