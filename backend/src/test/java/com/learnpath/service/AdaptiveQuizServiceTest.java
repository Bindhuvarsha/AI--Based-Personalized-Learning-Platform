package com.learnpath.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnpath.dto.AdaptiveQuizDtos.*;
import com.learnpath.model.entity.*;
import com.learnpath.model.enums.DifficultyLevel;
import com.learnpath.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdaptiveQuizServiceTest {

    @Mock
    private AdaptiveQuizSessionRepository sessionRepository;

    @Mock
    private DifficultyAdjustmentRepository adjustmentRepository;

    @Mock
    private TopicRepository topicRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private ProgressRepository progressRepository;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private AdaptiveQuizService adaptiveQuizService;

    private User testUser;
    private Topic testTopic;
    private Question testQuestion;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).email("student@example.com").build();
        testTopic = Topic.builder().id(1L).title("Java Fundamentals").build();

        testQuestion = Question.builder()
                .id(101L)
                .topic(testTopic)
                .questionText("What is polymorphism in Java?")
                .difficulty(DifficultyLevel.BEGINNER)
                .options("[\"Ability of an object to take many forms\", \"Compiling Java code\"]")
                .correctOptionIndex(0)
                .build();
    }

    @Test
    void testStartAdaptiveSession_Success() {
        when(topicRepository.findById(1L)).thenReturn(Optional.of(testTopic));
        when(progressRepository.findByUserAndTopic(testUser, testTopic)).thenReturn(Optional.empty());

        AdaptiveQuizSession session = AdaptiveQuizSession.builder()
                .id(10L)
                .user(testUser)
                .topic(testTopic)
                .currentDifficulty(DifficultyLevel.BEGINNER)
                .consecutiveCorrect(0)
                .consecutiveIncorrect(0)
                .totalQuestionsAnswered(0)
                .score(0)
                .isCompleted(false)
                .startedAt(LocalDateTime.now())
                .build();

        when(sessionRepository.save(any(AdaptiveQuizSession.class))).thenReturn(session);
        when(questionRepository.findByTopicId(1L)).thenReturn(List.of(testQuestion));

        AdaptiveSessionStartResponse response = adaptiveQuizService.startAdaptiveSession(testUser, 1L);

        assertNotNull(response);
        assertEquals(10L, response.getSessionId());
        assertEquals("BEGINNER", response.getCurrentDifficulty());
        assertNotNull(response.getFirstQuestion());
        assertEquals("What is polymorphism in Java?", response.getFirstQuestion().getQuestionText());
    }
}
