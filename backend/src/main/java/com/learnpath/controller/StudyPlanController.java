package com.learnpath.controller;

import com.learnpath.dto.StudyPlanDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.AuthService;
import com.learnpath.service.StudyPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/study-plan")
@RequiredArgsConstructor
@Tag(name = "Study Planner", description = "Endpoints for 7-day and 30-day adaptive study schedule generation and task tracking")
public class StudyPlanController {

    private final StudyPlanService studyPlanService;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "Get user's current active study plan")
    public ResponseEntity<StudyPlanResponse> getCurrentPlan() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(studyPlanService.getCurrentPlan(currentUser));
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate a custom 7-day or 30-day study plan from goals and available hours")
    public ResponseEntity<StudyPlanResponse> generatePlan(@Valid @RequestBody GeneratePlanRequest request) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(studyPlanService.generatePlan(currentUser, request));
    }

    @PatchMapping("/items/{itemId}/toggle")
    @Operation(summary = "Toggle completion status of a daily study plan item")
    public ResponseEntity<StudyPlanItemDto> toggleItem(@PathVariable Long itemId) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(studyPlanService.toggleItemCompletion(itemId, currentUser));
    }
}
