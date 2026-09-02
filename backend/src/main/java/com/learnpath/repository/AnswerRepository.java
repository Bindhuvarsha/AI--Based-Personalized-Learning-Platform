package com.learnpath.repository;

import com.learnpath.model.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByUserId(Long userId);
    List<Answer> findByQuizAttemptId(Long quizAttemptId);
}
