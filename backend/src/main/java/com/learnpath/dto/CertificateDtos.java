package com.learnpath.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

public class CertificateDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CertificateDto {
        private Long id;
        private String certificateId;
        private String recipientName;
        private String courseTitle;
        private Double score;
        private String grade;
        private String skillsAcquired;
        private String verificationHash;
        private LocalDateTime issueDate;
        private String status;
        private String verificationUrl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClaimCertificateRequest {
        private String courseTitle;
        private Double score;
        private List<String> skills;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyCertificateResponse {
        private String certificateId;
        private String recipientName;
        private String courseTitle;
        private Double score;
        private String grade;
        private String skillsAcquired;
        private String verificationHash;
        private LocalDateTime issueDate;
        private String status;
        private boolean isValid;
        private String issuer;
    }
}
