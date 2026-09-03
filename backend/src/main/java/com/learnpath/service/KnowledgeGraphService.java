package com.learnpath.service;

import com.learnpath.dto.KnowledgeGraphDtos.*;
import com.learnpath.model.entity.Concept;
import com.learnpath.model.entity.ConceptRelation;
import com.learnpath.model.entity.LearnerConceptStatus;
import com.learnpath.model.entity.User;
import com.learnpath.repository.ConceptRelationRepository;
import com.learnpath.repository.ConceptRepository;
import com.learnpath.repository.LearnerConceptStatusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class KnowledgeGraphService {

    private final ConceptRepository conceptRepository;
    private final ConceptRelationRepository conceptRelationRepository;
    private final LearnerConceptStatusRepository learnerConceptStatusRepository;

    @Transactional(readOnly = true)
    public KnowledgeGraphResponse getFullGraph(User user) {
        List<Concept> allConcepts = conceptRepository.findAll();
        List<ConceptRelation> allRelations = conceptRelationRepository.findAll();

        Map<Long, LearnerConceptStatus> statusMap = new HashMap<>();
        if (user != null) {
            learnerConceptStatusRepository.findByUserId(user.getId())
                    .forEach(s -> statusMap.put(s.getConcept().getId(), s));
        }

        int mastered = 0;
        int weak = 0;
        int developing = 0;

        List<GraphNodeDto> nodes = new ArrayList<>();
        for (Concept c : allConcepts) {
            LearnerConceptStatus status = statusMap.get(c.getId());
            double mastery = status != null ? status.getMasteryScore() : 0.0;
            String nodeStatus = "LOCKED";

            if (status != null && status.getUnlocked()) {
                if (mastery >= 80.0) {
                    nodeStatus = "MASTERED";
                    mastered++;
                } else if (mastery >= 50.0) {
                    nodeStatus = "DEVELOPING";
                    developing++;
                } else if (mastery > 0.0) {
                    nodeStatus = "WEAK";
                    weak++;
                } else {
                    nodeStatus = "RECOMMENDED";
                }
            } else if (statusMap.isEmpty() || c.getIncomingRelations().isEmpty()) {
                nodeStatus = "RECOMMENDED";
            }

            nodes.add(GraphNodeDto.builder()
                    .id(c.getId())
                    .code(c.getCode())
                    .name(c.getName())
                    .category(c.getCategory())
                    .difficulty(c.getDifficulty().name())
                    .masteryScore(mastery)
                    .status(nodeStatus)
                    .estimatedHours(c.getEstimatedHours())
                    .courseId(c.getCourse() != null ? c.getCourse().getId() : null)
                    .build());
        }

        List<GraphEdgeDto> edges = allRelations.stream()
                .map(r -> GraphEdgeDto.builder()
                        .id(r.getId())
                        .source(r.getSourceConcept().getCode())
                        .target(r.getTargetConcept().getCode())
                        .relationType(r.getRelationType())
                        .build())
                .collect(Collectors.toList());

        return KnowledgeGraphResponse.builder()
                .nodes(nodes)
                .edges(edges)
                .totalConcepts(nodes.size())
                .masteredCount(mastered)
                .weakCount(weak)
                .developingCount(developing)
                .build();
    }

    @Transactional(readOnly = true)
    public PrerequisiteLookupResponse getPrerequisites(Long conceptId) {
        Concept concept = conceptRepository.findById(conceptId)
                .orElseThrow(() -> new IllegalArgumentException("Concept not found: " + conceptId));

        List<ConceptRelation> incoming = conceptRelationRepository.findByTargetConceptId(conceptId);
        List<GraphNodeDto> prerequisites = incoming.stream()
                .map(r -> toNodeDto(r.getSourceConcept(), 0.0, "PREREQUISITE"))
                .collect(Collectors.toList());

        List<ConceptRelation> outgoing = conceptRelationRepository.findBySourceConceptId(conceptId);
        List<GraphNodeDto> dependents = outgoing.stream()
                .map(r -> toNodeDto(r.getTargetConcept(), 0.0, "DEPENDENT"))
                .collect(Collectors.toList());

        return PrerequisiteLookupResponse.builder()
                .concept(toNodeDto(concept, 0.0, "CURRENT"))
                .prerequisites(prerequisites)
                .dependents(dependents)
                .build();
    }

    public boolean validateNoCycles(Long sourceId, Long targetId) {
        // BFS / DFS to ensure targetId cannot reach sourceId
        Queue<Long> queue = new LinkedList<>();
        Set<Long> visited = new HashSet<>();
        queue.add(targetId);

        while (!queue.isEmpty()) {
            Long current = queue.poll();
            if (current.equals(sourceId)) {
                return false; // Cycle detected!
            }
            if (!visited.add(current)) {
                continue;
            }
            List<ConceptRelation> outgoing = conceptRelationRepository.findBySourceConceptId(current);
            for (ConceptRelation r : outgoing) {
                queue.add(r.getTargetConcept().getId());
            }
        }
        return true;
    }

    private GraphNodeDto toNodeDto(Concept c, double mastery, String status) {
        return GraphNodeDto.builder()
                .id(c.getId())
                .code(c.getCode())
                .name(c.getName())
                .category(c.getCategory())
                .difficulty(c.getDifficulty().name())
                .masteryScore(mastery)
                .status(status)
                .estimatedHours(c.getEstimatedHours())
                .courseId(c.getCourse() != null ? c.getCourse().getId() : null)
                .build();
    }
}
