package com.learnpath.repository;

import com.learnpath.model.entity.CareerRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerRequirementRepository extends JpaRepository<CareerRequirement, Long> {

    List<CareerRequirement> findByCareerPathIdOrderByPriorityOrderAsc(Long careerPathId);
}
