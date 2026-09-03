package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "mentor_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MentorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String persona = "Technical Architect & Study Coach";

    @Column(length = 255)
    private String learningGoal;

    @Column(length = 100)
    private String targetCareer;

    @Builder.Default
    private Integer weeklyStudyTargetHours = 10;

    @Column(length = 30)
    @Builder.Default
    private String tone = "Encouraging & Direct";

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private LocalDateTime lastCheckInAt = LocalDateTime.now();
}
