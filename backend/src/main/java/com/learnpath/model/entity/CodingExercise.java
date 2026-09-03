package com.learnpath.model.entity;

import com.learnpath.model.enums.DifficultyLevel;
import com.learnpath.model.enums.ProgrammingLanguage;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "coding_exercises")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodingExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private ProgrammingLanguage language = ProgrammingLanguage.JAVA;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private DifficultyLevel difficulty = DifficultyLevel.BEGINNER;

    @Column(columnDefinition = "TEXT")
    private String starterCode;

    @Column(columnDefinition = "TEXT")
    private String solutionCode;

    // JSON array of test cases: [{"input":"[2,7,11,15], 9", "expectedOutput":"[0,1]"}]
    @Column(columnDefinition = "TEXT")
    private String testCasesJson;
}
