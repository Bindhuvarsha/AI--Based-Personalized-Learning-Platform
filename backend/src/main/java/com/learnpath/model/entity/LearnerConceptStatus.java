package com.learnpath.model.entity;

import com.learnpath.model.enums.KnowledgeLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "learner_concept_statuses", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "concept_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerConceptStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "concept_id", nullable = false)
    private Concept concept;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private KnowledgeLevel knowledgeLevel = KnowledgeLevel.NOT_STARTED;

    @Builder.Default
    private Double masteryScore = 0.0;

    @Builder.Default
    private Boolean unlocked = true;

    private LocalDateTime lastAssessedAt;
}
