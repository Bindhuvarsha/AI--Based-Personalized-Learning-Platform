package com.learnpath.repository;

import com.learnpath.model.entity.StudentLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentLevelRepository extends JpaRepository<StudentLevel, Long> {
    Optional<StudentLevel> findByUserId(Long userId);
}
