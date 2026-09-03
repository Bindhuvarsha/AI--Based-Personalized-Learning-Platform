package com.learnpath.repository;

import com.learnpath.model.entity.ImageQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageQuestionRepository extends JpaRepository<ImageQuestion, Long> {
    List<ImageQuestion> findByUserIdOrderByUploadedAtDesc(Long userId);
}
