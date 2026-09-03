package com.learnpath.model.entity;

import com.learnpath.model.enums.DifficultyLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "difficulty_adjustments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DifficultyAdjustment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adaptive_quiz_session_id", nullable = false)
    private AdaptiveQuizSession session;

    private Integer questionNumber;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private DifficultyLevel previousDifficulty;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private DifficultyLevel newDifficulty;

    @Column(nullable = false, length = 255)
    private String reason;

    @Column(length = 50)
    @Builder.Default
    private String triggerEvent = "CONSECUTIVE_CORRECT";

    @Builder.Default
    private LocalDateTime adjustedAt = LocalDateTime.now();
}
