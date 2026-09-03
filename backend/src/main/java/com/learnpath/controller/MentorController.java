package com.learnpath.controller;

import com.learnpath.dto.MentorDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.MentorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mentor")
@RequiredArgsConstructor
public class MentorController {

    private final MentorService mentorService;

    @GetMapping("/profile")
    public ResponseEntity<MentorProfileDto> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(mentorService.getOrCreateProfile(user));
    }

    @PostMapping("/chat")
    public ResponseEntity<MentorChatResponse> chat(@AuthenticationPrincipal User user,
                                                  @RequestBody MentorChatRequest request) {
        return ResponseEntity.ok(mentorService.chatWithMentor(user, request));
    }

    @GetMapping("/daily-advice")
    public ResponseEntity<DailyAdviceResponse> getDailyAdvice(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(mentorService.getDailyAdvice(user));
    }

    @GetMapping("/weekly-review")
    public ResponseEntity<WeeklyReviewResponse> getWeeklyReview(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(mentorService.getWeeklyReview(user));
    }
}
