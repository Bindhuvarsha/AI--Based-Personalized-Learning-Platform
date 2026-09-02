package com.learnpath.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnpath.dto.AssessmentDtos;
import com.learnpath.dto.QuizDtos.*;
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
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuizService {

    private final TopicRepository topicRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final AnswerRepository answerRepository;
    private final ProgressRepository progressRepository;
    private final RecommendationService recommendationService;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public QuizDetailsDto getQuizForTopic(Long topicId, User user) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found: " + topicId));

        // Determine student's adaptive difficulty level based on current progress
        Progress progress = progressRepository.findByUserAndTopic(user, topic).orElse(null);
        DifficultyLevel currentDifficulty = DifficultyLevel.BEGINNER;
        if (progress != null) {
            if (progress.getMasteryScore() >= 80) {
                currentDifficulty = DifficultyLevel.ADVANCED;
            } else if (progress.getMasteryScore() >= 50) {
                currentDifficulty = DifficultyLevel.INTERMEDIATE;
            }
        }

        List<Question> questions = questionRepository.findByTopicId(topicId);
        if (questions.isEmpty()) {
            throw new BadRequestException("No questions available for this topic yet.");
        }

        // Filter by current adaptive difficulty if matching questions exist, or take all
        List<Question> filtered = questions.stream()
                .filter(q -> q.getDifficulty() == current Difficulty)
                .collect(Collectors.toList());
        if (filtered.isEmpty()) {
            filtered = questions; // Fallback to all questions for this topic
        }

        List<AssessmentDtos.QuestionDto> questionDtos = filtered.stream()
                .map(q -> AssessmentDtos.QuestionDto.builder()
                        .id(q.getId())
                        .topicId(topic.getId())
                        .topicTitle(topic.getTitle())
                        .questionText(q.getQuestionText())
                        .questionType(q.getQuestionType())
                        .options(parseOptionsJson(q.getOptions()))
                        .difficulty(q.getDifficulty())
                        .points(q.getPoints())
                        .build())
                .collect(Collectors.toList());

        return QuizDetailsDto.builder()
                .topicId(topic.getId())
                .topicTitle(topic.getTitle())
                .courseTitle(topic.getCourse().getTitle())
                .currentDifficulty(currentDifficulty)
                .questions(questionDtos)
                .build();
    }

    @Transactional
    public QuizResultDto submitQuiz(User user, QuizSubmitRequest request) {
        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic not found: " + request.getTopicId()));

        Map<Long, Question> questionMap = questionRepository.findByTopicId(topic.getId()).stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        int correctCount = 0;
        List<Answer> answersToSave = new ArrayList<>();
        List<AssessmentDtos.QuestionReviewDto> reviews = new ArrayList<>();

        for (AssessmentDtos.AnswerSubmission sub : request.getAnswers()) {
            Question question = questionMap.get(sub.getQuestionId());
            if (question == null)
                continue;

            boolean isCorrect = Objects.equals(question.getCorrectOptionIndex(), sub.getSelectedOptionIndex());
            if (isCorrect)
                correctCount++;

            Answer answer = Answer.builder()
                    .question(question)
                    .user(user)
                    .selectedOptionIndex(sub.getSelectedOptionIndex() != null ? sub.getSelectedOptionIndex() : -1)
                    .correct(isCorrect)
                    .timeSpentSeconds(sub.getTimeSpentSeconds() != null ? sub.getTimeSpentSeconds() : 0)
                    .submittedAt(LocalDateTime.now())
                    .build();
            answersToSave.add(answer);

            reviews.add(AssessmentDtos.QuestionReviewDto.builder()
                    .questionId(question.getId())
                    .questionText(question.getQuestionText())
                    .options(parseOptionsJson(question.getOptions()))
                    .selectedOptionIndex(sub.getSelectedOptionIndex())
                    .correctOptionIndex(question.getCorrectOptionIndex())
                    .correct(isCorrect)
                    .explanation(question.getExplanation())
                    .topicTitle(topic.getTitle())
                    .build());
        }

        int totalQuestions = request.getAnswers().size();
        double percentage = totalQuestions > 0 ? ((double) correctCount / totalQuestions) * 100.0 : 0.0;
        boolean passed = percentage >= 60.0;

        QuizAttempt attempt = QuizAttempt.builder()
                .user(user)
                .topic(topic)
                .score(correctCount)
                .totalQuestions(totalQuestions)
                .percentage(percentage)
                .passed(passed)
                .timeSpentSeconds(request.getTimeSpentSeconds() != null ? request.getTimeSpentSeconds() : 0)
                .completedAt(LocalDateTime.now())
                .build();

        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);
        for (Answer a : answersToSave) {
            a.setQuizAttempt(savedAttempt);
        }
        answerRepository.saveAll(answersToSave);

        // Update topic progress & adaptive knowledge level
        Progress progress = progressRepository.findByUserAndTopic(user, topic)
                .orElseGet(() -> Progress.builder()
                        .user(user)
                        .topic(topic)
                        .status(ProgressStatus.IN_PROGRESS)
                        .attemptsCount(0)
                        .totalTimeSpentMinutes(0)
                        .build());

        // Blend new score with prior progress (weighted 70% current attempt, 30% prior)
        double updatedMastery = progress.getAttemptsCount() == 0
                ? percentage
                : (progress.getMasteryScore() * 0.3) + (percentage * 0.7);

        progress.setMasteryScore(Math.round(updatedMastery * 10.0) / 10.0);
        progress.setAttemptsCount(progress.getAttemptsCount() + 1);
        int addedMinutes = request.getTimeSpentSeconds() != null ? Math.max(1, request.getTimeSpentSeconds() / 60) : 2;
        progress.setTotalTimeSpentMinutes(progress.getTotalTimeSpentMinutes() + addedMinutes);
        progress.setLastAttemptAt(LocalDateTime.now());

        String nextDifficulty;
        if (updatedMastery >= 85.0) {
            progress.setKnowledgeLevel(KnowledgeLevel.ADVANCED);
            progress.setStatus(ProgressStatus.COMPLETED);
            nextDifficulty = "ADVANCED (Mastered)";
        } else if (updatedMastery >= 70.0) {
            progress.setKnowledgeLevel(KnowledgeLevel.PROFICIENT);
            progress.setStatus(ProgressStatus.COMPLETED);
            nextDifficulty = "ADVANCED";
        } else if (updatedMastery >= 50.0) {
            progress.setKnowledgeLevel(KnowledgeLevel.DEVELOPING);
            progress.setStatus(ProgressStatus.IN_PROGRESS);
            nextDifficulty = "INTERMEDIATE";
        } else {
            progress.setKnowledgeLevel(KnowledgeLevel.WEAK);
            progress.setStatus(ProgressStatus.IN_PROGRESS);
            nextDifficulty = "BEGINNER";
        }
        progressRepository.save(progress);

        // Refresh recommendations asynchronously
        recommendationService.generateRecommendationsForUser(user);

        String feedbackMessage = passed
                ? "Great job! You passed with " + String.format("%.1f", percentage) + "%. Next recommended tier: "
                        + nextDifficulty
                : "Keep practicing! You scored " + String.format("%.1f", percentage)
                        + "%. Review the explanations below and try again.";

        return QuizResultDto.builder()
                .attemptId(savedAttempt.getId())
                .topicId(topic.getId())
                .topicTitle(topic.getTitle())
                .score(correctCount)
                .totalQuestions(totalQuestions)
                .percentage(percentage)
                .passed(passed)
                .nextDifficulty(nextDifficulty)
                .feedbackMessage(feedbackMessage)
                .reviews(reviews)
                .completedAt(savedAttempt.getCompletedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<QuizHistoryItemDto> getQuizHistory(User user) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy HH:mm");
        return quizAttemptRepository.findByUserIdOrderByCompletedAtDesc(user.getId()).stream()
                .map(qa -> QuizHistoryItemDto.builder()
                        .attemptId(qa.getId())
                        .topicId(qa.getTopic() != null ? qa.getTopic().getId() : null)
                        .topicTitle(qa.getTopic() != null ? qa.getTopic().getTitle()
                                : (qa.getAssessment() != null ? qa.getAssessment().getTitle() : "Assessment"))
                        .score(qa.getScore())
                        .totalQuestions(qa.getTotalQuestions())
                        .percentage(qa.getPercentage())
                        .passed(qa.isPassed())
                        .timeSpentSeconds(qa.getTimeSpentSeconds())
                        .completedAt(qa.getCompletedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private List<String> parseOptionsJson(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {
            });
        } catch (Exception e) {
            return List.of("Option A", "Option B", "Option C", "Option D");
        }
    }
}
