package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "voice_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoiceMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voice_session_id", nullable = false)
    private VoiceSession voiceSession;

    @Column(nullable = false, length = 20)
    private String speaker; // "user" or "ai"

    @Column(nullable = false, columnDefinition = "TEXT")
    private String transcript;

    @Column(length = 500)
    private String audioUrl;

    @Builder.Default
    private Integer durationSeconds = 0;

    @Column(length = 20)
    @Builder.Default
    private String language = "ENGLISH";

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
