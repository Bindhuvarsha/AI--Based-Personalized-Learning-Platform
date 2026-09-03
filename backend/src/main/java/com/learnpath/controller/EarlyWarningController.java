package com.learnpath.controller;

import com.learnpath.dto.EarlyWarningDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.EarlyWarningService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/early-warning")
@RequiredArgsConstructor
public class EarlyWarningController {

    private final EarlyWarningService earlyWarningService;

    @GetMapping
    public ResponseEntity<List<EarlyWarningDto>> getActiveWarnings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(earlyWarningService.getActiveWarnings(user));
    }

    @PostMapping("/{warningId}/dismiss")
    public ResponseEntity<Void> dismissWarning(@AuthenticationPrincipal User user,
                                               @PathVariable Long warningId,
                                               @RequestBody DismissWarningRequest request) {
        earlyWarningService.dismissWarning(user, warningId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationDto>> getNotifications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(earlyWarningService.getNotifications(user));
    }
}
