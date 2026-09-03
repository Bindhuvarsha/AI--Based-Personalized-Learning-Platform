package com.learnpath.repository;

import com.learnpath.model.entity.ConceptRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConceptRelationRepository extends JpaRepository<ConceptRelation, Long> {
    List<ConceptRelation> findBySourceConceptId(Long sourceConceptId);
    List<ConceptRelation> findByTargetConceptId(Long targetConceptId);
    List<ConceptRelation> findByRelationType(String relationType);
}
