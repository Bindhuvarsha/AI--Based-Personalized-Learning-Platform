package com.learnpath.repository;

import com.learnpath.model.entity.CodeExecution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CodeExecutionRepository extends JpaRepository<CodeExecution, Long> {
    Optional<CodeExecution> findBySubmissionId(Long submissionId);
}
