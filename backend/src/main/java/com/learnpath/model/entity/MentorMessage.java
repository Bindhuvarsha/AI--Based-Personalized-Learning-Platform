package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "mentor_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MentorMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_profile_id", nullable = false)
    private MentorProfile mentorProfile;

    @Column(nullable = false, length = 20)
    private String role; // "user" or "assistant"

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // JSON array of evidence objects e.g. [{"metric":"Quiz Accuracy", "topic":"Spring Security", "score":45}]
    @Column(columnDefinition = "TEXT")
    private String evidenceCited;

    @Column(length = 20)
    @Builder.Default
    private String language = "ENGLISH";

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
