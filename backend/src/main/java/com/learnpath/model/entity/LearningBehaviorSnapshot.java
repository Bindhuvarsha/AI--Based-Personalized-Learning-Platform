package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "learning_behavior_snapshots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningBehaviorSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private LocalDate snapshotDate;

    @Builder.Default
    private Double avgQuizScore = 75.0;

    @Builder.Default
    private Double scoreTrendSlope = 0.0; // Positive = improving, negative = declining

    @Builder.Default
    private Integer failedAttemptsCount = 0;

    @Builder.Default
    private Integer totalTimeSpentMinutes = 120;

    @Builder.Default
    private Double sessionFrequencyPerWeek = 3.5;

    @Builder.Default
    private Integer inactivityDays = 1;

    @Builder.Default
    private Double completionRate = 65.0;

    @Builder.Default
    private LocalDateTime capturedAt = LocalDateTime.now();
}
