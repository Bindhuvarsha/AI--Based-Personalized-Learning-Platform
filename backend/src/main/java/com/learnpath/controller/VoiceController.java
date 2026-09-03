package com.learnpath.controller;

import com.learnpath.dto.VoiceDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.VoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/voice")
@RequiredArgsConstructor
public class VoiceController {

    private final VoiceService voiceService;

    @PostMapping("/session")
    public ResponseEntity<Long> createSession(@AuthenticationPrincipal User user,
                                              @RequestParam(required = false) String title) {
        return ResponseEntity.ok(voiceService.startSession(user, title).getId());
    }

    @PostMapping(value = "/process", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VoiceProcessResponse> processAudio(
            @AuthenticationPrincipal User user,
            @RequestParam("sessionId") Long sessionId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "language", defaultValue = "ENGLISH") String language) {
        return ResponseEntity.ok(voiceService.processVoiceAudio(user, sessionId, file, language));
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<VoiceSessionDetailsDto> getSession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(voiceService.getSessionDetails(sessionId));
    }
}
