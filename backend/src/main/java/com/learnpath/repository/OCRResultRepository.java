package com.learnpath.repository;

import com.learnpath.model.entity.OCRResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OCRResultRepository extends JpaRepository<OCRResult, Long> {
    Optional<OCRResult> findByImageQuestionId(Long imageQuestionId);
}
