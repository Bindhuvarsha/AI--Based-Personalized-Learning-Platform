package com.learnpath.controller;

import com.learnpath.dto.GamificationDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.GamificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gamification")
@RequiredArgsConstructor
public class GamificationController {

    private final GamificationService gamificationService;

    @GetMapping("/profile")
    public ResponseEntity<GamificationProfileResponse> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(gamificationService.getProfile(user));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<LeaderboardResponse> getLeaderboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(gamificationService.getLeaderboard(user));
    }

    @PostMapping("/award-xp")
    public ResponseEntity<Void> awardXp(
            @AuthenticationPrincipal User user,
            @RequestParam int amount,
            @RequestParam String reason,
            @RequestParam(required = false) String idempotencyKey) {
        gamificationService.awardXP(user, amount, reason, idempotencyKey);
        return ResponseEntity.ok().build();
    }
}
