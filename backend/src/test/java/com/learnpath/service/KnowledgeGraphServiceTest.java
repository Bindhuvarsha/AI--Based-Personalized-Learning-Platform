package com.learnpath.service;

import com.learnpath.dto.KnowledgeGraphDtos.*;
import com.learnpath.model.entity.Concept;
import com.learnpath.model.entity.ConceptRelation;
import com.learnpath.model.entity.LearnerConceptStatus;
import com.learnpath.model.entity.User;
import com.learnpath.model.enums.DifficultyLevel;
import com.learnpath.repository.ConceptRelationRepository;
import com.learnpath.repository.ConceptRepository;
import com.learnpath.repository.LearnerConceptStatusRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KnowledgeGraphServiceTest {

    @Mock
    private ConceptRepository conceptRepository;

    @Mock
    private ConceptRelationRepository conceptRelationRepository;

    @Mock
    private LearnerConceptStatusRepository learnerConceptStatusRepository;

    @InjectMocks
    private KnowledgeGraphService knowledgeGraphService;

    private User testUser;
    private Concept c1;
    private Concept c2;
    private ConceptRelation relation;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).email("student@example.com").build();

        c1 = Concept.builder()
                .id(1L)
                .code("JAVA_CORE")
                .name("Java Fundamentals")
                .category("Programming")
                .difficulty(DifficultyLevel.BEGINNER)
                .estimatedHours(10)
                .incomingRelations(new ArrayList<>())
                .outgoingRelations(new ArrayList<>())
                .build();

        c2 = Concept.builder()
                .id(2L)
                .code("SPRING_BOOT")
                .name("Spring Boot")
                .category("Backend")
                .difficulty(DifficultyLevel.INTERMEDIATE)
                .estimatedHours(20)
                .incomingRelations(new ArrayList<>())
                .outgoingRelations(new ArrayList<>())
                .build();

        relation = ConceptRelation.builder()
                .id(1L)
                .sourceConcept(c1)
                .targetConcept(c2)
                .relationType("PREREQUISITE")
                .build();
    }

    @Test
    void testGetFullGraph_WithUserStatus() {
        when(conceptRepository.findAll()).thenReturn(List.of(c1, c2));
        when(conceptRelationRepository.findAll()).thenReturn(List.of(relation));

        LearnerConceptStatus status1 = LearnerConceptStatus.builder()
                .id(10L)
                .user(testUser)
                .concept(c1)
                .masteryScore(85.0)
                .unlocked(true)
                .build();

        when(learnerConceptStatusRepository.findByUserId(1L)).thenReturn(List.of(status1));

        KnowledgeGraphResponse response = knowledgeGraphService.getFullGraph(testUser);

        assertNotNull(response);
        assertEquals(2, response.getTotalConcepts());
        assertEquals(1, response.getMasteredCount());
        assertEquals(1, response.getEdges().size());

        GraphNodeDto node1 = response.getNodes().stream()
                .filter(n -> n.getCode().equals("JAVA_CORE"))
                .findFirst()
                .orElse(null);
        assertNotNull(node1);
        assertEquals("MASTERED", node1.getStatus());
        assertEquals(85.0, node1.getMasteryScore());
    }

    @Test
    void testGetPrerequisites_Success() {
        when(conceptRepository.findById(2L)).thenReturn(Optional.of(c2));
        when(conceptRelationRepository.findByTargetConceptId(2L)).thenReturn(List.of(relation));
        when(conceptRelationRepository.findBySourceConceptId(2L)).thenReturn(List.of());

        PrerequisiteLookupResponse response = knowledgeGraphService.getPrerequisites(2L);

        assertNotNull(response);
        assertEquals("SPRING_BOOT", response.getConcept().getCode());
        assertEquals(1, response.getPrerequisites().size());
        assertEquals("JAVA_CORE", response.getPrerequisites().get(0).getCode());
        assertTrue(response.getDependents().isEmpty());
    }

    @Test
    void testValidateNoCycles_NoCycle() {
        when(conceptRelationRepository.findAll()).thenReturn(List.of(relation));

        // Adding c2 -> c3 shouldn't create a cycle
        boolean valid = knowledgeGraphService.validateNoCycles(2L, 3L);
        assertTrue(valid);
    }
}
