package com.learnpath.model.entity;

import com.learnpath.model.enums.EarlyWarningSeverity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "early_warnings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EarlyWarning {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String warningType; // SCORE_DROP, INACTIVITY, MISSED_DEADLINE, PERSISTENT_WEAK_CONCEPT

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private EarlyWarningSeverity severity = EarlyWarningSeverity.MEDIUM;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String evidenceText;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String recommendedAction;

    @Builder.Default
    private Boolean isDismissed = false;

    private LocalDateTime isSnoozedUntil;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
