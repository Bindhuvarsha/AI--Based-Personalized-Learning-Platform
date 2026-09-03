package com.learnpath.repository;

import com.learnpath.model.entity.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {
    List<StudyGroup> findByIsPrivateFalse();
    List<StudyGroup> findByTargetCareerContainingIgnoreCase(String career);
    List<StudyGroup> findByCreatedByUserId(Long userId);
}
