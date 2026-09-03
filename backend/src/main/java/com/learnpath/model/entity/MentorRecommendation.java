package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "mentor_recommendations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MentorRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_profile_id", nullable = false)
    private MentorProfile mentorProfile;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String actionType = "STUDY_TOPIC"; // STUDY_TOPIC, PRACTICE_QUIZ, CODING_EXERCISE, REVIEW_PREREQUISITE

    @Column(length = 255)
    private String actionPayload; // e.g. Topic ID, Concept Code, Exercise ID

    @Builder.Default
    private Integer priority = 1; // 1 (highest) to 5

    @Builder.Default
    private Boolean isActioned = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
