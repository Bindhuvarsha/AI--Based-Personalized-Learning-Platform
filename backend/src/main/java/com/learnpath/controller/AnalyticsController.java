package com.learnpath.controller;

import com.learnpath.dto.AnalyticsDtos.AnalyticsDashboardResponse;
import com.learnpath.model.entity.User;
import com.learnpath.service.AnalyticsService;
import com.learnpath.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics & Mastery", description = "Endpoints for learning progress metrics, quiz performance trends, and knowledge radar charts")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "Get aggregated analytics dashboard data for current student")
    public ResponseEntity<AnalyticsDashboardResponse> getAnalytics() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(analyticsService.getAnalyticsDashboard(currentUser));
    }
}
