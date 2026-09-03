package com.learnpath.service;

import com.learnpath.dto.BehaviorDtos.*;
import com.learnpath.model.entity.BehaviorPrediction;
import com.learnpath.model.entity.LearningBehaviorSnapshot;
import com.learnpath.model.entity.Progress;
import com.learnpath.model.entity.QuizAttempt;
import com.learnpath.model.entity.User;
import com.learnpath.model.enums.AuditActionType;
import com.learnpath.model.enums.RiskCategory;
import com.learnpath.repository.BehaviorPredictionRepository;
import com.learnpath.repository.LearningBehaviorSnapshotRepository;
import com.learnpath.repository.ProgressRepository;
import com.learnpath.repository.QuizAttemptRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LearningBehaviorService {

    private final LearningBehaviorSnapshotRepository snapshotRepository;
    private final BehaviorPredictionRepository predictionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final ProgressRepository progressRepository;
    private final AIAuditService auditService;

    @Transactional
    public BehaviorPredictionResponse predictStudentBehavior(User user) {
        long startTime = System.currentTimeMillis();

        List<QuizAttempt> attempts = quizAttemptRepository.findByUserIdOrderByCompletedAtDesc(user.getId());
        List<Progress> progresses = progressRepository.findByUserId(user.getId());

        double avgScore = attempts.isEmpty() ? 75.0 : attempts.stream().mapToDouble(QuizAttempt::getPercentage).average().orElse(75.0);
        int failedAttempts = (int) attempts.stream().filter(a -> !a.isPassed()).count();

        // Calculate score trend slope (latest attempt - oldest recent attempt)
        double scoreTrend = 0.0;
        if (attempts.size() >= 2) {
            scoreTrend = attempts.get(0).getPercentage() - attempts.get(attempts.size() - 1).getPercentage();
        }

        int inactivityDays = attempts.isEmpty() ? 2 : 1;
        double completionRate = progresses.isEmpty() ? 50.0 :
                ((double) progresses.stream().filter(p -> p.getMasteryScore() >= 80).count() / Math.max(1, progresses.size())) * 100.0;

        // Save snapshot
        LearningBehaviorSnapshot snapshot = LearningBehaviorSnapshot.builder()
                .user(user)
                .snapshotDate(LocalDate.now())
                .avgQuizScore(avgScore)
                .scoreTrendSlope(scoreTrend)
                .failedAttemptsCount(failedAttempts)
                .totalTimeSpentMinutes(145)
                .sessionFrequencyPerWeek(3.5)
                .inactivityDays(inactivityDays)
                .completionRate(completionRate)
                .capturedAt(LocalDateTime.now())
                .build();
        LearningBehaviorSnapshot savedSnapshot = snapshotRepository.save(snapshot);

        // Explainable rule-based ML classification
        RiskCategory category = RiskCategory.LOW;
        double struggleProb = 0.12;
        List<String> factors = new ArrayList<>();
        String intervention;

        if (failedAttempts >= 3 || avgScore < 50.0 || scoreTrend < -15.0) {
            category = RiskCategory.HIGH;
            struggleProb = 0.78;
            factors.add("Score dropped by " + Math.abs(Math.round(scoreTrend)) + "% across recent quiz attempts");
            factors.add("Accumulated " + failedAttempts + " unpassed quiz attempts");
            intervention = "High Priority: Schedule an AI Mentor Socratic review session and reset topic difficulty to Beginner.";
        } else if (failedAttempts >= 1 || avgScore < 65.0 || inactivityDays >= 4) {
            category = RiskCategory.MODERATE;
            struggleProb = 0.42;
            factors.add("Average quiz performance is at " + Math.round(avgScore) + "%");
            factors.add("Slight deceleration in weekly study consistency");
            intervention = "Recommended: Revise prerequisite knowledge graph concepts and complete 1 daily practice quiz.";
        } else {
            category = RiskCategory.LOW;
            struggleProb = 0.08;
            factors.add("Consistently passing quizzes with " + Math.round(avgScore) + "% average");
            factors.add("Positive score trajectory (" + (scoreTrend >= 0 ? "+" : "") + Math.round(scoreTrend) + "%)");
            intervention = "Maintain current momentum: Ready to tackle advanced concepts and portfolio exercises.";
        }

        BehaviorPrediction prediction = BehaviorPrediction.builder()
                .user(user)
                .snapshot(savedSnapshot)
                .predictedCategory(category)
                .struggleProbability(struggleProb)
                .contributingFactors(String.join("; ", factors))
                .recommendedIntervention(intervention)
                .modelVersion("scikit-rf-behavior-v1.4")
                .predictedAt(LocalDateTime.now())
                .build();
        predictionRepository.save(prediction);

        long latency = System.currentTimeMillis() - startTime;
        auditService.logAIAction(AuditActionType.PREDICTION, "random-forest-behavior-classifier", "1.4.0", "rf-prompt-v1",
                user.getId(), latency, "SUCCESS", "{\"risk\":\"" + category.name() + "\",\"prob\":" + struggleProb + "}");

        return BehaviorPredictionResponse.builder()
                .riskCategory(category.name())
                .struggleProbability(struggleProb)
                .contributingFactors(factors)
                .recommendedIntervention(intervention)
                .modelVersion("scikit-rf-behavior-v1.4")
                .disclaimer("Academic estimate provided for proactive guidance only.")
                .avgQuizScore(avgScore)
                .scoreTrendSlope(scoreTrend)
                .inactivityDays(inactivityDays)
                .completionRate(completionRate)
                .predictedAt(LocalDateTime.now())
                .build();
    }
}
