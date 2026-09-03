package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "career_roadmap_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerRoadmapItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "career_roadmap_id", nullable = false)
    private CareerRoadmap careerRoadmap;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 50)
    @Builder.Default
    private String category = "CONCEPT"; // CONCEPT, PROJECT, ASSESSMENT

    @Builder.Default
    private Integer orderIndex = 1;

    @Builder.Default
    private Boolean isCompleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "concept_id")
    private Concept concept;
}
