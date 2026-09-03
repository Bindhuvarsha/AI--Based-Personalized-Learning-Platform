package com.learnpath.repository;

import com.learnpath.model.entity.ImageSolution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImageSolutionRepository extends JpaRepository<ImageSolution, Long> {
    Optional<ImageSolution> findByImageQuestionId(Long imageQuestionId);
}
