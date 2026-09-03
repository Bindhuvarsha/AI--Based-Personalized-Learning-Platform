package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "image_solutions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageSolution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "image_question_id", nullable = false, unique = true)
    private ImageQuestion imageQuestion;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String stepByStepExplanation;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String finalAnswer;

    @Column(columnDefinition = "TEXT")
    private String formulaDerivations;

    @Column(columnDefinition = "TEXT")
    private String relatedTopics;

    @Builder.Default
    private Double confidence = 0.95;

    @Column(columnDefinition = "TEXT")
    @Builder.Default
    private String correctnessDisclaimer = "Note: AI-generated explanations are estimates and should be independently reviewed.";

    @Builder.Default
    private LocalDateTime solvedAt = LocalDateTime.now();
}
