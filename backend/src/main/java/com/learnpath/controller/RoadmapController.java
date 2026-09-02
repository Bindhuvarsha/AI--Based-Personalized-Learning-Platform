package com.learnpath.controller;

import com.learnpath.dto.RoadmapDtos.RoadmapResponse;
import com.learnpath.model.entity.User;
import com.learnpath.service.AuthService;
import com.learnpath.service.RoadmapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roadmap")
@RequiredArgsConstructor
@Tag(name = "Personalized Roadmap", description = "Endpoints for dynamic DAG-ordered prerequisite learning roadmaps")
public class RoadmapController {

    private final RoadmapService roadmapService;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "Get personalized learning roadmap for user's primary or active course")
    public ResponseEntity<RoadmapResponse> getRoadmap(@RequestParam(required = false) Long courseId) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(roadmapService.getPersonalizedRoadmap(courseId, currentUser));
    }
}
