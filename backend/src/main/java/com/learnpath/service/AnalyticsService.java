package com.learnpath.service;

import com.learnpath.dto.AnalyticsDtos.*;
import com.learnpath.model.entity.*;
import com.learnpath.model.enums.KnowledgeLevel;
import com.learnpath.model.enums.ProgressStatus;
import com.learnpath.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ProgressRepository progressRepository;
    private final TopicRepository topicRepository;
    private final CourseRepository courseRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final StudentProfileRepository profileRepository;

    @Transactional(readOnly = true)
    public AnalyticsDashboardResponse getAnalyticsDashboard(User user) {
        List<Progress> progressList = progressRepository.findByUserId(user.getId());
        List<Topic> allTopics = topicRepository.findAll();
        List<Course> allCourses = courseRepository.findByPublishedTrue();
        List<QuizAttempt> attempts = quizAttemptRepository.findByUserIdOrderByCompletedAtDesc(user.getId());
        StudentProfile profile = profileRepository.findByUser(user).orElse(null);

        int totalTopicsCount = allTopics.size();
        long completedTopicsCount = progressList.stream()
                .filter(p -> p.getStatus() == ProgressStatus.COMPLETED ||
                        p.getKnowledgeLevel() == KnowledgeLevel.PROFICIENT ||
                        p.getKnowledgeLevel() == KnowledgeLevel.ADVANCED)
                .count();

        double roadmapCompletion = totalTopicsCount > 0
                ? ((double) completedTopicsCount / totalTopicsCount) * 100.0 : 0.0;

        double overallMastery = progressList.stream()
                .mapToDouble(Progress::getMasteryScore)
                .average()
                .orElse(0.0);

        int totalStudyMinutes = progressList.stream()
                .mapToInt(Progress::getTotalTimeSpentMinutes)
                .sum();
        if (totalStudyMinutes == 0 && !attempts.isEmpty()) {
            totalStudyMinutes = attempts.size() * 15;
        }

        double avgQuizScore = attempts.stream()
                .mapToDouble(QuizAttempt::getPercentage)
                .average()
                .orElse(0.0);

        // Weak & Strong topics
        List<WeakTopicItem> weakTopics = progressList.stream()
                .filter(p -> p.getKnowledgeLevel() == KnowledgeLevel.WEAK || p.getMasteryScore() < 50.0)
                .map(p -> WeakTopicItem.builder()
                        .topicId(p.getTopic().getId())
                        .topicTitle(p.getTopic().getTitle())
                        .score(p.getMasteryScore())
                        .suggestedAction("Take topic practice quiz and review documentation notes.")
                        .build())
                .limit(5)
                .collect(Collectors.toList());

        List<StrongTopicItem> strongTopics = progressList.stream()
                .filter(p -> p.getKnowledgeLevel() == KnowledgeLevel.ADVANCED || p.getKnowledgeLevel() == KnowledgeLevel.PROFICIENT)
                .map(p -> StrongTopicItem.builder()
                        .topicId(p.getTopic().getId())
                        .topicTitle(p.getTopic().getTitle())
                        .score(p.getMasteryScore())
                        .build())
                .limit(5)
                .collect(Collectors.toList());

        // Topic-wise performance
        List<TopicPerformanceItem> topicPerformance = progressList.stream()
                .map(p -> TopicPerformanceItem.builder()
                        .topicId(p.getTopic().getId())
                        .topicTitle(p.getTopic().getTitle())
                        .courseTitle(p.getTopic().getCourse().getTitle())
                        .masteryScore(p.getMasteryScore())
                        .knowledgeLevel(p.getKnowledgeLevel())
                        .timeSpentMinutes(p.getTotalTimeSpentMinutes())
                        .build())
                .collect(Collectors.toList());

        // Quiz score trends
        DateTimeFormatter df = DateTimeFormatter.ofPattern("MMM dd");
        List<QuizScoreTrendItem> quizTrends = attempts.stream()
                .limit(10)
                .map(qa -> QuizScoreTrendItem.builder()
                        .attemptId(qa.getId())
                        .topicTitle(qa.getTopic() != null ? qa.getTopic().getTitle() : "Assessment")
                        .scorePercentage(qa.getPercentage())
                        .dateFormatted(qa.getCompletedAt() != null ? qa.getCompletedAt().format(df) : "Recent")
                        .build())
                .collect(Collectors.toList());

        // Knowledge breakdown
        int weakCount = (int) progressList.stream().filter(p -> p.getKnowledgeLevel() == KnowledgeLevel.WEAK).count();
        int devCount = (int) progressList.stream().filter(p -> p.getKnowledgeLevel() == KnowledgeLevel.DEVELOPING).count();
        int profCount = (int) progressList.stream().filter(p -> p.getKnowledgeLevel() == KnowledgeLevel.PROFICIENT).count();
        int advCount = (int) progressList.stream().filter(p -> p.getKnowledgeLevel() == KnowledgeLevel.ADVANCED).count();

        int currentStreak = profile != null && profile.getCurrentStreakDays() != null
                ? profile.getCurrentStreakDays()
                : (attempts.isEmpty() ? 0 : 3);

        return AnalyticsDashboardResponse.builder()
                .overallMasteryPercentage(Math.round(overallMastery * 10.0) / 10.0)
                .completedTopicsCount((int) completedTopicsCount)
                .totalTopicsCount(totalTopicsCount)
                .completedCoursesCount((int) (completedTopicsCount / Math.max(1, (totalTopicsCount / Math.max(1, allCourses.size())))))
                .totalQuizzesTaken(attempts.size())
                .averageQuizScore(Math.round(avgQuizScore * 10.0) / 10.0)
                .totalStudyTimeMinutes(totalStudyMinutes)
                .currentStreakDays(currentStreak)
                .roadmapCompletionPercentage(Math.round(roadmapCompletion * 10.0) / 10.0)
                .topicPerformance(topicPerformance)
                .quizTrends(quizTrends)
                .weakTopics(weakTopics)
                .strongTopics(strongTopics)
                .knowledgeDistribution(KnowledgeDistribution.builder()
                        .weak(weakCount)
                        .developing(devCount)
                        .proficient(profCount)
                        .advanced(advCount)
                        .build())
                .build();
    }
}
