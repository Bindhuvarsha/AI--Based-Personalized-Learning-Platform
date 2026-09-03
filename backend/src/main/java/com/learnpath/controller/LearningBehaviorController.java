package com.learnpath.controller;

import com.learnpath.dto.BehaviorDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.LearningBehaviorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/behavior")
@RequiredArgsConstructor
public class LearningBehaviorController {

    private final LearningBehaviorService behaviorService;

    @GetMapping("/predict")
    public ResponseEntity<BehaviorPredictionResponse> predict(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(behaviorService.predictStudentBehavior(user));
    }
}
