package com.learnpath.model.entity;

import com.learnpath.model.enums.DifficultyLevel;
import com.learnpath.model.enums.QuestionType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_id")
    private Assessment assessment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private Topic topic;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private QuestionType questionType = QuestionType.MULTIPLE_CHOICE;

    // JSON-encoded list of choices e.g. ["Choice A", "Choice B", "Choice C", "Choice D"]
    @Column(nullable = false, columnDefinition = "TEXT")
    private String options;

    @Column(nullable = false)
    private Integer correctOptionIndex;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private DifficultyLevel difficulty = DifficultyLevel.BEGINNER;

    @Builder.Default
    @Column(nullable = false)
    private Integer points = 1;
}
