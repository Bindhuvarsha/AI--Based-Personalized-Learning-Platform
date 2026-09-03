package com.learnpath.config;

import com.learnpath.model.entity.*;
import com.learnpath.model.enums.*;
import com.learnpath.repository.*;
import com.learnpath.repository.CareerRequirementRepository;
import com.learnpath.repository.EvaluationRubricRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final ConceptRepository conceptRepository;
    private final ConceptRelationRepository relationRepository;
    private final CareerPathRepository careerPathRepository;
    private final CareerRequirementRepository requirementRepository;
    private final BadgeRepository badgeRepository;
    private final CodingExerciseRepository codingExerciseRepository;
    private final AssignmentRepository assignmentRepository;
    private final EvaluationRubricRepository rubricRepository;

    @Override
    @Transactional
    public void run(String... args) {
        seedKnowledgeGraph();
        seedCareerPaths();
        seedBadges();
        seedCodingExercises();
        seedAssignments();
        log.info("LearnPath AI advanced seed data initialization completed successfully.");
    }

    private void seedKnowledgeGraph() {
        if (conceptRepository.count() > 0) return;

        Concept c1 = conceptRepository.save(Concept.builder().code("JAVA_CORE").name("Java 21 Fundamentals & OOP").category("Programming").difficulty(DifficultyLevel.BEGINNER).estimatedHours(10).description("Object-oriented programming, classes, polymorphism, interfaces, and memory model.").build());
        Concept c2 = conceptRepository.save(Concept.builder().code("DATA_STRUCTURES").name("Data Structures & Algorithms").category("Computer Science").difficulty(DifficultyLevel.INTERMEDIATE).estimatedHours(20).description("Arrays, Linked Lists, Trees, HashMaps, and Big-O asymptotic analysis.").build());
        Concept c3 = conceptRepository.save(Concept.builder().code("SQL_RELATIONAL").name("Relational Databases & SQL").category("Data").difficulty(DifficultyLevel.BEGINNER).estimatedHours(12).description("DDL, DML, joins, indexing, ACID transactions, and normalization.").build());
        Concept c4 = conceptRepository.save(Concept.builder().code("SPRING_BOOT").name("Spring Boot 3 Web Services").category("Backend").difficulty(DifficultyLevel.INTERMEDIATE).estimatedHours(25).description("Dependency injection, Spring MVC, REST APIs, and JPA Hibernate.").build());
        Concept c5 = conceptRepository.save(Concept.builder().code("SPRING_SECURITY").name("Spring Security 6 & JWT").category("Security").difficulty(DifficultyLevel.ADVANCED).estimatedHours(15).description("Authentication, Authorization, Stateless JWT, OAuth2, and Filter Chains.").build());
        Concept c6 = conceptRepository.save(Concept.builder().code("MICROSERVICES").name("Distributed Microservices Architecture").category("Architecture").difficulty(DifficultyLevel.ADVANCED).estimatedHours(30).description("Service discovery, API Gateway, Docker containers, and event streaming.").build());

        relationRepository.save(ConceptRelation.builder().sourceConcept(c1).targetConcept(c2).relationType("PREREQUISITE").description("Core OOP required before advanced algorithm implementations.").build());
        relationRepository.save(ConceptRelation.builder().sourceConcept(c1).targetConcept(c4).relationType("PREREQUISITE").description("Java fundamentals required to build Spring Boot services.").build());
        relationRepository.save(ConceptRelation.builder().sourceConcept(c3).targetConcept(c4).relationType("PREREQUISITE").description("SQL knowledge required for Spring Data JPA repositories.").build());
        relationRepository.save(ConceptRelation.builder().sourceConcept(c4).targetConcept(c5).relationType("PREREQUISITE").description("Spring Boot foundation required for Spring Security integration.").build());
        relationRepository.save(ConceptRelation.builder().sourceConcept(c4).targetConcept(c6).relationType("PREREQUISITE").description("Single-service Spring Boot required before building distributed microservices.").build());
    }

    private void seedCareerPaths() {
        if (careerPathRepository.count() > 0) return;

        CareerPath backend = careerPathRepository.save(CareerPath.builder()
                .title("Backend Java Engineer")
                .description("Design and scale robust web services, transaction pipelines, and secure cloud microservices.")
                .averageSalaryRange("$95,000 - $145,000")
                .industryDemand("VERY_HIGH")
                .icon("Server")
                .build());

        requirementRepository.save(CareerRequirement.builder().careerPath(backend).requirementName("Java Core & Modern Concurrency").category("SKILL").priorityOrder(1).build());
        requirementRepository.save(CareerRequirement.builder().careerPath(backend).requirementName("Spring Boot 3 & JPA Repositories").category("SKILL").priorityOrder(2).build());
        requirementRepository.save(CareerRequirement.builder().careerPath(backend).requirementName("PostgreSQL Query Optimization & Indexing").category("SKILL").priorityOrder(3).build());
        requirementRepository.save(CareerRequirement.builder().careerPath(backend).requirementName("Docker Containerization").category("SKILL").priorityOrder(4).build());

        CareerPath fullstack = careerPathRepository.save(CareerPath.builder()
                .title("Full-Stack Developer")
                .description("Architect end-to-end applications with React, TypeScript, Tailwind CSS, and Spring Boot REST APIs.")
                .averageSalaryRange("$90,000 - $135,000")
                .industryDemand("VERY_HIGH")
                .icon("Layers")
                .build());

        requirementRepository.save(CareerRequirement.builder().careerPath(fullstack).requirementName("React 18 & TypeScript").category("SKILL").priorityOrder(1).build());
        requirementRepository.save(CareerRequirement.builder().careerPath(fullstack).requirementName("RESTful API Integration").category("SKILL").priorityOrder(2).build());

        CareerPath aiEngineer = careerPathRepository.save(CareerPath.builder()
                .title("AI & Machine Learning Engineer")
                .description("Build predictive ML pipelines, RAG systems, and generative AI interfaces with Python and FastAPI.")
                .averageSalaryRange("$110,000 - $165,000")
                .industryDemand("HIGH")
                .icon("Brain")
                .build());

        requirementRepository.save(CareerRequirement.builder().careerPath(aiEngineer).requirementName("Python & Scikit-learn").category("SKILL").priorityOrder(1).build());
        requirementRepository.save(CareerRequirement.builder().careerPath(aiEngineer).requirementName("RAG & Vector Embeddings").category("SKILL").priorityOrder(2).build());
    }

    private void seedBadges() {
        if (badgeRepository.count() > 0) return;

        badgeRepository.save(Badge.builder().code("FIRST_QUIZ").name("First Step").description("Completed your very first adaptive quiz.").iconName("CheckCircle2").badgeType(BadgeType.ACHIEVEMENT).xpBonus(50).build());
        badgeRepository.save(Badge.builder().code("STREAK_7").name("Dedicated Scholar").description("Maintained an unbroken 7-day study streak.").iconName("Flame").badgeType(BadgeType.STREAK).xpBonus(200).build());
        badgeRepository.save(Badge.builder().code("KNOWLEDGE_SEEKER").name("Graph Master").description("Mastered 5 interrelated concept nodes on the knowledge graph.").iconName("GitBranch").badgeType(BadgeType.MASTERY).xpBonus(300).build());
        badgeRepository.save(Badge.builder().code("CODE_WARRIOR").name("Code Crafter").description("Solved your first AI coding challenge with 100% test pass rate.").iconName("Terminal").badgeType(BadgeType.ACHIEVEMENT).xpBonus(150).build());
    }

    private void seedCodingExercises() {
        if (codingExerciseRepository.count() > 0) return;

        codingExerciseRepository.save(CodingExercise.builder()
                .title("Two Sum — Array Target Complement")
                .description("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.")
                .language(ProgrammingLanguage.JAVA)
                .difficulty(DifficultyLevel.BEGINNER)
                .starterCode("import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your implementation here\n        return new int[]{};\n    }\n}")
                .solutionCode("import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) {\n                return new int[]{map.get(comp), i};\n            }\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}")
                .testCasesJson("[{\"input\":\"[2,7,11,15], 9\", \"expectedOutput\":\"[0,1]\"}, {\"input\":\"[3,2,4], 6\", \"expectedOutput\":\"[1,2]\"}]")
                .build());

        codingExerciseRepository.save(CodingExercise.builder()
                .title("Valid Palindrome (Alphanumeric)")
                .description("A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.")
                .language(ProgrammingLanguage.PYTHON)
                .difficulty(DifficultyLevel.BEGINNER)
                .starterCode("def is_palindrome(s: str) -> bool:\n    # Write code here\n    pass")
                .solutionCode("def is_palindrome(s: str) -> bool:\n    cleaned = [c.lower() for c in s if c.isalnum()]\n    return cleaned == cleaned[::-1]")
                .testCasesJson("[{\"input\":\"'A man, a plan, a canal: Panama'\", \"expectedOutput\":\"True\"}, {\"input\":\"'race a car'\", \"expectedOutput\":\"False\"}]")
                .build());
    }

    private void seedAssignments() {
        if (assignmentRepository.count() > 0) return;

        Assignment a1 = assignmentRepository.save(Assignment.builder()
                .title("Architecture Review: Resilient E-Commerce Order API")
                .description("Submit a technical design document addressing transactional consistency, idempotency, and error handling in a distributed order placement system.")
                .instructions("Discuss database locking strategies (optimistic vs pessimistic), REST status codes, and recovery mechanisms for downstream payment failures.")
                .maxScore(100)
                .dueDate(LocalDateTime.now().plusDays(14))
                .build());

        rubricRepository.save(EvaluationRubric.builder().assignment(a1).criterionName("Architectural Decomposition").maxPoints(40).description("Proper division between services, controllers, and domain layers.").build());
        rubricRepository.save(EvaluationRubric.builder().assignment(a1).criterionName("Transactional Integrity & Concurrency").maxPoints(35).description("Clear strategy for preventing race conditions and double-spending.").build());
        rubricRepository.save(EvaluationRubric.builder().assignment(a1).criterionName("Error Handling & Observability").maxPoints(25).description("Meaningful HTTP error codes and idempotency token implementation.").build());
    }
}
