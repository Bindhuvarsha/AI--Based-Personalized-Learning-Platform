package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ocr_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OCRResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "image_question_id", nullable = false, unique = true)
    private ImageQuestion imageQuestion;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String extractedText;

    @Builder.Default
    private Double confidenceScore = 0.95;

    @Column(columnDefinition = "TEXT")
    private String detectedFormulas;

    @Column(length = 30)
    @Builder.Default
    private String language = "ENGLISH";

    @Builder.Default
    private LocalDateTime processedAt = LocalDateTime.now();
}
