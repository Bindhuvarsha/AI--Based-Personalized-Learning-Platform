package com.learnpath.model.entity;

import com.learnpath.model.enums.BadgeType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "badges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code; // e.g. "FIRST_QUIZ", "KNOWLEDGE_SEEKER", "7_DAY_STREAK", "PYTHON_MASTERY"

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(length = 50)
    @Builder.Default
    private String iconName = "Award";

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private BadgeType badgeType = BadgeType.ACHIEVEMENT;

    @Builder.Default
    private Integer xpBonus = 100;
}
