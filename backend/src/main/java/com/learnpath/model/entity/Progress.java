package com.learnpath.model.entity;

import com.learnpath.model.enums.KnowledgeLevel;
import com.learnpath.model.enums.ProgressStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "user_progress",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "topic_id"})
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private ProgressStatus status = ProgressStatus.NOT_STARTED;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private KnowledgeLevel knowledgeLevel = KnowledgeLevel.WEAK;

    @Builder.Default
    @Column(nullable = false)
    private Double masteryScore = 0.0;

    @Builder.Default
    @Column(nullable = false)
    private Integer attemptsCount = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer totalTimeSpentMinutes = 0;

    private LocalDateTime lastAttemptAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
