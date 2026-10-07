package com.learnpath.controller;

import com.learnpath.dto.TeacherDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/teacher", "/api/v1/teacher"})
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;
    private final com.learnpath.service.AuthService authService;

    @GetMapping("/cohort-analytics")
    public ResponseEntity<CohortAnalyticsResponse> getCohortAnalytics() {
        return ResponseEntity.ok(teacherService.getCohortAnalytics());
    }

    @PostMapping("/intervene")
    public ResponseEntity<TeacherInterventionResponse> sendIntervention(
            @RequestBody TeacherInterventionRequest request
    ) {
        User teacher = authService.getCurrentUser();
        return ResponseEntity.ok(teacherService.sendIntervention(request, teacher));
    }
}
