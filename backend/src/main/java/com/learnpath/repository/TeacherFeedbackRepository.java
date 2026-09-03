package com.learnpath.repository;

import com.learnpath.model.entity.TeacherFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherFeedbackRepository extends JpaRepository<TeacherFeedback, Long> {

    @Query("SELECT f FROM TeacherFeedback f WHERE f.submission.id = :submissionId")
    Optional<TeacherFeedback> findBySubmissionId(@Param("submissionId") Long submissionId);

    @Query("SELECT f FROM TeacherFeedback f WHERE f.teacher.id = :teacherId")
    List<TeacherFeedback> findByTeacherId(@Param("teacherId") Long teacherId);
}
