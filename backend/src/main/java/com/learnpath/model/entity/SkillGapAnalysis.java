package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "skill_gap_analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillGapAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_document_id", nullable = false)
    private ResumeDocument resumeDocument;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_target_id", nullable = false)
    private JobTarget jobTarget;

    @Builder.Default
    private Double matchPercentage = 68.0;

    // JSON array of objects: [{"skill":"Java", "status":"MATCHED", "evidence":"3 yrs experience with Java 17"}]
    @Column(columnDefinition = "TEXT")
    private String matchedSkillsJson;

    // JSON array of objects: [{"skill":"Kubernetes", "status":"PARTIAL", "evidence":"Containerized apps in Docker"}]
    @Column(columnDefinition = "TEXT")
    private String partialSkillsJson;

    // JSON array of objects: [{"skill":"Kafka", "status":"MISSING", "action":"Recommended Event-Driven Architecture course"}]
    @Column(columnDefinition = "TEXT")
    private String missingSkillsJson;

    @Builder.Default
    private LocalDateTime analyzedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ResumeRecommendation> recommendations = new ArrayList<>();
}
