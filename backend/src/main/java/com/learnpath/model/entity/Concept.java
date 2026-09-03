package com.learnpath.model.entity;

import com.learnpath.model.enums.DifficultyLevel;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "concepts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Concept {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String code;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 100)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private DifficultyLevel difficulty = DifficultyLevel.BEGINNER;

    @Builder.Default
    private Integer estimatedHours = 5;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @OneToMany(mappedBy = "sourceConcept", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ConceptRelation> outgoingRelations = new ArrayList<>();

    @OneToMany(mappedBy = "targetConcept", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ConceptRelation> incomingRelations = new ArrayList<>();
}
