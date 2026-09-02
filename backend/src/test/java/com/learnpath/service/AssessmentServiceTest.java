package com.learnpath.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnpath.dto.AssessmentDtos.*;
import com.learnpath.model.entity.*;
import com.learnpath.model.enums.*;
import com.learnpath.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssessmentServiceTest {

    @Mock
    private AssessmentRepository assessmentRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private AnswerRepository answerRepository;

    @Mock
    private QuizAttemptRepository quizAttemptRepository;

    @Mock
    private ProgressRepository progressRepository;

    @Mock
    private RecommendationService recommendationService;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private AssessmentService assessmentService;

    private User sampleUser;
    private Assessment sampleAssessment;
    private Topic sampleTopic;
    private Question sampleQuestion1;
    private Question sampleQuestion2;

    @BeforeEach
    void setUp() throws Exception {
        sampleUser = User.builder().id(1L).email("student@example.com").build();
        Course course = Course.builder().id(100L).title("Python Foundations").build();
        sampleTopic = Topic.builder().id(200L).title("Data Structures").course(course).build();

        sampleAssessment = Assessment.builder()
                .id(1L)
                .title("Diagnostic Test")
                .subject("Computer Science")
                .difficulty(DifficultyLevel.BEGINNER)
                .build();

        sampleQuestion1 = Question.builder()
                .id(10L)
                .assessment(sampleAssessment)
                .topic(sampleTopic)
                .questionText("Question 1")
                .options(objectMapper.writeValueAsString(List.of("A", "B", "C", "D")))
                .correctOptionIndex(0)
                .difficulty(DifficultyLevel.BEGINNER)
                .points(1)
                .build();

        sampleQuestion2 = Question.builder()
                .id(11L)
                .assessment(sampleAssessment)
                .topic(sampleTopic)
                .questionText("Question 2")
                .options(objectMapper.writeValueAsString(List.of("A", "B", "C", "D")))
                .correctOptionIndex(2)
                .difficulty(DifficultyLevel.BEGINNER)
                .points(1)
                .build();
    }

    @Test
    void testSubmitAssessmentKnowledgeGapClassification() {
        SubmitAssessmentRequest request = SubmitAssessmentRequest.builder()
                .assessmentId(1L)
                .totalTimeSpentSeconds(120)
                .answers(List.of(
                        AnswerSubmission.builder().questionId(10L).selectedOptionIndex(0).build(), // correct
                        AnswerSubmission.builder().questionId(11L).selectedOptionIndex(1).build()  // incorrect
                ))
                .build();

        when(assessmentRepository.findById(1L)).thenReturn(Optional.of(sampleAssessment));
        when(questionRepository.findByAssessmentId(1L)).thenReturn(List.of(sampleQuestion1, sampleQuestion2));
        when(quizAttemptRepository.save(any(QuizAttempt.class))).thenAnswer(i -> {
            QuizAttempt qa = i.getArgument(0);
            qa.setId(99L);
            return qa;
        });
        when(progressRepository.findByUserAndTopic(any(), any())).thenReturn(Optional.empty());

        AssessmentResultResponse result = assessmentService.submitAssessment(sampleUser, request);

        assertNotNull(result);
        assertEquals(2, result.getTotalQuestions());
        assertEquals(1, result.getCorrectAnswers());
        assertEquals(50.0, result.getOverallScore());
        assertEquals(1, result.getTopicScores().size());

        // 50% score should be categorized into DEVELOPING knowledge level
        TopicScoreResult topicScore = result.getTopicScores().get(0);
        assertEquals(KnowledgeLevel.DEVELOPING, topicScore.getKnowledgeLevel());
        assertEquals(50.0, topicScore.getPercentage());

        verify(progressRepository, times(1)).save(any(Progress.class));
        verify(recommendationService, times(1)).generateRecommendationsForUser(sampleUser);
    }
}
