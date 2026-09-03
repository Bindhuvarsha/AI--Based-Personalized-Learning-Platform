package com.learnpath.repository;

import com.learnpath.model.entity.CareerRoadmapItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CareerRoadmapItemRepository extends JpaRepository<CareerRoadmapItem, Long> {

    @Query("SELECT i FROM CareerRoadmapItem i WHERE i.careerRoadmap.id = :roadmapId ORDER BY i.orderIndex ASC")
    List<CareerRoadmapItem> findByRoadmapIdOrderByOrderIndexAsc(@Param("roadmapId") Long roadmapId);

    List<CareerRoadmapItem> findByCareerRoadmapIdOrderByOrderIndexAsc(Long careerRoadmapId);
}
