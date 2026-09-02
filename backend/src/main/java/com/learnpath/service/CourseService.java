package com.learnpath.service;

import com.learnpath.dto.CourseDtos.*;
import com.learnpath.exception.ResourceNotFoundException;
import com.learnpath.model.entity.Course;
import com.learnpath.model.entity.LearningMaterial;
import com.learnpath.model.entity.Topic;
import com.learnpath.model.entity.User;
import com.learnpath.model.enums.DifficultyLevel;
import com.learnpath.repository.CourseRepository;
import com.learnpath.repository.LearningMaterialRepository;
import com.learnpath.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

        private final CourseRepository courseRepository;
        private final TopicRepository topicRepository;
        private final LearningMaterialRepository materialRepository;

        @Transactional(readOnly = true)
        public List<CourseResponse> getAllPublishedCourses() {
                return courseRepository.findByPublishedTrue().stream()
                                .map(this::mapToSummaryDto)
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public List<CourseResponse> getAllCoursesAdmin() {
                return courseRepository.findAll().stream()
                                .map(this::mapToSummaryDto)
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public CourseResponse getCourseById(Long id) {
                Course course = courseRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
                return mapToSummaryDto(course);
        }

        @Transactional(readOnly = true)
        public TopicDetailResponse getTopicDetails(Long topicId) {
                Topic topic = topicRepository.findById(topicId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Topic not found with id: " + topicId));

                List<LearningMaterialDto> materials = materialRepository.findByTopicId(topicId).stream()
                                .map(m -> LearningMaterialDto.builder()
                                                .id(m.getId())
                                                .topicId(topicId)
                                                .title(m.getTitle())
                                                .materialType(m.getMaterialType())
                                                .content(m.getContent())
                                                .fileUrl(m.getFileUrl())
                                                .createdAt(m.getCreatedAt())
                                                .build())
                                .collect(Collectors.toList());

                return TopicDetailResponse.builder()
                                .id(topic.getId())
                                .courseId(topic.getCourse().getId())
                                .courseTitle(topic.getCourse().getTitle())
                                .title(topic.getTitle())
                                .description(topic.getDescription())
                                .orderIndex(topic.getOrderIndex())
                                .prerequisites(topic.getPrerequisites())
                                .estimatedMinutes(topic.getEstimatedMinutes())
                                .materials(materials)
                                .build();
        }

        @Transactional
        public CourseResponse createCourse(CreateCourseRequest request, User adminUser) {
                Course course = Course.builder()
                                .title(request.getTitle())
                                .description(request.getDescription())
                                .category(request.getCategory())
                                .difficulty(request.getDifficulty() != null ? request.getDifficulty()
                                                : DifficultyLevel.BEGINNER)
                                .published(request.getPublished() != null ? request.getPublished() : true)
                                .createdBy(adminUser)
                                .build();

                Course saved = courseRepository.save(course);
                return mapToSummaryDto(saved);
        }

        @Transactional
        public CourseResponse updateCourse(Long id, CreateCourseRequest request) {
                Course course = courseRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

                course.setTitle(request.getTitle());
                if (request.getDescription() != null)
                        course.setDescription(request.getDescription());
                course.setCategory(request.getCategory());
                if (request.getDifficulty() != null)
                        course.setDifficulty(request.getDifficulty());
                if (request.getPublished() != null)
                        course.setPublished(request.getPublished());

                Course updated = courseRepository.save(course);
                return mapToSummaryDto(updated);
        }

        @Transactional
        public void deleteCourse(Long id) {
                if (!courseRepository.existsById(id)) {
                        throw new ResourceNotFoundException("Course not found: " + id);
                }
                courseRepository.deleteById(id);
        }

        @Transactional
        public TopicSummaryDto createTopic(Long courseId, CreateTopicRequest request) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Course not found with id: " + courseId));

                Topic topic = Topic.builder()
                                .course(course)
                                .title(request.getTitle())
                                .description(request.getDescription())
                                .orderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0)
                                .prerequisites(request.getPrerequisites())
                                .estimatedMinutes(request.getEstimatedMinutes() != null ? request.getEstimatedMinutes()
                                                : 45)
                                .build();

                Topic saved = topicRepository.save(topic);
                return TopicSummaryDto.builder()
                                .id(saved.getId())
                                .title(saved.getTitle())
                                .description(saved.getDescription())
                                .orderIndex(saved.getOrderIndex())
                                .prerequisites(saved.getPrerequisites())
                                .estimatedMinutes(saved.getEstimatedMinutes())
                                .materialsCount(0)
                                .build();
        }

        @Transactional
        public LearningMaterialDto addMaterial(Long topicId, CreateMaterialRequest request) {
                Topic topic = topicRepository.findById(topicId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Topic not found with id: " + topicId));

                LearningMaterial material = LearningMaterial.builder()
                                .topic(topic)
                                .title(request.getTitle())
                                .materialType(request.getMaterialType())
                                .content(request.getContent())
                                .fileUrl(request.getFileUrl())
                                .build();

                LearningMaterial saved = materialRepository.save(material);
                return LearningMaterialDto.builder()
                                .id(saved.getId())
                                .topicId(topicId)
                                .title(saved.getTitle())
                                .materialType(saved.getMaterialType())
                                .content(saved.getContent())
                                .fileUrl(saved.getFileUrl())
                                .createdAt(saved.getCreatedAt())
                                .build();
        }

        private CourseResponse mapToSummaryDto(Course c) {
                List<TopicSummaryDto> topicDtos = c.getTopics() != null
                                ? c.getTopics().stream()
                                                .map(t -> TopicSummaryDto.builder()
                                                                .id(t.getId())
                                                                .title(t.getTitle())
                                                                .description(t.getDescription())
                                                                .orderIndex(t.getOrderIndex())
                                                                .prerequisites(t.getPrerequisites())
                                                                .estimatedMinutes(t.getEstimatedMinutes())
                                                                .materialsCount(t.getMaterials() != null
                                                                                ? t.getMaterials().size()
                                                                                : 0)
                                                                .build())
                                                .collect(Collectors.toList())
                                : List.of();

                return CourseResponse.builder()
                                .id(c.getId())
                                .title(c.getTitle())
                                .description(c.getDescription())
                                .category(c.getCategory())
                                .difficulty(c.getDifficulty())
                                .published(c.isPublished())
                                .topicsCount(topicDtos.size())
                                .topics(topicDtos)
                                .createdAt(c.getCreatedAt())
                                .build();
        }
}
