package com.learnpath.repository;

import com.learnpath.model.entity.StudyPlanItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyPlanItemRepository extends JpaRepository<StudyPlanItem, Long> {
    List<StudyPlanItem> findByStudyPlanIdOrderByDayNumberAsc(Long studyPlanId);
}
