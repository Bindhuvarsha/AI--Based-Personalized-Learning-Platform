package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "concept_relations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConceptRelation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_concept_id", nullable = false)
    private Concept sourceConcept;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_concept_id", nullable = false)
    private Concept targetConcept;

    // PREREQUISITE (source -> target), RELATED, ADVANCED_EXTENSION
    @Column(nullable = false, length = 50)
    @Builder.Default
    private String relationType = "PREREQUISITE";

    @Column(length = 255)
    private String description;
}
