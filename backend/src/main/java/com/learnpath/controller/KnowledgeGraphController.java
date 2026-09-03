package com.learnpath.controller;

import com.learnpath.dto.KnowledgeGraphDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.KnowledgeGraphService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/knowledge-graph")
@RequiredArgsConstructor
public class KnowledgeGraphController {

    private final KnowledgeGraphService knowledgeGraphService;

    @GetMapping
    public ResponseEntity<KnowledgeGraphResponse> getGraph(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(knowledgeGraphService.getFullGraph(user));
    }

    @GetMapping("/prerequisites/{conceptId}")
    public ResponseEntity<PrerequisiteLookupResponse> getPrerequisites(@PathVariable Long conceptId) {
        return ResponseEntity.ok(knowledgeGraphService.getPrerequisites(conceptId));
    }
}
