package com.learnpath.repository;

import com.learnpath.model.entity.Course;
import com.learnpath.model.enums.DifficultyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    @Query("SELECT c FROM Course c WHERE c.published = true")
    List<Course> findByPublishedTrue();

    @Query("SELECT c FROM Course c WHERE LOWER(c.category) = LOWER(:category) AND c.published = true")
    List<Course> findByCategoryIgnoreCaseAndPublishedTrue(@Param("category") String category);

    @Query("SELECT c FROM Course c WHERE c.difficulty = :difficulty AND c.published = true")
    List<Course> findByDifficultyAndPublishedTrue(@Param("difficulty") DifficultyLevel difficulty);
}
