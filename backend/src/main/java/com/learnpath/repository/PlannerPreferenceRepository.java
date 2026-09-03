package com.learnpath.repository;

import com.learnpath.model.entity.PlannerPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlannerPreferenceRepository extends JpaRepository<PlannerPreference, Long> {
    Optional<PlannerPreference> findByUserId(Long userId);
}
