package com.learnpath.controller;

import com.learnpath.dto.CourseDtos.*;
import com.learnpath.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Tag(name = "Courses & Curriculum", description = "Endpoints for exploring published courses, topics, and study materials")
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    @Operation(summary = "Get all published courses")
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllPublishedCourses());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get course details by ID including syllabus topics")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/topics/{topicId}")
    @Operation(summary = "Get full topic details including learning notes and materials")
    public ResponseEntity<TopicDetailResponse> getTopicDetails(@PathVariable Long topicId) {
        return ResponseEntity.ok(courseService.getTopicDetails(topicId));
    }
}
