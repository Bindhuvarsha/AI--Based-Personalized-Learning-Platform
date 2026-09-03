package com.learnpath.controller;

import com.learnpath.dto.AdaptiveQuizDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.AdaptiveQuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz/adaptive")
@RequiredArgsConstructor
public class AdaptiveQuizController {

    private final AdaptiveQuizService adaptiveQuizService;

    @PostMapping("/start/{topicId}")
    public ResponseEntity<AdaptiveSessionStartResponse> startSession(
            @AuthenticationPrincipal User user,
            @PathVariable Long topicId) {
        return ResponseEntity.ok(adaptiveQuizService.startAdaptiveSession(user, topicId));
    }

    @PostMapping("/submit")
    public ResponseEntity<AdaptiveSubmitAnswerResponse> submitAnswer(
            @AuthenticationPrincipal User user,
            @RequestBody AdaptiveSubmitAnswerRequest request) {
        return ResponseEntity.ok(adaptiveQuizService.submitAnswer(user, request));
    }
}
