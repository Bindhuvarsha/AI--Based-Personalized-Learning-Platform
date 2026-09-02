package com.learnpath.controller;

import com.learnpath.dto.AssessmentDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.model.enums.DifficultyLevel;
import com.learnpath.service.AssessmentService;
import com.learnpath.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
@Tag(name = "Skill Assessments", description = "Endpoints for skill diagnostic testing, answers evaluation, and knowledge gap classification")
public class AssessmentController {

    private final AssessmentService assessmentService;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "Get available diagnostic skill assessments with optional subject and difficulty filters")
    public ResponseEntity<List<AssessmentResponse>> getAssessments(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) DifficultyLevel difficulty) {
        return ResponseEntity.ok(assessmentService.getAssessmentsBySubject(subject, difficulty));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get assessment questions for taking the assessment")
    public ResponseEntity<AssessmentResponse> getAssessmentById(@PathVariable Long id) {
        return ResponseEntity.ok(assessmentService.getAssessmentById(id));
    }

    @PostMapping("/submit")
    @Operation(summary = "Submit assessment answers, receive topic scores, and calculate knowledge gaps")
    public ResponseEntity<AssessmentResultResponse> submitAssessment(@Valid @RequestBody SubmitAssessmentRequest request) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(assessmentService.submitAssessment(currentUser, request));
    }
}
