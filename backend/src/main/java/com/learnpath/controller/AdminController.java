package com.learnpath.controller;

import com.learnpath.dto.CourseDtos.*;
import com.learnpath.model.entity.User;
import com.learnpath.service.AuthService;
import com.learnpath.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Management", description = "Endpoints for administrators to manage courses, topics, and study materials")
public class AdminController {

    private final CourseService courseService;
    private final AuthService authService;

    @GetMapping("/courses")
    @Operation(summary = "Get all courses (published and draft) for admin management")
    public ResponseEntity<List<CourseResponse>> getAllCoursesAdmin() {
        return ResponseEntity.ok(courseService.getAllCoursesAdmin());
    }

    @PostMapping("/courses")
    @Operation(summary = "Create a new course in the curriculum catalog")
    public ResponseEntity<CourseResponse> createCourse(@Valid @RequestBody CreateCourseRequest request) {
        User adminUser = authService.getCurrentUser();
        return ResponseEntity.ok(courseService.createCourse(request, adminUser));
    }

    @PutMapping("/courses/{id}")
    @Operation(summary = "Update course details and publication status")
    public ResponseEntity<CourseResponse> updateCourse(@PathVariable Long id, @Valid @RequestBody CreateCourseRequest request) {
        return ResponseEntity.ok(courseService.updateCourse(id, request));
    }

    @DeleteMapping("/courses/{id}")
    @Operation(summary = "Delete course from catalog")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/courses/{courseId}/topics")
    @Operation(summary = "Add a new syllabus topic to a course with prerequisites")
    public ResponseEntity<TopicSummaryDto> createTopic(@PathVariable Long courseId, @Valid @RequestBody CreateTopicRequest request) {
        return ResponseEntity.ok(courseService.createTopic(courseId, request));
    }

    @PostMapping("/topics/{topicId}/materials")
    @Operation(summary = "Attach notes, documents, or articles to a topic")
    public ResponseEntity<LearningMaterialDto> addMaterial(@PathVariable Long topicId, @Valid @RequestBody CreateMaterialRequest request) {
        return ResponseEntity.ok(courseService.addMaterial(topicId, request));
    }
}
