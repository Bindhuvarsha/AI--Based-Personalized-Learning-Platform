package com.learnpath.repository;

import com.learnpath.model.entity.CodingExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodingExerciseRepository extends JpaRepository<CodingExercise, Long> {
    List<CodingExercise> findByLanguage(com.learnpath.model.enums.ProgrammingLanguage language);
    List<CodingExercise> findByDifficulty(com.learnpath.model.enums.DifficultyLevel difficulty);
}
