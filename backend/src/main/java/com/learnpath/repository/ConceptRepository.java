package com.learnpath.repository;

import com.learnpath.model.entity.Concept;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConceptRepository extends JpaRepository<Concept, Long> {
    Optional<Concept> findByCode(String code);
    List<Concept> findByCategory(String category);
    List<Concept> findByCourseId(Long courseId);
}
