package com.learnpath.controller;

import com.learnpath.dto.RecommendationDtos.RecommendationItemDto;
import com.learnpath.model.entity.User;
import com.learnpath.service.AuthService;
import com.learnpath.service.RecommendationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@Tag(name = "AI Recommendations", description = "Endpoints for AI and ML-driven personalized study recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "Get active AI recommendations tailored to current knowledge gaps and roadmap")
    public ResponseEntity<List<RecommendationItemDto>> getRecommendations() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(recommendationService.getUserRecommendations(currentUser));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Force recalculate and refresh recommendations based on latest user metrics")
    public ResponseEntity<List<RecommendationItemDto>> refreshRecommendations() {
        User currentUser = authService.getCurrentUser();
        recommendationService.generateRecommendationsForUser(currentUser);
        return ResponseEntity.ok(recommendationService.getUserRecommendations(currentUser));
    }

    @DeleteMapping("/{id}/dismiss")
    @Operation(summary = "Dismiss a specific recommendation card")
    public ResponseEntity<Void> dismissRecommendation(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        recommendationService.dismissRecommendation(id, currentUser);
        return ResponseEntity.noContent().build();
    }
}
