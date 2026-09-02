package com.learnpath.service;

import com.learnpath.dto.RoadmapDtos.*;
import com.learnpath.exception.ResourceNotFoundException;
import com.learnpath.model.entity.Course;
import com.learnpath.model.entity.Progress;
import com.learnpath.model.entity.Topic;
import com.learnpath.model.entity.User;
import com.learnpath.model.enums.KnowledgeLevel;
import com.learnpath.model.enums.ProgressStatus;
import com.learnpath.repository.CourseRepository;
import com.learnpath.repository.ProgressRepository;
import com.learnpath.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoadmapService {

    private final CourseRepository courseRepository;
    private final TopicRepository topicRepository;
    private final ProgressRepository progressRepository;

    @Transactional(readOnly = true)
    public RoadmapResponse getPersonalizedRoadmap(Long courseId, User user) {
        Course course;
        if (courseId != null) {
            course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));
        } else {
            // Default to first published course
            List<Course> courses = courseRepository.findByPublishedTrue();
            if (courses.isEmpty()) {
                throw new ResourceNotFoundException("No published courses available");
            }
            course = courses.get(0);
        }

        List<Topic> topics = topicRepository.findByCourseIdOrderByOrderIndexAsc(course.getId());
        Map<Long, Progress> progressMap = progressRepository.findByUserId(user.getId()).stream()
                .collect(Collectors.toMap(p -> p.getTopic().getId(), p -> p, (p1, p2) -> p1));

        Set<Long> completedTopicIds = new HashSet<>();
        for (Topic t : topics) {
            Progress p = progressMap.get(t.getId());
            if (p != null && (p.getStatus() == ProgressStatus.COMPLETED ||
                    p.getKnowledgeLevel() == KnowledgeLevel.PROFICIENT ||
                    p.getKnowledgeLevel() == KnowledgeLevel.ADVANCED)) {
                completedTopicIds.add(t.getId());
            }
        }

        List<RoadmapNode> nodes = new ArrayList<>();
        boolean foundRecommendedNext = false;

        for (Topic t : topics) {
            List<Long> prereqIds = parsePrerequisites(t.getPrerequisites());

            // Topic is unlocked if it has no prerequisites, or if ALL prerequisites are satisfied
            boolean isUnlocked = prereqIds.isEmpty() || completedTopicIds.containsAll(prereqIds);

            Progress p = progressMap.get(t.getId());
            ProgressStatus status = p != null ? p.getStatus() : ProgressStatus.NOT_STARTED;
            KnowledgeLevel knowledgeLevel = p != null ? p.getKnowledgeLevel() : KnowledgeLevel.WEAK;
            Double masteryScore = p != null ? p.getMasteryScore() : 0.0;

            boolean recommendedNext = false;
            if (isUnlocked && status != ProgressStatus.COMPLETED && !foundRecommendedNext) {
                recommendedNext = true;
                foundRecommendedNext = true;
            }

            nodes.add(RoadmapNode.builder()
                    .topicId(t.getId())
                    .title(t.getTitle())
                    .description(t.getDescription())
                    .orderIndex(t.getOrderIndex())
                    .prerequisiteTopicIds(prereqIds)
                    .isUnlocked(isUnlocked)
                    .status(status)
                    .knowledgeLevel(knowledgeLevel)
                    .masteryScore(masteryScore)
                    .estimatedMinutes(t.getEstimatedMinutes())
                    .recommendedNext(recommendedNext)
                    .build());
        }

        int totalTopics = topics.size();
        int completedCount = completedTopicIds.size();
        double progressPercentage = totalTopics > 0 ? ((double) completedCount / totalTopics) * 100.0 : 0.0;

        return RoadmapResponse.builder()
                .courseId(course.getId())
                .courseTitle(course.getTitle())
                .totalTopics(totalTopics)
                .completedTopics(completedCount)
                .progressPercentage(Math.round(progressPercentage * 10.0) / 10.0)
                .nodes(nodes)
                .build();
    }

    private List<Long> parsePrerequisites(String prereqStr) {
        if (prereqStr == null || prereqStr.trim().isEmpty()) {
            return Collections.emptyList();
        }

        List<Long> ids = new ArrayList<>();
        for (String part : prereqStr.split(",")) {
            try {
                ids.add(Long.parseLong(part.trim()));
            } catch (NumberFormatException ignored) {}
        }
        return ids;
    }
}
