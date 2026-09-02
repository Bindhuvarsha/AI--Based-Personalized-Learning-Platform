package com.learnpath.repository;

import com.learnpath.model.entity.Course;
import com.learnpath.model.enums.DifficultyLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByPublishedTrue();
    List<Course> findByCategoryIgnoreCaseAndPublishedTrue(String category);
    List<Course> findByDifficultyAndPublishedTrue(DifficultyLevel difficulty);
}
