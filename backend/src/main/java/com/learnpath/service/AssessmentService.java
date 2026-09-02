package com.learnpath.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnpath.dto.AssessmentDtos.*;
import com.learnpath.exception.BadRequestException;
import com.learnpath.exception.ResourceNotFoundException;
import com.learnpath.model.entity.*;
import com.learnpath.model.enums.DifficultyLevel;
import com.learnpath.model.enums.KnowledgeLevel;
import com.learnpath.model.enums.ProgressStatus;
import com.learnpath.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final ProgressRepository progressRepository;
    private final RecommendationService recommendationService;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public List<AssessmentResponse> getAssessmentsBySubject(String subject, DifficultyLevel difficulty) {
        List<Assessment> list;
        if (difficulty != null) {
            list = assessmentRepository.findBySubjectIgnoreCaseAndDifficulty(subject, difficulty);
        } else if (subject != null && !subject.isBlank()) {
            list = assessmentRepository.findBySubjectIgnoreCase(subject);
        } else {
            list = assessmentRepository.findAll();
        }

        return list.stream().map(this::mapToResponseWithoutAnswers).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssessmentResponse getAssessmentById(Long id) {
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found: " + id));
        return mapToResponseWithoutAnswers(assessment);
    }

    @Transactional
    public AssessmentResultResponse submitAssessment(User user, SubmitAssessmentRequest request) {
        Assessment assessment = assessmentRepository.findById(request.getAssessmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found: " + request.getAssessmentId()));

        Map<Long, Question> questionMap = questionRepository.findByAssessmentId(assessment.getId()).stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        int totalQuestions = questionMap.size();
        if (totalQuestions == 0) {
            throw new BadRequestException("Assessment has no questions");
        }

        int correctCount = 0;
        List<Answer> answersToSave = new ArrayList<>();
        List<QuestionReviewDto> reviews = new ArrayList<>();
        Map<Topic, List<Boolean>> topicPerformanceMap = new HashMap<>();

        for (AnswerSubmission sub : request.getAnswers()) {
            Question question = questionMap.get(sub.getQuestionId());
            if (question == null) continue;

            boolean isCorrect = Objects.equals(question.getCorrectOptionIndex(), sub.getSelectedOptionIndex());
            if (isCorrect) correctCount++;

            Answer answer = Answer.builder()
                    .question(question)
                    .user(user)
                    .selectedOptionIndex(sub.getSelectedOptionIndex() != null ? sub.getSelectedOptionIndex() : -1)
                    .correct(isCorrect)
                    .timeSpentSeconds(sub.getTimeSpentSeconds() != null ? sub.getTimeSpentSeconds() : 0)
                    .submittedAt(LocalDateTime.now())
                    .build();
            answersToSave.add(answer);

            if (question.getTopic() != null) {
                topicPerformanceMap.computeIfAbsent(question.getTopic(), k -> new ArrayList<>()).add(isCorrect);
            }

            reviews.add(QuestionReviewDto.builder()
                    .questionId(question.getId())
                    .questionText(question.getQuestionText())
                    .options(parseOptionsJson(question.getOptions()))
                    .selectedOptionIndex(sub.getSelectedOptionIndex())
                    .correctOptionIndex(question.getCorrectOptionIndex())
                    .correct(isCorrect)
                    .explanation(question.getExplanation())
                    .topicTitle(question.getTopic() != null ? question.getTopic().getTitle() : "General")
                    .build());
        }

        double overallScore = ((double) correctCount / totalQuestions) * 100.0;
        boolean passed = overallScore >= 60.0;

        QuizAttempt attempt = QuizAttempt.builder()
                .user(user)
                .assessment(assessment)
                .score(correctCount)
                .totalQuestions(totalQuestions)
                .percentage(overallScore)
                .passed(passed)
                .timeSpentSeconds(request.getTotalTimeSpentSeconds() != null ? request.getTotalTimeSpentSeconds() : 0)
                .completedAt(LocalDateTime.now())
                .build();

        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);
        for (Answer a : answersToSave) {
            a.setQuizAttempt(savedAttempt);
        }
        answerRepository.saveAll(answersToSave);

        // Process Topic Knowledge Gap Analysis and update user progress
        List<TopicScoreResult> topicScores = new ArrayList<>();
        for (Map.Entry<Topic, List<Boolean>> entry : topicPerformanceMap.entrySet()) {
            Topic topic = entry.getKey();
            List<Boolean> results = entry.getValue();
            long topicCorrect = results.stream().filter(Boolean::booleanValue).count();
            double topicPct = ((double) topicCorrect / results.size()) * 100.0;

            KnowledgeLevel level;
            String recommendation;
            if (topicPct < 50.0) {
                level = KnowledgeLevel.WEAK;
                recommendation = "High Priority: Review fundamentals and study materials.";
            } else if (topicPct < 70.0) {
                level = KnowledgeLevel.DEVELOPING;
                recommendation = "Moderate Priority: Practice additional topic quizzes.";
            } else if (topicPct < 85.0) {
                level = KnowledgeLevel.PROFICIENT;
                recommendation = "Good: Ready for next milestone prerequisites.";
            } else {
                level = KnowledgeLevel.ADVANCED;
                recommendation = "Mastered: Topic concepts fully solidified.";
            }

            // Update user progress for this topic
            Progress progress = progressRepository.findByUserAndTopic(user, topic)
                    .orElseGet(() -> Progress.builder()
                            .user(user)
                            .topic(topic)
                            .status(ProgressStatus.IN_PROGRESS)
                            .attemptsCount(0)
                            .totalTimeSpentMinutes(0)
                            .build());

            progress.setMasteryScore(topicPct);
            progress.setKnowledgeLevel(level);
            progress.setAttemptsCount(progress.getAttemptsCount() + 1);
            progress.setLastAttemptAt(LocalDateTime.now());
            if (topicPct >= 70.0) {
                progress.setStatus(ProgressStatus.COMPLETED);
            } else {
                progress.setStatus(ProgressStatus.IN_PROGRESS);
            }
            progressRepository.save(progress);

            topicScores.add(TopicScoreResult.builder()
                    .topicId(topic.getId())
                    .topicTitle(topic.getTitle())
                    .totalQuestions(results.size())
                    .correctQuestions((int) topicCorrect)
                    .percentage(topicPct)
                    .knowledgeLevel(level)
                    .statusRecommendation(recommendation)
                    .build());
        }

        // Trigger refreshed recommendations
        recommendationService.generateRecommendationsForUser(user);

        return AssessmentResultResponse.builder()
                .attemptId(savedAttempt.getId())
                .assessmentId(assessment.getId())
                .assessmentTitle(assessment.getTitle())
                .subject(assessment.getSubject())
                .totalQuestions(totalQuestions)
                .correctAnswers(correctCount)
                .overallScore(overallScore)
                .passed(passed)
                .topicScores(topicScores)
                .questionReviews(reviews)
                .completedAt(savedAttempt.getCompletedAt())
                .build();
    }

    private AssessmentResponse mapToResponseWithoutAnswers(Assessment a) {
        List<QuestionDto> questionDtos = a.getQuestions().stream()
                .map(q -> QuestionDto.builder()
                        .id(q.getId())
                        .topicId(q.getTopic() != null ? q.getTopic().getId() : null)
                        .topicTitle(q.getTopic() != null ? q.getTopic().getTitle() : null)
                        .questionText(q.getQuestionText())
                        .questionType(q.getQuestionType())
                        .options(parseOptionsJson(q.getOptions()))
                        .difficulty(q.getDifficulty())
                        .points(q.getPoints())
                        .build())
                .collect(Collectors.toList());

        return AssessmentResponse.builder()
                .id(a.getId())
                .title(a.getTitle())
                .subject(a.getSubject())
                .difficulty(a.getDifficulty())
                .description(a.getDescription())
                .questions(questionDtos)
                .build();
    }

    private List<String> parseOptionsJson(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            log.error("Failed to parse question options: {}", json);
            return List.of("Option 1", "Option 2", "Option 3", "Option 4");
        }
    }
}
