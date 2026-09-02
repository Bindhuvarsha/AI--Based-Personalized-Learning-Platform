package com.learnpath.model.entity;

import com.learnpath.model.enums.DifficultyLevel;
import com.learnpath.model.enums.LanguagePreference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_profiles")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    @Column(length = 100)
    private String educationLevel;

    @Column(columnDefinition = "TEXT")
    private String subjectsOfInterest; // Stored as comma-separated or JSON string

    @Column(columnDefinition = "TEXT")
    private String currentSkills; // Stored as comma-separated or JSON string

    @Column(columnDefinition = "TEXT")
    private String learningGoals;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    @Builder.Default
    private DifficultyLevel preferredDifficulty = DifficultyLevel.BEGINNER;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    @Builder.Default
    private LanguagePreference preferredLanguage = LanguagePreference.ENGLISH;

    @Builder.Default
    private Integer weeklyStudyTargetMinutes = 300;

    @Builder.Default
    private Integer currentStreakDays = 0;

    private LocalDateTime lastActiveDate;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
