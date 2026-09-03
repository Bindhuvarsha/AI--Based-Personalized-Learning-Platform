package com.learnpath.repository;

import com.learnpath.model.entity.EarlyWarning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EarlyWarningRepository extends JpaRepository<EarlyWarning, Long> {
    List<EarlyWarning> findByUserIdAndIsDismissedFalseOrderBySeverityDesc(Long userId);
    List<EarlyWarning> findByUserIdOrderByCreatedAtDesc(Long userId);
}
