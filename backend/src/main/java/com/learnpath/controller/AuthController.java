package com.learnpath.controller;

import com.learnpath.dto.AuthDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration, login, token refresh, and logout")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new student or admin account")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user with email and password")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh expired JWT access token using valid refresh token")
    public ResponseEntity<TokenRefreshResponse> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(authService.refreshAccessToken(request));
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke user refresh token and logout")
    public ResponseEntity<Void> logout() {
        User currentUser = authService.getCurrentUser();
        authService.logout(currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user info")
    public ResponseEntity<UserSummaryDto> getCurrentUser() {
        User user = authService.getCurrentUser();
        boolean onboardingCompleted = user.getStudentProfile() != null &&
                user.getStudentProfile().getLearningGoals() != null &&
                !user.getStudentProfile().getLearningGoals().isBlank();

        UserSummaryDto dto = UserSummaryDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toList()))
                .onboardingCompleted(onboardingCompleted)
                .build();

        return ResponseEntity.ok(dto);
    }
}
