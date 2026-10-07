package com.learnpath.controller;

import com.learnpath.dto.AdaptiveQuizDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.AdaptiveQuizService;
import com.learnpath.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz/adaptive")
@RequiredArgsConstructor
public class AdaptiveQuizController {

    private final AdaptiveQuizService adaptiveQuizService;
    private final AuthService authService;

    @PostMapping("/start/{topicId}")
    public ResponseEntity<AdaptiveSessionStartResponse> startSession(@PathVariable Long topicId) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(adaptiveQuizService.startAdaptiveSession(user, topicId));
    }

    @PostMapping("/submit")
    public ResponseEntity<AdaptiveSubmitAnswerResponse> submitAnswer(@RequestBody AdaptiveSubmitAnswerRequest request) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(adaptiveQuizService.submitAnswer(user, request));
    }
}
