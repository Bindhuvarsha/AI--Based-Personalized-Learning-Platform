package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "career_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String skillName;

    @Column(length = 100)
    private String category;

    @Column(nullable = false, length = 100)
    private String targetRole; // e.g. "Backend Developer", "Data Scientist"

    @Builder.Default
    private Integer importanceLevel = 5; // 1 to 5

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "concept_id")
    private Concept relatedConcept;
}
