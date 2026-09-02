package com.learnpath.repository;

import com.learnpath.model.entity.Assessment;
import com.learnpath.model.enums.DifficultyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findBySubjectIgnoreCase(String subject);
    List<Assessment> findBySubjectIgnoreCaseAndDifficulty(String subject, DifficultyLevel difficulty);
}
