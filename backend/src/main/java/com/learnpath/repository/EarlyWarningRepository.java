package com.learnpath.repository;

import com.learnpath.model.entity.EarlyWarning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EarlyWarningRepository extends JpaRepository<EarlyWarning, Long> {

    @Query("SELECT w FROM EarlyWarning w WHERE w.user.id = :userId AND w.isDismissed = false ORDER BY w.severity DESC")
    List<EarlyWarning> findByUserIdAndIsDismissedFalseOrderBySeverityDesc(@Param("userId") Long userId);

    List<EarlyWarning> findByUserIdOrderByCreatedAtDesc(Long userId);
}
