package com.learnpath.controller;

import com.learnpath.dto.CareerRoadmapDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.CareerRoadmapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/career-roadmap")
@RequiredArgsConstructor
public class CareerRoadmapController {

    private final CareerRoadmapService careerRoadmapService;

    @GetMapping("/paths")
    public ResponseEntity<List<CareerPathDto>> listPaths() {
        return ResponseEntity.ok(careerRoadmapService.listCareerPaths());
    }

    @GetMapping("/paths/{pathId}")
    public ResponseEntity<CareerRoadmapResponse> getRoadmap(
            @AuthenticationPrincipal User user,
            @PathVariable Long pathId) {
        return ResponseEntity.ok(careerRoadmapService.getOrGenerateRoadmap(user, pathId));
    }
}
