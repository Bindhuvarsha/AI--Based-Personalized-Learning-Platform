package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "evaluation_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false, unique = true)
    private AssignmentSubmission submission;

    @Column(nullable = false)
    private Double overallScore;

    @Column(nullable = false)
    private Double maxScore;

    // JSON array of strings
    @Column(columnDefinition = "TEXT")
    private String strengths;

    // JSON array of strings
    @Column(columnDefinition = "TEXT")
    private String weaknesses;

    // JSON array of missing concepts
    @Column(columnDefinition = "TEXT")
    private String missingConcepts;

    // JSON array of quotes from student submission supporting score
    @Column(columnDefinition = "TEXT")
    private String quotedEvidence;

    @Column(columnDefinition = "TEXT")
    private String improvementSuggestions;

    @Column(columnDefinition = "TEXT")
    @Builder.Default
    private String rubricBreakdownJson = "[]";

    @Builder.Default
    private LocalDateTime evaluatedAt = LocalDateTime.now();
}
