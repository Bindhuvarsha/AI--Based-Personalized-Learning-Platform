package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "resume_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 255)
    private String filename;

    @Column(nullable = false, length = 500)
    private String fileUrl;

    @Column(columnDefinition = "TEXT")
    private String rawExtractedText;

    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "resumeDocument", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ExtractedResumeSkill> extractedSkills = new ArrayList<>();
}
