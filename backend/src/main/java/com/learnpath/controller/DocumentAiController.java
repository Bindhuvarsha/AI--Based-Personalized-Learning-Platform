package com.learnpath.controller;

import com.learnpath.dto.DocumentAiDtos.*;
import com.learnpath.service.DocumentAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping({"/api/document-ai", "/api/v1/document-ai"})
@RequiredArgsConstructor
public class DocumentAiController {

    private final DocumentAiService documentAiService;

    @PostMapping("/summarize-text")
    public ResponseEntity<SummarizeContentResponse> summarizeText(@RequestBody SummarizeContentRequest request) {
        return ResponseEntity.ok(documentAiService.summarizeText(request));
    }

    @PostMapping(value = "/summarize-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SummarizeContentResponse> summarizeFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "language", defaultValue = "english") String language
    ) {
        return ResponseEntity.ok(documentAiService.summarizeFile(file, language));
    }

    @PostMapping("/quiz-from-text")
    public ResponseEntity<DocQuizResponse> generateQuizFromText(@RequestBody DocQuizRequest request) {
        return ResponseEntity.ok(documentAiService.generateQuizFromText(request));
    }

    @PostMapping(value = "/quiz-from-file", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocQuizResponse> generateQuizFromFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "count", defaultValue = "5") Integer count,
            @RequestParam(value = "difficulty", defaultValue = "INTERMEDIATE") String difficulty
    ) {
        return ResponseEntity.ok(documentAiService.generateQuizFromFile(file, count, difficulty));
    }
}
