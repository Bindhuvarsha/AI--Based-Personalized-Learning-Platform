package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "group_goals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GroupGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_group_id", nullable = false)
    private StudyGroup studyGroup;

    @Column(nullable = false, length = 200)
    private String goalTitle;

    private LocalDate targetDate;

    @Builder.Default
    private Boolean isCompleted = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
