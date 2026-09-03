package com.learnpath.controller;

import com.learnpath.dto.ResumeDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.ResumeAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeAnalysisService resumeService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResumeUploadResponse> uploadResume(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(resumeService.uploadAndExtract(user, file));
    }

    @PostMapping("/analyze")
    public ResponseEntity<SkillGapAnalysisResponse> analyzeGap(
            @AuthenticationPrincipal User user,
            @RequestParam Long documentId,
            @RequestParam(required = false) String targetRole) {
        return ResponseEntity.ok(resumeService.analyzeGapAgainstTarget(user, documentId, targetRole));
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> deleteResume(
            @AuthenticationPrincipal User user,
            @PathVariable Long documentId) {
        resumeService.deleteResume(user, documentId);
        return ResponseEntity.ok().build();
    }
}
