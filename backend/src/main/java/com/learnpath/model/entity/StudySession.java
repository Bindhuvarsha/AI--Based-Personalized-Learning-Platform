package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "study_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false)
    private LocalDate sessionDate;

    private LocalTime startTime;

    @Builder.Default
    private Integer durationMinutes = 45;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String sessionType = "STUDY"; // STUDY, REVISION, PRACTICE_QUIZ, REST

    @Builder.Default
    private Boolean isCompleted = false;

    @Column(columnDefinition = "TEXT")
    private String explanationScheduled;
}
