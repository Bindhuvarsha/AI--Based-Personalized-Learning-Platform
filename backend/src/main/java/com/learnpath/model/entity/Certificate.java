package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "certificates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String certificateId; // e.g. "LP-CERT-2026-A1B2C3D4"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String recipientName;

    @Column(nullable = false, length = 150)
    private String courseTitle;

    @Column(nullable = false)
    private Double score;

    @Column(length = 50)
    @Builder.Default
    private String grade = "Distinction";

    @Column(length = 500)
    private String skillsAcquired; // e.g. "Java, Spring Boot, REST APIs, Microservices"

    @Column(nullable = false, length = 64)
    private String verificationHash; // SHA-256 tamper-proof signature

    @Column(nullable = false)
    private LocalDateTime issueDate;

    @Column(length = 30)
    @Builder.Default
    private String status = "VERIFIED";
}
