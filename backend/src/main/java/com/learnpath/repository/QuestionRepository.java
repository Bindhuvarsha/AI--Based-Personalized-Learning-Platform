package com.learnpath.repository;

import com.learnpath.model.entity.Question;
import com.learnpath.model.enums.DifficultyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByAssessmentId(Long assessmentId);
    List<Question> findByTopicId(Long topicId);
    List<Question> findByTopicIdAndDifficulty(Long topicId, DifficultyLevel difficulty);
}
