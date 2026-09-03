package com.learnpath.model.entity;

import com.learnpath.model.enums.RiskCategory;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "behavior_predictions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BehaviorPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "snapshot_id")
    private LearningBehaviorSnapshot snapshot;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private RiskCategory predictedCategory = RiskCategory.LOW;

    @Builder.Default
    private Double struggleProbability = 0.15;

    // JSON array of factors e.g. ["Low activity past 5 days", "Declining quiz score trend on Recursion"]
    @Column(columnDefinition = "TEXT")
    private String contributingFactors;

    @Column(columnDefinition = "TEXT")
    private String recommendedIntervention;

    @Column(length = 50)
    @Builder.Default
    private String modelVersion = "rf-behavior-v1.2";

    @Column(columnDefinition = "TEXT")
    @Builder.Default
    private String disclaimer = "Estimated prediction for academic support guidance only; not an official evaluation.";

    @Builder.Default
    private LocalDateTime predictedAt = LocalDateTime.now();
}
