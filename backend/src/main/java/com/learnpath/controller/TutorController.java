package com.learnpath.controller;

import com.learnpath.dto.TutorDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.AuthService;
import com.learnpath.service.TutorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tutor")
@RequiredArgsConstructor
@Tag(name = "RAG AI Tutor", description = "Endpoints for document uploads, multilingual AI tutor chat, and source retrieval")
public class TutorController {

    private final TutorService tutorService;
    private final AuthService authService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload study material (PDF, TXT, MD) to extract, chunk, and index into vector store")
    public ResponseEntity<DocumentUploadResponse> uploadDocument(@RequestParam("file") MultipartFile file) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(tutorService.uploadDocument(file, currentUser));
    }

    @PostMapping("/chat")
    @Operation(summary = "Ask AI tutor a question grounded in uploaded study materials with source citations")
    public ResponseEntity<TutorChatResponse> chat(@Valid @RequestBody TutorChatRequest request) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(tutorService.askTutor(request, currentUser));
    }

    @GetMapping("/conversations")
    @Operation(summary = "Get list of previous tutor chat conversations for the current student")
    public ResponseEntity<List<ConversationSummaryDto>> getConversations() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(tutorService.getUserConversations(currentUser));
    }

    @GetMapping("/conversations/{id}/messages")
    @Operation(summary = "Get messages and citations for a specific tutor conversation")
    public ResponseEntity<List<Map<String, Object>>> getConversationMessages(@PathVariable Long id) {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(tutorService.getConversationMessages(id, currentUser));
    }

    @GetMapping("/documents")
    @Operation(summary = "Get list of all uploaded study documents indexed for current student")
    public ResponseEntity<List<String>> getDocuments() {
        User currentUser = authService.getCurrentUser();
        return ResponseEntity.ok(tutorService.getUserDocuments(currentUser));
    }
}
