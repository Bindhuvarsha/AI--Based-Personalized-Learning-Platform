package com.learnpath.controller;

import com.learnpath.dto.QuizDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.AuthService;
import com.learnpath.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
@Tag(name = "Adaptive Quizzes", description = "Endpoints for topic-level adaptive quizzes, answer scoring, and attempt history")
public class QuizController {

    private final QuizService quizService;
    private final AuthService authService;

    @GetMapping("/topic/{topicId}")
    @Operation(summary = "Get adaptive quiz questions tailored to learner's current mastery level")
    public ResponseEntity<QuizDetailsDto> getQuizForTopic(@PathVariable Long topicId) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(quizService.getQuizForTopic(topicId, currentUser));
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit quiz answers, get instant explanations, and update mastery level")
    public ResponseEntity<QuizResultDto> submitQuiz(@Valid @RequestBody QuizSubmitRequest request) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(quizService.submitQuiz(currentUser, request));
    }

    @GetMapping("/history")
    @Operation(summary = "Get current student's quiz attempt history")
    public ResponseEntity<List<QuizHistoryItemDto>> getQuizHistory() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(quizService.getQuizHistory(currentUser));
    }
}
