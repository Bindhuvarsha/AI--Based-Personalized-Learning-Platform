package com.learnpath.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnpath.dto.AdaptiveQuizDtos.*;
import com.learnpath.dto.AssessmentDtos.QuestionDto;
import com.learnpath.model.entity.*;
import com.learnpath.model.enums.DifficultyLevel;
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
public class AdaptiveQuizService {

    private final AdaptiveQuizSessionRepository sessionRepository;
    private final DifficultyAdjustmentRepository adjustmentRepository;
    private final TopicRepository topicRepository;
    private final QuestionRepository questionRepository;
    private final ProgressRepository progressRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public AdaptiveSessionStartResponse startAdaptiveSession(User user, Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new IllegalArgumentException("Topic not found: " + topicId));

        Progress progress = progressRepository.findByUserAndTopic(user, topic).orElse(null);
        DifficultyLevel initialDiff = DifficultyLevel.BEGINNER;
        if (progress != null) {
            if (progress.getMasteryScore() >= 75) initialDiff = DifficultyLevel.ADVANCED;
            else if (progress.getMasteryScore() >= 50) initialDiff = DifficultyLevel.INTERMEDIATE;
        }

        AdaptiveQuizSession session = AdaptiveQuizSession.builder()
                .user(user)
                .topic(topic)
                .currentDifficulty(initialDiff)
                .consecutiveCorrect(0)
                .consecutiveIncorrect(0)
                .totalQuestionsAnswered(0)
                .score(0)
                .isCompleted(false)
                .startedAt(LocalDateTime.now())
                .build();
        AdaptiveQuizSession savedSession = sessionRepository.save(session);

        List<Question> pool = questionRepository.findByTopicId(topicId);
        final DifficultyLevel targetDiff = initialDiff;
        Question firstQuestion = pool.stream()
                .filter(q -> q.getDifficulty() == targetDiff)
                .findFirst()
                .orElse(pool.isEmpty() ? null : pool.get(0));

        QuestionDto questionDto = firstQuestion != null ? toDto(firstQuestion) : null;

        return AdaptiveSessionStartResponse.builder()
                .sessionId(savedSession.getId())
                .topicId(topic.getId())
                .topicTitle(topic.getTitle())
                .currentDifficulty(initialDiff.name())
                .firstQuestion(questionDto)
                .questionNumber(1)
                .totalPlannedQuestions(5)
                .build();
    }

    @Transactional
    public AdaptiveSubmitAnswerResponse submitAnswer(User user, AdaptiveSubmitAnswerRequest request) {
        AdaptiveQuizSession session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + request.getSessionId()));

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("Question not found: " + request.getQuestionId()));

        boolean isCorrect = Objects.equals(question.getCorrectOptionIndex(), request.getSelectedOptionIndex());
        if (isCorrect) {
            session.setScore(session.getScore() + 1);
            session.setConsecutiveCorrect(session.getConsecutiveCorrect() + 1);
            session.setConsecutiveIncorrect(0);
        } else {
            session.setConsecutiveIncorrect(session.getConsecutiveIncorrect() + 1);
            session.setConsecutiveCorrect(0);
        }
        session.setTotalQuestionsAnswered(session.getTotalQuestionsAnswered() + 1);

        DifficultyLevel prevDiff = session.getCurrentDifficulty();
        DifficultyLevel newDiff = prevDiff;
        boolean changed = false;
        String reason = "";

        // Dynamic adjustment rules:
        if (session.getConsecutiveCorrect() >= 2 && prevDiff != DifficultyLevel.ADVANCED) {
            newDiff = (prevDiff == DifficultyLevel.BEGINNER) ? DifficultyLevel.INTERMEDIATE : DifficultyLevel.ADVANCED;
            changed = true;
            reason = "Achieved 2 consecutive correct answers! Increasing challenge tier.";
            session.setConsecutiveCorrect(0);
        } else if (session.getConsecutiveIncorrect() >= 2 && prevDiff != DifficultyLevel.BEGINNER) {
            newDiff = (prevDiff == DifficultyLevel.ADVANCED) ? DifficultyLevel.INTERMEDIATE : DifficultyLevel.BEGINNER;
            changed = true;
            reason = "Missed 2 consecutive answers. Adjusting difficulty to reinforce core understanding.";
            session.setConsecutiveIncorrect(0);
        }

        if (changed) {
            session.setCurrentDifficulty(newDiff);
            adjustmentRepository.save(DifficultyAdjustment.builder()
                    .session(session)
                    .questionNumber(session.getTotalQuestionsAnswered())
                    .previousDifficulty(prevDiff)
                    .newDifficulty(newDiff)
                    .reason(reason)
                    .triggerEvent(isCorrect ? "CONSECUTIVE_CORRECT" : "CONSECUTIVE_INCORRECT")
                    .adjustedAt(LocalDateTime.now())
                    .build());
        }

        boolean isCompleted = session.getTotalQuestionsAnswered() >= 5;
        if (isCompleted) {
            session.setIsCompleted(true);
            session.setCompletedAt(LocalDateTime.now());
        }
        sessionRepository.save(session);

        // Fetch next question if not completed
        QuestionDto nextDto = null;
        if (!isCompleted) {
            List<Question> pool = questionRepository.findByTopicId(session.getTopic().getId());
            final DifficultyLevel nextDiffLevel = newDiff;
            Question nextQ = pool.stream()
                    .filter(q -> q.getDifficulty() == nextDiffLevel && !Objects.equals(q.getId(), question.getId()))
                    .findFirst()
                    .orElse(pool.isEmpty() ? null : pool.get(0));
            if (nextQ != null) {
                nextDto = toDto(nextQ);
            }
        }

        double mastery = ((double) session.getScore() / session.getTotalQuestionsAnswered()) * 100.0;

        return AdaptiveSubmitAnswerResponse.builder()
                .isCorrect(isCorrect)
                .explanation(question.getExplanation())
                .previousDifficulty(prevDiff.name())
                .currentDifficulty(newDiff.name())
                .difficultyChanged(changed)
                .changeReason(reason)
                .nextQuestion(nextDto)
                .isQuizCompleted(isCompleted)
                .currentScore(session.getScore())
                .totalAnswered(session.getTotalQuestionsAnswered())
                .currentMasteryScore(Math.round(mastery * 10.0) / 10.0)
                .build();
    }

    private QuestionDto toDto(Question q) {
        List<String> options;
        try {
            options = objectMapper.readValue(q.getOptions(), new TypeReference<List<String>>() {});
        } catch (Exception e) {
            options = List.of("Option A", "Option B", "Option C", "Option D");
        }

        return QuestionDto.builder()
                .id(q.getId())
                .topicId(q.getTopic() != null ? q.getTopic().getId() : null)
                .topicTitle(q.getTopic() != null ? q.getTopic().getTitle() : "")
                .questionText(q.getQuestionText())
                .questionType(q.getQuestionType())
                .options(options)
                .difficulty(q.getDifficulty())
                .points(q.getPoints())
                .build();
    }
}
