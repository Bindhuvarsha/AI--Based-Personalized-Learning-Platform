package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "extracted_resume_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExtractedResumeSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_document_id", nullable = false)
    private ResumeDocument resumeDocument;

    @Column(nullable = false, length = 150)
    private String skillName;

    @Column(length = 100)
    private String category; // e.g. "Languages", "Frameworks", "Cloud & DevOps", "Databases"

    @Column(columnDefinition = "TEXT")
    private String evidenceText; // sentence or bullet point where found in resume

    @Builder.Default
    private Boolean isVerifiedByStudent = true;
}
