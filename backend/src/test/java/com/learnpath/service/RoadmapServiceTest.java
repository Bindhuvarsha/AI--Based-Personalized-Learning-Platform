package com.learnpath.service;

import com.learnpath.dto.RoadmapDtos.RoadmapResponse;
import com.learnpath.model.entity.*;
import com.learnpath.model.enums.KnowledgeLevel;
import com.learnpath.model.enums.ProgressStatus;
import com.learnpath.repository.CourseRepository;
import com.learnpath.repository.ProgressRepository;
import com.learnpath.repository.TopicRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoadmapServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private TopicRepository topicRepository;

    @Mock
    private ProgressRepository progressRepository;

    @InjectMocks
    private RoadmapService roadmapService;

    private User sampleUser;
    private Course sampleCourse;
    private Topic topic1;
    private Topic topic2;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder().id(1L).email("student@example.com").build();
        sampleCourse = Course.builder().id(10L).title("Full Stack Web").build();

        topic1 = Topic.builder().id(101L).course(sampleCourse).title("Topic 1").orderIndex(1).prerequisites("").build();
        topic2 = Topic.builder().id(102L).course(sampleCourse).title("Topic 2").orderIndex(2).prerequisites("101").build();
    }

    @Test
    void testRoadmapPrerequisitesUnlocking() {
        // When topic1 is completed, topic2 should be unlocked
        Progress p1 = Progress.builder()
                .user(sampleUser)
                .topic(topic1)
                .status(ProgressStatus.COMPLETED)
                .knowledgeLevel(KnowledgeLevel.PROFICIENT)
                .masteryScore(80.0)
                .build();

        when(courseRepository.findById(10L)).thenReturn(Optional.of(sampleCourse));
        when(topicRepository.findByCourseIdOrderByOrderIndexAsc(10L)).thenReturn(List.of(topic1, topic2));
        when(progressRepository.findByUserId(1L)).thenReturn(List.of(p1));

        RoadmapResponse response = roadmapService.getPersonalizedRoadmap(10L, sampleUser);

        assertNotNull(response);
        assertEquals(2, response.getTotalTopics());
        assertEquals(1, response.getCompletedTopics());
        assertEquals(50.0, response.getProgressPercentage());

        assertTrue(response.getNodes().get(0).isUnlocked());
        assertTrue(response.getNodes().get(1).isUnlocked());
        assertTrue(response.getNodes().get(1).isRecommendedNext());
    }
}
