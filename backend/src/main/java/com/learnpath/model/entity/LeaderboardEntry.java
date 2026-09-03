package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "leaderboard_entries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Builder.Default
    private Integer rankPosition = 1;

    @Builder.Default
    private Integer totalXp = 0;

    @Builder.Default
    private Boolean optInPublic = true;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String period = "ALL_TIME"; // WEEKLY, ALL_TIME

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
