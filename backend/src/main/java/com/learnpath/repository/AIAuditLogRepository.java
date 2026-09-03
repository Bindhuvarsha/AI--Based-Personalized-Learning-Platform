package com.learnpath.repository;

import com.learnpath.model.entity.AIAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AIAuditLogRepository extends JpaRepository<AIAuditLog, Long> {
    List<AIAuditLog> findByUserIdOrderByTimestampDesc(Long userId);
    List<AIAuditLog> findByCorrelationId(String correlationId);
}
