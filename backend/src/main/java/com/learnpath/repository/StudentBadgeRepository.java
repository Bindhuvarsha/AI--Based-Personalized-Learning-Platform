package com.learnpath.repository;

import com.learnpath.model.entity.StudentBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentBadgeRepository extends JpaRepository<StudentBadge, Long> {
    List<StudentBadge> findByUserId(Long userId);
    Optional<StudentBadge> findByUserIdAndBadgeCode(Long userId, String badgeCode);
}
