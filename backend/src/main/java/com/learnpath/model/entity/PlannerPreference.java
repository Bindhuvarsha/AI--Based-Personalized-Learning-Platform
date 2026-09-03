package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "planner_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlannerPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Builder.Default
    private Double dailyAvailableHours = 2.0;

    @Column(length = 30)
    @Builder.Default
    private String preferredStudyTime = "EVENING"; // MORNING, AFTERNOON, EVENING, NIGHT

    @Column(length = 50)
    @Builder.Default
    private String weeklyRestDays = "SUNDAY";

    private LocalDate targetExamDate;
}
