package com.learnpath.controller;

import com.learnpath.dto.CodingDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.CodingTutorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coding")
@RequiredArgsConstructor
public class CodingTutorController {

    private final CodingTutorService codingTutorService;

    @GetMapping("/exercises")
    public ResponseEntity<List<CodingExerciseDto>> getExercises() {
        return ResponseEntity.ok(codingTutorService.listExercises());
    }

    @PostMapping("/run")
    public ResponseEntity<CodeRunResponse> runCode(@AuthenticationPrincipal User user,
                                                  @RequestBody CodeRunRequest request) {
        return ResponseEntity.ok(codingTutorService.runAndReviewCode(user, request));
    }
}
