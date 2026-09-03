package com.learnpath.repository;

import com.learnpath.model.entity.JobTarget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobTargetRepository extends JpaRepository<JobTarget, Long> {
    Optional<JobTarget> findByTitleIgnoreCase(String title);
}
