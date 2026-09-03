package com.learnpath.controller;

import com.learnpath.dto.VisionDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.VisionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/vision")
@RequiredArgsConstructor
public class VisionController {

    private final VisionService visionService;

    @PostMapping(value = "/solve", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageSolveResponse> solveImage(@AuthenticationPrincipal User user,
                                                         @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(visionService.solveImageQuestion(user, file));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ImageHistoryDto>> getHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(visionService.getHistory(user));
    }
}
