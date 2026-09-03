package com.learnpath.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "code_executions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodeExecution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false, unique = true)
    private CodeSubmission submission;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "SUCCESS"; // SUCCESS, COMPILATION_ERROR, RUNTIME_ERROR, TIMEOUT

    @Column(columnDefinition = "TEXT")
    private String stdout;

    @Column(columnDefinition = "TEXT")
    private String stderr;

    @Builder.Default
    private Long executionTimeMs = 45L;

    @Builder.Default
    private Long memoryKb = 10240L;

    @Builder.Default
    private LocalDateTime executedAt = LocalDateTime.now();
}
