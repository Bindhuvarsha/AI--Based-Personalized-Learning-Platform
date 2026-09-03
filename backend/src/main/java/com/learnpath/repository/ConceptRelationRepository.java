package com.learnpath.repository;

import com.learnpath.model.entity.ConceptRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConceptRelationRepository extends JpaRepository<ConceptRelation, Long> {

    @Query("SELECT r FROM ConceptRelation r WHERE r.sourceConcept.id = :sourceConceptId")
    List<ConceptRelation> findBySourceConceptId(@Param("sourceConceptId") Long sourceConceptId);

    @Query("SELECT r FROM ConceptRelation r WHERE r.targetConcept.id = :targetConceptId")
    List<ConceptRelation> findByTargetConceptId(@Param("targetConceptId") Long targetConceptId);

    List<ConceptRelation> findByRelationType(String relationType);
}
