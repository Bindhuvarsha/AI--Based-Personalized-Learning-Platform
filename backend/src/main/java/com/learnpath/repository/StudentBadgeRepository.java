package com.learnpath.repository;

import com.learnpath.model.entity.StudentBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentBadgeRepository extends JpaRepository<StudentBadge, Long> {

    @Query("SELECT sb FROM StudentBadge sb WHERE sb.user.id = :userId")
    List<StudentBadge> findByUserId(@Param("userId") Long userId);

    @Query("SELECT sb FROM StudentBadge sb WHERE sb.user.id = :userId AND sb.badge.code = :badgeCode")
    Optional<StudentBadge> findByUserIdAndBadgeCode(@Param("userId") Long userId, @Param("badgeCode") String badgeCode);
}
