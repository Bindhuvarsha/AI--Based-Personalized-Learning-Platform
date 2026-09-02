package com.learnpath.dto;

import com.learnpath.model.enums.KnowledgeLevel;
import lombok.*;

import java.util.List;

public class AnalyticsDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnalyticsDashboardResponse {
        private double overallMasteryPercentage;
        private int completedTopicsCount;
        private int totalTopicsCount;
        private int completedCoursesCount;
        private int totalQuizzesTaken;
        private double averageQuizScore;
        private int totalStudyTimeMinutes;
        private int currentStreakDays;
        private double roadmapCompletionPercentage;
        private List<TopicPerformanceItem> topicPerformance;
        private List<QuizScoreTrendItem> quizTrends;
        private List<WeakTopicItem> weakTopics;
        private List<StrongTopicItem> strongTopics;
        private KnowledgeDistribution knowledgeDistribution;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TopicPerformanceItem {
        private Long topicId;
        private String topicTitle;
        private String courseTitle;
        private double masteryScore;
        private KnowledgeLevel knowledgeLevel;
        private int timeSpentMinutes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuizScoreTrendItem {
        private Long attemptId;
        private String topicTitle;
        private double scorePercentage;
        private String dateFormatted;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WeakTopicItem {
        private Long topicId;
        private String topicTitle;
        private double score;
        private String suggestedAction;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StrongTopicItem {
        private Long topicId;
        private String topicTitle;
        private double score;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class KnowledgeDistribution {
        private int weak;
        private int developing;
        private int proficient;
        private int advanced;
    }
}
