package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "mentor_check_ins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MentorCheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_profile_id", nullable = false)
    private MentorProfile mentorProfile;

    @Column(nullable = false)
    private LocalDate checkInDate;

    @Builder.Default
    private Integer studyMinutesAchieved = 0;

    @Builder.Default
    private Integer conceptsMasteredCount = 0;

    @Column(length = 255)
    private String notes;

    @Column(length = 50)
    @Builder.Default
    private String mood = "FOCUSED"; // FOCUSED, CONFIDENT, TIRED, OVERWHELMED

    @Builder.Default
    private LocalDateTime recordedAt = LocalDateTime.now();
}
