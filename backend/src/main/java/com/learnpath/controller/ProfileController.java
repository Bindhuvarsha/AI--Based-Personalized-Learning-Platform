package com.learnpath.controller;

import com.learnpath.dto.ProfileDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.AuthService;
import com.learnpath.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "Student Profile", description = "Endpoints for retrieving and updating learner profile, goals, and preferences")
public class ProfileController {

    private final ProfileService profileService;
    private final AuthService authService;

    @GetMapping
    @Operation(summary = "Get current student's profile details")
    public ResponseEntity<ProfileResponse> getProfile() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(profileService.getProfile(currentUser));
    }

    @PutMapping
    @Operation(summary = "Update student learning goals, difficulty, language, and interests")
    public ResponseEntity<ProfileResponse> updateProfile(@RequestBody UpdateProfileRequest request) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(profileService.updateProfile(currentUser, request));
    }
}
