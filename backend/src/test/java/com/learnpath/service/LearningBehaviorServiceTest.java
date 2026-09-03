package com.learnpath.service;

import com.learnpath.dto.BehaviorDtos.*;
import com.learnpath.model.entity.*;
import com.learnpath.repository.BehaviorPredictionRepository;
import com.learnpath.repository.LearningBehaviorSnapshotRepository;
import com.learnpath.repository.ProgressRepository;
import com.learnpath.repository.QuizAttemptRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LearningBehaviorServiceTest {

    @Mock
    private LearningBehaviorSnapshotRepository snapshotRepository;

    @Mock
    private BehaviorPredictionRepository predictionRepository;

    @Mock
    private QuizAttemptRepository quizAttemptRepository;

    @Mock
    private ProgressRepository progressRepository;

    @Mock
    private AIAuditService auditService;

    @InjectMocks
    private LearningBehaviorService behaviorService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).email("student@example.com").build();
    }

    @Test
    void testPredictStudentBehavior_LowRisk() {
        QuizAttempt passingAttempt = QuizAttempt.builder()
                .id(1L)
                .user(testUser)
                .score(90)
                .totalQuestions(10)
                .passed(true)
                .completedAt(LocalDateTime.now())
                .build();

        when(quizAttemptRepository.findByUserIdOrderByCompletedAtDesc(1L)).thenReturn(List.of(passingAttempt));
        when(progressRepository.findByUserId(1L)).thenReturn(List.of());

        BehaviorPrediction savedPred = BehaviorPrediction.builder()
                .id(10L)
                .user(testUser)
                .predictedCategory(com.learnpath.model.enums.RiskCategory.LOW)
                .struggleProbability(0.08)
                .contributingFactors("Consistently passing quizzes")
                .recommendedIntervention("Maintain current momentum")
                .modelVersion("scikit-rf-behavior-v1.4")
                .build();
        when(predictionRepository.save(any(BehaviorPrediction.class))).thenReturn(savedPred);

        BehaviorPredictionResponse response = behaviorService.predictStudentBehavior(testUser);

        assertNotNull(response);
        assertEquals("LOW", response.getRiskCategory());
        assertTrue(response.getStruggleProbability() < 0.5);
        verify(snapshotRepository, times(1)).save(any(LearningBehaviorSnapshot.class));
        verify(predictionRepository, times(1)).save(any(BehaviorPrediction.class));
    }
}
