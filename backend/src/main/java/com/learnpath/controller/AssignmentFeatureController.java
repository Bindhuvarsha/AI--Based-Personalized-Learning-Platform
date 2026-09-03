package com.learnpath.controller;

import com.learnpath.dto.AssignmentFeatureDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.AssignmentFeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentFeatureController {

    private final AssignmentFeatureService assignmentService;

    @GetMapping
    public ResponseEntity<List<AssignmentSummaryDto>> listAssignments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(assignmentService.listAssignments(user));
    }

    @PostMapping("/{assignmentId}/submit")
    public ResponseEntity<EvaluationResultDto> submitAndEvaluate(
            @AuthenticationPrincipal User user,
            @PathVariable Long assignmentId,
            @RequestBody AssignmentSubmitRequest request) {
        return ResponseEntity.ok(assignmentService.submitAndEvaluate(user, assignmentId, request));
    }

    @PutMapping("/submissions/{submissionId}/override")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EvaluationResultDto> teacherOverride(
            @AuthenticationPrincipal User teacher,
            @PathVariable Long submissionId,
            @RequestBody TeacherOverrideRequest request) {
        return ResponseEntity.ok(assignmentService.overrideScoreByTeacher(teacher, submissionId, request));
    }
}
