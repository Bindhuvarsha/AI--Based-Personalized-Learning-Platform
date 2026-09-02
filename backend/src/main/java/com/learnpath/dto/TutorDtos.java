package com.learnpath.dto;

import com.learnpath.model.enums.LanguagePreference;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class TutorDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TutorChatRequest {
        private Long conversationId;

        @NotBlank(message = "Question message is required")
        private String message;

        private LanguagePreference language; // ENGLISH, HINDI, KANNADA
        private String documentFilter;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TutorChatResponse {
        private Long conversationId;
        private String response;
        private LanguagePreference language;
        private List<SourceCitation> sources;
        private LocalDateTime timestamp;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SourceCitation {
        private String documentTitle;
        private Integer pageNumber;
        private Integer chunkIndex;
        private String excerpt;
        private Double similarityScore;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ConversationSummaryDto {
        private Long id;
        private String title;
        private LanguagePreference language;
        private int messageCount;
        private LocalDateTime updatedAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DocumentUploadResponse {
        private String documentTitle;
        private int totalChunks;
        private int totalPages;
        private String message;
    }
}
