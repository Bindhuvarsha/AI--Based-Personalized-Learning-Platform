package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "job_targets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobTarget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title; // e.g. "Senior Backend Java Engineer"

    @Column(length = 100)
    @Builder.Default
    private String company = "Industry Standard";

    @Column(columnDefinition = "TEXT", nullable = false)
    private String targetJobDescription;

    // JSON array of strings: ["Java", "Spring Boot", "Docker", "PostgreSQL", "Kafka"]
    @Column(columnDefinition = "TEXT")
    private String requiredSkillsJson;
}
