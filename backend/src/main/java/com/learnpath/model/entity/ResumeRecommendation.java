package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resume_recommendations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_gap_analysis_id", nullable = false)
    private SkillGapAnalysis analysis;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 50)
    @Builder.Default
    private String category = "TOPIC"; // TOPIC, PROJECT, CERTIFICATION, RESUME_FORMAT

    @Column(columnDefinition = "TEXT", nullable = false)
    private String recommendationText;
}
