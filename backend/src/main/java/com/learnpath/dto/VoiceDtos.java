package com.learnpath.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class VoiceDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VoiceProcessResponse {
        private Long sessionId;
        private String userTranscript;
        private String aiResponseText;
        private String audioUrl;
        private Integer durationSeconds;
        private String language;
        private List<String> sources;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VoiceMessageDto {
        private Long id;
        private String speaker;
        private String transcript;
        private String audioUrl;
        private Integer durationSeconds;
        private String language;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VoiceSessionDetailsDto {
        private Long sessionId;
        private String sessionTitle;
        private LocalDateTime startedAt;
        private List<VoiceMessageDto> messages;
    }
}
