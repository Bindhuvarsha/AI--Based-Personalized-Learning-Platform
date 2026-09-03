package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "voice_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoiceSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    @Builder.Default
    private String sessionTitle = "Voice Study Session";

    @Builder.Default
    private LocalDateTime startedAt = LocalDateTime.now();

    private LocalDateTime endedAt;

    @Builder.Default
    private Integer totalAudioSeconds = 0;

    @OneToMany(mappedBy = "voiceSession", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<VoiceMessage> messages = new ArrayList<>();
}
