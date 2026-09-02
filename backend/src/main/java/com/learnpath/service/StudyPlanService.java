package com.learnpath.service;

import com.learnpath.dto.StudyPlanDtos.*;
import com.learnpath.exception.BadRequestException;
import com.learnpath.exception.ResourceNotFoundException;
import com.learnpath.model.entity.*;
import com.learnpath.model.enums.KnowledgeLevel;
import com.learnpath.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyPlanService {

    private final StudyPlanRepository studyPlanRepository;
    private final StudyPlanItemRepository studyPlanItemRepository;
    private final ProgressRepository progressRepository;
    private final TopicRepository topicRepository;

    @Transactional
    public StudyPlanResponse generatePlan(User user, GeneratePlanRequest request) {
        int duration = (request.getDurationDays() != null && request.getDurationDays() >= 30) ? 30 : 7;
        int weeklyHours = request.getAvailableHoursPerWeek() != null ? request.getAvailableHoursPerWeek() : 10;

        // Calculate average current knowledge level from user progress
        List<Progress> progressList = progressRepository.findByUserId(user.getId());
        double avgMastery = progressList.stream().mapToDouble(Progress::getMasteryScore).average().orElse(30.0);
        KnowledgeLevel startingLevel = avgMastery >= 70 ? KnowledgeLevel.PROFICIENT
                : avgMastery >= 50 ? KnowledgeLevel.DEVELOPING : KnowledgeLevel.WEAK;

        LocalDate startDate = LocalDate.now();
        LocalDate targetDate = startDate.plusDays(duration);

        // Deactivate any existing active plans for this user
        studyPlanRepository.findFirstByUserIdAndActiveTrueOrderByCreatedAtDesc(user.getId())
                .ifPresent(p -> {
                    p.setActive(false);
                    studyPlanRepository.save(p);
                });

        StudyPlan plan = StudyPlan.builder()
                .user(user)
                .goalTitle(request.getGoalTitle())
                .durationDays(duration)
                .availableHoursPerWeek(weeklyHours)
                .startingKnowledgeLevel(startingLevel)
                .startDate(startDate)
                .targetDate(targetDate)
                .active(true)
                .build();

        StudyPlan savedPlan = studyPlanRepository.save(plan);

        // Fetch curriculum topics to distribute across schedule
        List<Topic> topics = topicRepository.findAllByOrderByOrderIndexAsc();
        if (topics.isEmpty()) {
            throw new BadRequestException("No curriculum topics available to build plan");
        }

        List<StudyPlanItem> items = new ArrayList<>();
        int minutesPerDay = (int) Math.round(((double) weeklyHours / 7.0) * 60.0);

        for (int day = 1; day <= duration; day++) {
            LocalDate dayDate = startDate.plusDays(day - 1);
            Topic assignedTopic = topics.get((day - 1) % topics.size());

            String title;
            String description;
            if (day % 4 == 0) {
                // Assessment / Review milestone day
                title = "Milestone Review & Practice Challenge";
                description = "Consolidate previous lessons and take adaptive quizzes on " + assignedTopic.getTitle() + ".";
            } else if (day == duration) {
                // Final Capstone Day
                title = "Final Mastery Assessment & Retrospective";
                description = "Complete the comprehensive assessment for " + request.getGoalTitle() + ".";
            } else {
                title = "Mastery: " + assignedTopic.getTitle();
                description = "Study topic notes, review core concepts, and complete interactive practice questions.";
            }

            StudyPlanItem item = StudyPlanItem.builder()
                    .studyPlan(savedPlan)
                    .dayNumber(day)
                    .scheduledDate(dayDate)
                    .topic(assignedTopic)
                    .title(title)
                    .description(description)
                    .estimatedMinutes(minutesPerDay > 0 ? minutesPerDay : 45)
                    .completed(false)
                    .build();

            items.add(item);
        }

        studyPlanItemRepository.saveAll(items);
        savedPlan.setItems(items);

        return mapToDto(savedPlan);
    }

    @Transactional(readOnly = true)
    public StudyPlanResponse getCurrentPlan(User user) {
        StudyPlan plan = studyPlanRepository.findFirstByUserIdAndActiveTrueOrderByCreatedAtDesc(user.getId())
                .orElse(null);

        if (plan == null) {
            // Generate a default 7-day plan
            return generatePlan(user, GeneratePlanRequest.builder()
                    .goalTitle("Foundations of Modern Programming & AI")
                    .durationDays(7)
                    .availableHoursPerWeek(10)
                    .build());
        }

        return mapToDto(plan);
    }

    @Transactional
    public StudyPlanItemDto toggleItemCompletion(Long itemId, User user) {
        StudyPlanItem item = studyPlanItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Plan item not found: " + itemId));

        if (!item.getStudyPlan().getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized to modify this study plan item");
        }

        boolean newStatus = !item.isCompleted();
        item.setCompleted(newStatus);
        item.setCompletedAt(newStatus ? LocalDateTime.now() : null);

        StudyPlanItem saved = studyPlanItemRepository.save(item);
        return mapItemToDto(saved);
    }

    private StudyPlanResponse mapToDto(StudyPlan p) {
        List<StudyPlanItemDto> itemDtos = p.getItems().stream()
                .map(this::mapItemToDto)
                .collect(Collectors.toList());

        long completedCount = itemDtos.stream().filter(StudyPlanItemDto::isCompleted).count();
        double pct = itemDtos.size() > 0 ? ((double) completedCount / itemDtos.size()) * 100.0 : 0.0;

        return StudyPlanResponse.builder()
                .id(p.getId())
                .goalTitle(p.getGoalTitle())
                .durationDays(p.getDurationDays())
                .availableHoursPerWeek(p.getAvailableHoursPerWeek())
                .startingKnowledgeLevel(p.getStartingKnowledgeLevel())
                .startDate(p.getStartDate())
                .targetDate(p.getTargetDate())
                .active(p.isActive())
                .totalItems(itemDtos.size())
                .completedItems((int) completedCount)
                .completionPercentage(Math.round(pct * 10.0) / 10.0)
                .items(itemDtos)
                .createdAt(p.getCreatedAt())
                .build();
    }

    private StudyPlanItemDto mapItemToDto(StudyPlanItem i) {
        return StudyPlanItemDto.builder()
                .id(i.getId())
                .dayNumber(i.getDayNumber())
                .scheduledDate(i.getScheduledDate())
                .topicId(i.getTopic() != null ? i.getTopic().getId() : null)
                .topicTitle(i.getTopic() != null ? i.getTopic().getTitle() : null)
                .title(i.getTitle())
                .description(i.getDescription())
                .estimatedMinutes(i.getEstimatedMinutes())
                .completed(i.isCompleted())
                .completedAt(i.getCompletedAt())
                .build();
    }
}
