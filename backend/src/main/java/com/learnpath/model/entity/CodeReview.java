package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "code_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false, unique = true)
    private CodeSubmission submission;

    @Column(columnDefinition = "TEXT")
    private String syntaxErrors;

    @Column(columnDefinition = "TEXT")
    private String codeSmells;

    @Column(columnDefinition = "TEXT")
    private String securityConcerns;

    @Column(length = 100)
    private String timeComplexity;

    @Column(length = 100)
    private String spaceComplexity;

    @Column(columnDefinition = "TEXT")
    private String suggestions;

    @Column(columnDefinition = "TEXT")
    private String correctedCodeDiff;

    @Builder.Default
    private LocalDateTime reviewedAt = LocalDateTime.now();
}
