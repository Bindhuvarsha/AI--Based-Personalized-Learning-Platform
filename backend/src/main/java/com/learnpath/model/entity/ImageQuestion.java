package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "image_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 255)
    private String originalFilename;

    @Column(nullable = false, length = 500)
    private String fileUrl;

    @Column(length = 50)
    private String mimeType;

    private Long fileSizeBytes;

    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();

    @OneToOne(mappedBy = "imageQuestion", cascade = CascadeType.ALL, orphanRemoval = true)
    private OCRResult ocrResult;

    @OneToOne(mappedBy = "imageQuestion", cascade = CascadeType.ALL, orphanRemoval = true)
    private ImageSolution solution;
}
