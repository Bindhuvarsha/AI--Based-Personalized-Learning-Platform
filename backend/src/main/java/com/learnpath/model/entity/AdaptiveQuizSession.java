package com.learnpath.model.entity;

import com.learnpath.model.enums.DifficultyLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "adaptive_quiz_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdaptiveQuizSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private DifficultyLevel currentDifficulty = DifficultyLevel.BEGINNER;

    @Builder.Default
    private Integer consecutiveCorrect = 0;

    @Builder.Default
    private Integer consecutiveIncorrect = 0;

    @Builder.Default
    private Integer totalQuestionsAnswered = 0;

    @Builder.Default
    private Integer score = 0;

    @Builder.Default
    private Boolean isCompleted = false;

    @Builder.Default
    private LocalDateTime startedAt = LocalDateTime.now();

    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DifficultyAdjustment> adjustments = new ArrayList<>();
}
