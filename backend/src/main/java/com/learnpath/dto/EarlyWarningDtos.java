package com.learnpath.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class EarlyWarningDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EarlyWarningDto {
        private Long id;
        private String warningType;
        private String severity; // LOW, MEDIUM, HIGH, URGENT
        private String evidenceText;
        private String recommendedAction;
        private Boolean isDismissed;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NotificationDto {
        private Long id;
        private String title;
        private String message;
        private String notificationType;
        private Boolean isRead;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DismissWarningRequest {
        private Integer snoozeDays;
        private String actionTaken;
    }
}
