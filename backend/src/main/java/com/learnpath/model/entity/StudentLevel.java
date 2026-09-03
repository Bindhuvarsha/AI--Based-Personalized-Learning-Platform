package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_levels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Builder.Default
    private Integer currentLevel = 1;

    @Builder.Default
    private Integer currentXp = 0;

    @Builder.Default
    private Integer nextLevelXpRequired = 500;

    @Column(length = 50)
    @Builder.Default
    private String title = "Novice Explorer";
}
