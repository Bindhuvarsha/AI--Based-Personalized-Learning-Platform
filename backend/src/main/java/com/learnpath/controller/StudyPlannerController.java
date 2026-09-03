package com.learnpath.controller;

import com.learnpath.dto.StudyPlannerDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.StudyPlannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/study-planner")
@RequiredArgsConstructor
public class StudyPlannerController {

    private final StudyPlannerService plannerService;

    @GetMapping("/weekly")
    public ResponseEntity<WeeklyScheduleResponse> getWeeklySchedule(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(plannerService.getWeeklySchedule(user));
    }

    @PostMapping("/sessions/{sessionId}/toggle")
    public ResponseEntity<Void> toggleSession(@AuthenticationPrincipal User user,
                                              @PathVariable Long sessionId) {
        plannerService.toggleSessionCompletion(user, sessionId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reschedule")
    public ResponseEntity<Void> reschedule(@AuthenticationPrincipal User user,
                                           @RequestBody RescheduleSessionRequest request) {
        plannerService.rescheduleSession(user, request);
        return ResponseEntity.ok().build();
    }
}
