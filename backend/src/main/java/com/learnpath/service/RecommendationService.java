package com.learnpath.service;

import com.learnpath.dto.RecommendationDtos.RecommendationItemDto;
import com.learnpath.model.entity.*;
import com.learnpath.model.enums.KnowledgeLevel;
import com.learnpath.model.enums.ProgressStatus;
import com.learnpath.model.enums.RecommendationType;
import com.learnpath.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final ProgressRepository progressRepository;
    private final TopicRepository topicRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final RestTemplate restTemplate;

    @Value("${ai-service.url:http://localhost:8000}")
    private String aiServiceUrl;

    @Transactional
    public List<RecommendationItemDto> getUserRecommendations(User user) {
        List<Recommendation> recs = recommendationRepository.findByUserIdAndDismissedFalseOrderByPriorityScoreDescCreatedAtDesc(user.getId());

        if (recs.isEmpty()) {
            generateRecommendationsForUser(user);
            recs = recommendationRepository.findByUserIdAndDismissedFalseOrderByPriorityScoreDescCreatedAtDesc(user.getId());
        }

        return recs.stream().map(r -> RecommendationItemDto.builder()
                .id(r.getId())
                .type(r.getRecommendationType())
                .targetId(r.getTargetId())
                .title(r.getTitle())
                .reason(r.getReason())
                .priorityScore(r.getPriorityScore())
                .category(r.getRecommendationType().name())
                .createdAt(r.getCreatedAt())
                .build()).collect(Collectors.toList());
    }

    @Transactional
    public void generateRecommendationsForUser(User user) {
        List<Progress> progressList = progressRepository.findByUserId(user.getId());
        List<Topic> allTopics = topicRepository.findAllByOrderByOrderIndexAsc();
        List<QuizAttempt> attempts = quizAttemptRepository.findByUserIdOrderByCompletedAtDesc(user.getId());

        // Try calling the FastAPI AI ML Recommendation microservice first
        boolean mlGenerated = tryGenerateFromAiMicroservice(user, progressList, allTopics, attempts);
        if (mlGenerated) {
            return;
        }

        // Resilient algorithmic baseline recommendation engine:
        // Clear prior dismissed / stale recommendations safely
        List<Recommendation> existing = recommendationRepository.findByUserIdAndDismissedFalseOrderByPriorityScoreDescCreatedAtDesc(user.getId());
        if (!existing.isEmpty()) {
            recommendationRepository.deleteAll(existing);
        }

        List<Recommendation> newRecommendations = new ArrayList<>();
        Map<Long, Progress> progressByTopic = progressList.stream()
                .collect(Collectors.toMap(p -> p.getTopic().getId(), p -> p, (p1, p2) -> p1));

        // 1. Check for Weak topics (mastery < 50% or KnowledgeLevel == WEAK) -> High priority review
        List<Progress> weakTopics = progressList.stream()
                .filter(p -> p.getKnowledgeLevel() == KnowledgeLevel.WEAK || p.getMasteryScore() < 50.0)
                .sorted(Comparator.comparingDouble(Progress::getMasteryScore))
                .limit(2)
                .collect(Collectors.toList());

        for (Progress wp : weakTopics) {
            newRecommendations.add(Recommendation.builder()
                    .user(user)
                    .recommendationType(RecommendationType.RESOURCE)
                    .targetId(wp.getTopic().getId())
                    .title("Review Core Material: " + wp.getTopic().getTitle())
                    .reason("Your current mastery is " + wp.getMasteryScore() + "%. Revisiting lecture notes and cheat sheets will strengthen your foundation.")
                    .priorityScore(0.95)
                    .createdAt(LocalDateTime.now())
                    .build());

            newRecommendations.add(Recommendation.builder()
                    .user(user)
                    .recommendationType(RecommendationType.QUIZ)
                    .targetId(wp.getTopic().getId())
                    .title("Practice Challenge: " + wp.getTopic().getTitle())
                    .reason("Take a targeted adaptive quiz to solidify your weak areas and boost your score.")
                    .priorityScore(0.90)
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        // 2. Next Unlocked Topic in learning sequence
        for (Topic topic : allTopics) {
            Progress prog = progressByTopic.get(topic.getId());
            if (prog == null || prog.getStatus() == ProgressStatus.NOT_STARTED) {
                newRecommendations.add(Recommendation.builder()
                        .user(user)
                        .recommendationType(RecommendationType.TOPIC)
                        .targetId(topic.getId())
                        .title("Next Up: " + topic.getTitle())
                        .reason("You are ready to advance. This is the next structured step on your curriculum roadmap.")
                        .priorityScore(0.85)
                        .createdAt(LocalDateTime.now())
                        .build());
                break;
            }
        }

        // 3. Developing Topics -> Quiz reinforcement
        List<Progress> developing = progressList.stream()
                .filter(p -> p.getKnowledgeLevel() == KnowledgeLevel.DEVELOPING)
                .limit(1)
                .collect(Collectors.toList());

        for (Progress dev : developing) {
            newRecommendations.add(Recommendation.builder()
                    .user(user)
                    .recommendationType(RecommendationType.QUIZ)
                    .targetId(dev.getTopic().getId())
                    .title("Level Up to Proficient: " + dev.getTopic().getTitle())
                    .reason("You have a good grasp (" + dev.getMasteryScore() + "%). Scoring 70%+ on your next quiz will achieve Proficient status.")
                    .priorityScore(0.75)
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        // If user is brand new with no progress records yet
        if (newRecommendations.isEmpty() && !allTopics.isEmpty()) {
            Topic firstTopic = allTopics.get(0);
            newRecommendations.add(Recommendation.builder()
                    .user(user)
                    .recommendationType(RecommendationType.TOPIC)
                    .targetId(firstTopic.getId())
                    .title("Start Learning: " + firstTopic.getTitle())
                    .reason("Begin your personalized learning journey with this foundational topic.")
                    .priorityScore(1.0)
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        recommendationRepository.saveAll(newRecommendations);
    }

    private boolean tryGenerateFromAiMicroservice(User user, List<Progress> progressList, List<Topic> allTopics, List<QuizAttempt> attempts) {
        try {
            String url = aiServiceUrl + "/api/v1/recommend";
            Map<String, Object> payload = new HashMap<>();
            payload.put("userId", user.getId());
            payload.put("totalAttempts", attempts.size());

            double avgScore = attempts.stream().mapToDouble(QuizAttempt::getPercentage).average().orElse(0.0);
            payload.put("averageScore", avgScore);

            List<Map<String, Object>> progressPayload = progressList.stream().map(p -> {
                Map<String, Object> m = new HashMap<>();
                m.put("topicId", p.getTopic().getId());
                m.put("topicTitle", p.getTopic().getTitle());
                m.put("masteryScore", p.getMasteryScore());
                m.put("knowledgeLevel", p.getKnowledgeLevel().name());
                m.put("attemptsCount", p.getAttemptsCount());
                m.put("timeSpentMinutes", p.getTotalTimeSpentMinutes());
                return m;
            }).collect(Collectors.toList());
            payload.put("topicProgress", progressPayload);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, payload, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> recs = (List<Map<String, Object>>) response.getBody().get("recommendations");
                if (recs != null && !recs.isEmpty()) {
                    List<Recommendation> existing = recommendationRepository.findByUserIdAndDismissedFalseOrderByPriorityScoreDescCreatedAtDesc(user.getId());
                    if (!existing.isEmpty()) {
                        recommendationRepository.deleteAll(existing);
                    }
                    List<Recommendation> toSave = new ArrayList<>();
                    for (Map<String, Object> r : recs) {
                        toSave.add(Recommendation.builder()
                                .user(user)
                                .recommendationType(RecommendationType.valueOf((String) r.getOrDefault("type", "TOPIC")))
                                .targetId(((Number) r.getOrDefault("targetId", 1L)).longValue())
                                .title((String) r.get("title"))
                                .reason((String) r.get("reason"))
                                .priorityScore(((Number) r.getOrDefault("priorityScore", 0.8)).doubleValue())
                                .createdAt(LocalDateTime.now())
                                .build());
                    }
                    recommendationRepository.saveAll(toSave);
                    return true;
                }
            }
        } catch (Exception e) {
            log.info("AI service recommendation unavailable or errored ({}), using built-in model.", e.getMessage());
        }
        return false;
    }

    @Transactional
    public void dismissRecommendation(Long recId, User user) {
        recommendationRepository.findById(recId).ifPresent(rec -> {
            if (rec.getUser().getId().equals(user.getId())) {
                rec.setDismissed(true);
                recommendationRepository.save(rec);
            }
        });
    }
}
