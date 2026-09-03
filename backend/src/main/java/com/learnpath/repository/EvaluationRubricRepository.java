package com.learnpath.repository;

import com.learnpath.model.entity.EvaluationRubric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRubricRepository extends JpaRepository<EvaluationRubric, Long> {

    List<EvaluationRubric> findByAssignmentId(Long assignmentId);
}
