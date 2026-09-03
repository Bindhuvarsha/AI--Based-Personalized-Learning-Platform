package com.learnpath.model.entity;

import com.learnpath.model.enums.AuditActionType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_audit_logs", indexes = {
    @Index(name = "idx_audit_correlation", columnList = "correlationId"),
    @Index(name = "idx_audit_user", columnList = "userId")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private AuditActionType actionType;

    @Column(nullable = false, length = 100)
    private String modelName; // e.g. "openai-gpt4o", "fastapi-rag-v1", "scikit-randomforest"

    @Column(nullable = false, length = 50)
    private String modelVersion;

    @Column(length = 50)
    @Builder.Default
    private String promptVersion = "v1.0";

    @Column(nullable = false, length = 100)
    private String correlationId;

    private Long userId;

    @Builder.Default
    private Long latencyMs = 0L;

    @Column(length = 20)
    @Builder.Default
    private String status = "SUCCESS";

    @Column(columnDefinition = "TEXT")
    private String metadataJson;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
