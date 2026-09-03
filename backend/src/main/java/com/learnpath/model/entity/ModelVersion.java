package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "model_versions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModelVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String modelName;

    @Column(nullable = false, unique = true, length = 50)
    private String versionString;

    @Column(length = 100)
    private String algorithm;

    @Builder.Default
    private Double accuracy = 0.88;

    @Builder.Default
    private Double precisionScore = 0.86;

    @Builder.Default
    private Double recallScore = 0.89;

    @Builder.Default
    private Boolean isActive = true;

    @Builder.Default
    private LocalDateTime deployedAt = LocalDateTime.now();
}
