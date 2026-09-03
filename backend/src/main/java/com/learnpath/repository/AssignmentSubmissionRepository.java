package com.learnpath.repository;

import com.learnpath.model.entity.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {

    @Query("SELECT s FROM AssignmentSubmission s WHERE s.user.id = :userId")
    List<AssignmentSubmission> findByUserId(@Param("userId") Long userId);

    @Query("SELECT s FROM AssignmentSubmission s WHERE s.assignment.id = :assignmentId AND s.user.id = :userId")
    Optional<AssignmentSubmission> findByAssignmentIdAndUserId(@Param("assignmentId") Long assignmentId, @Param("userId") Long userId);

    @Query("SELECT s FROM AssignmentSubmission s WHERE s.assignment.id = :assignmentId")
    List<AssignmentSubmission> findByAssignmentId(@Param("assignmentId") Long assignmentId);
}
