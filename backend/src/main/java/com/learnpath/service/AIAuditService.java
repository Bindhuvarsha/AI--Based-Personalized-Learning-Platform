package com.learnpath.service;

import com.learnpath.model.entity.AIAuditLog;
import com.learnpath.model.enums.AuditActionType;
import com.learnpath.repository.AIAuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIAuditService {

    private final AIAuditLogRepository auditLogRepository;

    @Transactional
    public void logAIAction(AuditActionType actionType, String modelName, String modelVersion,
                            String promptVersion, Long userId, long latencyMs, String status, String metadataJson) {
        try {
            AIAuditLog auditLog = AIAuditLog.builder()
                    .actionType(actionType)
                    .modelName(modelName != null ? modelName : "deterministic-rule-engine-v1")
                    .modelVersion(modelVersion != null ? modelVersion : "1.0.0")
                    .promptVersion(promptVersion != null ? promptVersion : "v1.0")
                    .correlationId(UUID.randomUUID().toString())
                    .userId(userId)
                    .latencyMs(latencyMs)
                    .status(status)
                    .metadataJson(metadataJson)
                    .timestamp(LocalDateTime.now())
                    .build();

            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.warn("Failed to record AI audit log: {}", e.getMessage());
        }
    }
}
