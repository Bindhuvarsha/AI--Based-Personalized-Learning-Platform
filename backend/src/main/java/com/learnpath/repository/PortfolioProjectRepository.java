package com.learnpath.repository;

import com.learnpath.model.entity.PortfolioProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioProjectRepository extends JpaRepository<PortfolioProject, Long> {
    List<PortfolioProject> findByCareerPathId(Long careerPathId);
}
