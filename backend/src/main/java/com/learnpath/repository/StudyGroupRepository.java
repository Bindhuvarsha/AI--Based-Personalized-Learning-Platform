package com.learnpath.repository;

import com.learnpath.model.entity.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {

    @Query("SELECT g FROM StudyGroup g WHERE g.isPrivate = false")
    List<StudyGroup> findByIsPrivateFalse();

    List<StudyGroup> findByTargetCareerContainingIgnoreCase(String career);

    @Query("SELECT g FROM StudyGroup g WHERE g.createdBy.id = :userId")
    List<StudyGroup> findByCreatedByUserId(@Param("userId") Long userId);
}
