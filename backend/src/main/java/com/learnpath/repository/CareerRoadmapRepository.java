package com.learnpath.repository;

import com.learnpath.model.entity.CareerRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CareerRoadmapRepository extends JpaRepository<CareerRoadmap, Long> {
    Optional<CareerRoadmap> findByUserIdAndCareerPathId(Long userId, Long careerPathId);
    List<CareerRoadmap> findByUserId(Long userId);
}
