package com.learnpath.service;

import com.learnpath.dto.CareerRoadmapDtos.*;
import com.learnpath.model.entity.*;
import com.learnpath.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CareerRoadmapService {

    private final CareerPathRepository careerPathRepository;
    private final CareerRoadmapRepository careerRoadmapRepository;
    private final CareerRoadmapItemRepository itemRepository;
    private final PortfolioProjectRepository portfolioProjectRepository;
    private final ConceptRepository conceptRepository;

    @Transactional(readOnly = true)
    public List<CareerPathDto> listCareerPaths() {
        return careerPathRepository.findAll().stream()
                .map(c -> CareerPathDto.builder()
                        .id(c.getId())
                        .title(c.getTitle())
                        .description(c.getDescription())
                        .averageSalaryRange(c.getAverageSalaryRange())
                        .industryDemand(c.getIndustryDemand())
                        .icon(c.getIcon())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public CareerRoadmapResponse getOrGenerateRoadmap(User user, Long careerPathId) {
        CareerPath careerPath = careerPathRepository.findById(careerPathId)
                .orElseGet(() -> careerPathRepository.findAll().stream().findFirst()
                        .orElseGet(() -> careerPathRepository.save(CareerPath.builder()
                                .title("Backend Java & Cloud Engineer")
                                .description("Design, build, and deploy production-grade distributed microservices.")
                                .averageSalaryRange("$95,000 - $145,000")
                                .industryDemand("VERY_HIGH")
                                .icon("Server")
                                .build())));

        CareerRoadmap roadmap = careerRoadmapRepository.findByUserIdAndCareerPathId(user.getId(), careerPath.getId())
                .orElseGet(() -> {
                    CareerRoadmap newRoadmap = CareerRoadmap.builder()
                            .user(user)
                            .careerPath(careerPath)
                            .readinessScore(64.5)
                            .estimatedWeeks(14)
                            .createdAt(LocalDateTime.now())
                            .build();
                    CareerRoadmap saved = careerRoadmapRepository.save(newRoadmap);

                    // Seed milestone checkpoints
                    List<CareerRoadmapItem> items = List.of(
                            CareerRoadmapItem.builder().careerRoadmap(saved).title("Java 21 Core & Modern OOP Patterns").category("CONCEPT").orderIndex(1).isCompleted(true).build(),
                            CareerRoadmapItem.builder().careerRoadmap(saved).title("Relational Schema Design & PostgreSQL Optimization").category("CONCEPT").orderIndex(2).isCompleted(true).build(),
                            CareerRoadmapItem.builder().careerRoadmap(saved).title("Spring Boot 3 RESTful Web Services & JPA").category("CONCEPT").orderIndex(3).isCompleted(true).build(),
                            CareerRoadmapItem.builder().careerRoadmap(saved).title("Spring Security 6 & Stateless JWT Architecture").category("CONCEPT").orderIndex(4).isCompleted(false).build(),
                            CareerRoadmapItem.builder().careerRoadmap(saved).title("Docker Containerization & Multi-Stage Production Builds").category("CONCEPT").orderIndex(5).isCompleted(false).build(),
                            CareerRoadmapItem.builder().careerRoadmap(saved).title("System Design: Distributed Rate Limiter Project").category("PROJECT").orderIndex(6).isCompleted(false).build()
                    );
                    itemRepository.saveAll(items);
                    saved.setItems(items);
                    return saved;
                });

        List<CareerRoadmapItemDto> itemDtos = roadmap.getItems().stream()
                .map(i -> CareerRoadmapItemDto.builder()
                        .id(i.getId())
                        .title(i.getTitle())
                        .category(i.getCategory())
                        .orderIndex(i.getOrderIndex())
                        .isCompleted(i.getIsCompleted())
                        .conceptCode(i.getConcept() != null ? i.getConcept().getCode() : null)
                        .build())
                .collect(Collectors.toList());

        List<PortfolioProjectDto> projectDtos = List.of(
                PortfolioProjectDto.builder()
                        .id(1L)
                        .title("High-Throughput E-Commerce Order Pipeline")
                        .description("Microservices architecture with Spring Cloud, Kafka event streaming, and PostgreSQL optimistic locking.")
                        .skillsCovered("Spring Boot, Kafka, PostgreSQL, Docker, Redis")
                        .starterRepoUrl("https://github.com/learnpath/project-order-pipeline")
                        .difficulty("ADVANCED")
                        .build(),
                PortfolioProjectDto.builder()
                        .id(2L)
                        .title("AI RAG Document Query Service")
                        .description("Retrieval-Augmented Generation API with vector embeddings, ChromaDB, and FastAPI.")
                        .skillsCovered("FastAPI, Python, ChromaDB, Sentence Transformers, Docker")
                        .starterRepoUrl("https://github.com/learnpath/project-ai-rag")
                        .difficulty("INTERMEDIATE")
                        .build()
        );

        return CareerRoadmapResponse.builder()
                .roadmapId(roadmap.getId())
                .careerTitle(careerPath.getTitle())
                .careerDescription(careerPath.getDescription())
                .readinessScore(roadmap.getReadinessScore())
                .estimatedWeeks(roadmap.getEstimatedWeeks())
                .items(itemDtos)
                .portfolioProjects(projectDtos)
                .build();
    }
}
