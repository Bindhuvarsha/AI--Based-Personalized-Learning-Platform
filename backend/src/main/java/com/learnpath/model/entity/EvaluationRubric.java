package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "evaluation_rubrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationRubric {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @Column(nullable = false, length = 100)
    private String criterionName; // e.g. "Algorithm Correctness", "Code Style", "Analysis Depth"

    @Column(nullable = false)
    private Integer maxPoints;

    @Column(columnDefinition = "TEXT")
    private String description;
}
