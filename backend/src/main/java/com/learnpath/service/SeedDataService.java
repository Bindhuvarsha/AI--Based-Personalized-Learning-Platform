package com.learnpath.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.learnpath.model.entity.*;
import com.learnpath.model.enums.*;
import com.learnpath.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SeedDataService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StudentProfileRepository profileRepository;
    private final CourseRepository courseRepository;
    private final TopicRepository topicRepository;
    private final LearningMaterialRepository materialRepository;
    private final AssessmentRepository assessmentRepository;
    private final QuestionRepository questionRepository;
    private final ProgressRepository progressRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final RecommendationRepository recommendationRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() > 0 && userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initial seeding.");
            return;
        }

        log.info("Starting LearnPath AI initial database seed...");

        // 1. Seed Roles
        Role studentRole = roleRepository.save(Role.builder().name(RoleType.ROLE_STUDENT).build());
        Role adminRole = roleRepository.save(Role.builder().name(RoleType.ROLE_ADMIN).build());

        // 2. Seed Admin User: admin@example.com / Admin@123
        User adminUser = User.builder()
                .fullName("System Administrator")
                .email("admin@example.com")
                .password(passwordEncoder.encode("Admin@123"))
                .active(true)
                .roles(Set.of(adminRole, studentRole))
                .build();
        userRepository.save(adminUser);

        // 3. Seed Student User: student@example.com / Student@123
        User studentUser = User.builder()
                .fullName("Alex Chen (Demo Learner)")
                .email("student@example.com")
                .password(passwordEncoder.encode("Student@123"))
                .active(true)
                .roles(Set.of(studentRole))
                .build();
        User savedStudent = userRepository.save(studentUser);

        // 4. Seed Student Profile
        StudentProfile profile = StudentProfile.builder()
                .user(savedStudent)
                .educationLevel("Undergraduate Computer Science")
                .subjectsOfInterest("Python, Artificial Intelligence, Web Development, Algorithms")
                .currentSkills("Python Basics, Git, HTML/CSS")
                .learningGoals("Master Deep Learning architectures, full-stack deployment, and system design")
                .preferredDifficulty(DifficultyLevel.INTERMEDIATE)
                .preferredLanguage(LanguagePreference.ENGLISH)
                .weeklyStudyTargetMinutes(360)
                .currentStreakDays(5)
                .lastActiveDate(LocalDateTime.now())
                .build();
        profileRepository.save(profile);

        // 5. Seed Course 1: Python & AI Foundations
        Course pyCourse = Course.builder()
                .title("Python & AI Engineering Foundations")
                .description("From object-oriented Python, NumPy vectorization to machine learning algorithms and neural networks.")
                .category("Artificial Intelligence")
                .difficulty(DifficultyLevel.BEGINNER)
                .published(true)
                .createdBy(adminUser)
                .build();
        pyCourse = courseRepository.save(pyCourse);

        Topic t1 = topicRepository.save(Topic.builder()
                .course(pyCourse)
                .title("Python Core Syntax & Data Structures")
                .description("Master lists, dicts, list comprehensions, generators, and memory references.")
                .orderIndex(1)
                .estimatedMinutes(45)
                .build());

        Topic t2 = topicRepository.save(Topic.builder()
                .course(pyCourse)
                .title("NumPy & Vectorized Computing")
                .description("Array manipulation, broadcasting rules, matrix multiplication, and linear algebra fundamentals.")
                .orderIndex(2)
                .prerequisites(t1.getId().toString())
                .estimatedMinutes(60)
                .build());

        Topic t3 = topicRepository.save(Topic.builder()
                .course(pyCourse)
                .title("Data Manipulation with Pandas")
                .description("DataFrames, series operations, missing value strategies, filtering, and aggregation.")
                .orderIndex(3)
                .prerequisites(t2.getId().toString())
                .estimatedMinutes(60)
                .build());

        Topic t4 = topicRepository.save(Topic.builder()
                .course(pyCourse)
                .title("Supervised Machine Learning with Scikit-Learn")
                .description("Linear regression, decision trees, random forests, cross-validation, and ROC-AUC evaluation.")
                .orderIndex(4)
                .prerequisites(t2.getId() + "," + t3.getId())
                .estimatedMinutes(90)
                .build());

        Topic t5 = topicRepository.save(Topic.builder()
                .course(pyCourse)
                .title("Neural Networks & Deep Learning Intro")
                .description("Perceptrons, backpropagation, activation functions, loss gradients, and PyTorch basics.")
                .orderIndex(5)
                .prerequisites(t4.getId().toString())
                .estimatedMinutes(120)
                .build());

        // 6. Seed Learning Materials for Topics
        materialRepository.save(LearningMaterial.builder()
                .topic(t1)
                .title("Python Data Structures Cheat Sheet")
                .materialType(MaterialType.NOTE)
                .content("# Python Core Memory & Complexity\n\n- Lists: Dynamic array O(1) amortized append.\n- Dictionaries: Hash table average O(1) lookup.\n- Sets: Hash-based unique sets.\n- Tuples: Immutable sequences.\n\n```python\n# Generator expression for memory efficiency\nsquares = (x**2 for x in range(1_000_000))\n```")
                .build());

        materialRepository.save(LearningMaterial.builder()
                .topic(t2)
                .title("Broadcasting Rules & Vectorization Guide")
                .materialType(MaterialType.DOCUMENT)
                .content("# NumPy Broadcasting\n\nTwo dimensions are compatible when they are equal, or one of them is 1.\n\n```python\nimport numpy as np\na = np.array([[1], [2], [3]]) # (3, 1)\nb = np.array([4, 5])          # (2,)\n# Resulting broadcasted shape: (3, 2)\n```")
                .build());

        materialRepository.save(LearningMaterial.builder()
                .topic(t4)
                .title("Machine Learning Evaluation Metrics")
                .materialType(MaterialType.ARTICLE)
                .content("# Precision, Recall, and F1-Score\n\n- **Precision**: True Positives / (True Positives + False Positives)\n- **Recall**: True Positives / (True Positives + False Negatives)\n- **F1**: Harmonic mean of Precision and Recall.")
                .build());

        // 7. Seed Course 2: Full-Stack Web Architecture
        Course webCourse = Course.builder()
                .title("Modern Full-Stack Architecture with React & Spring Boot")
                .description("Build enterprise-grade microservices, REST APIs, and responsive React frontend applications.")
                .category("Web Development")
                .difficulty(DifficultyLevel.INTERMEDIATE)
                .published(true)
                .createdBy(adminUser)
                .build();
        webCourse = courseRepository.save(webCourse);

        Topic w1 = topicRepository.save(Topic.builder()
                .course(webCourse)
                .title("RESTful API Design & Spring Boot 3")
                .description("Controller annotations, DTO mappings, service patterns, and OpenAPI documentation.")
                .orderIndex(1)
                .estimatedMinutes(50)
                .build());

        Topic w2 = topicRepository.save(Topic.builder()
                .course(webCourse)
                .title("JWT Authentication & Security Filters")
                .description("Stateless session management, refresh token rotation, and Spring Security 6 filter chains.")
                .orderIndex(2)
                .prerequisites(w1.getId().toString())
                .estimatedMinutes(75)
                .build());

        Topic w3 = topicRepository.save(Topic.builder()
                .course(webCourse)
                .title("React 18 State Management & Hooks")
                .description("Custom hooks, Context API, optimistic updates, and performance memoization.")
                .orderIndex(3)
                .estimatedMinutes(60)
                .build());

        // 8. Seed Skill Assessments & Questions
        Assessment pyAssessment = Assessment.builder()
                .title("AI & Python Diagnostic Assessment")
                .subject("Artificial Intelligence")
                .difficulty(DifficultyLevel.INTERMEDIATE)
                .description("Evaluate your baseline knowledge across Python data structures, NumPy arrays, and machine learning principles.")
                .build();
        pyAssessment = assessmentRepository.save(pyAssessment);

        createAssessmentQuestions(pyAssessment, t1, t2, t3, t4);

        // 9. Seed Initial Progress for Demo Student
        // Topic 1: Completed & Proficient
        progressRepository.save(Progress.builder()
                .user(savedStudent)
                .topic(t1)
                .status(ProgressStatus.COMPLETED)
                .knowledgeLevel(KnowledgeLevel.ADVANCED)
                .masteryScore(92.0)
                .attemptsCount(3)
                .totalTimeSpentMinutes(95)
                .lastAttemptAt(LocalDateTime.now().minusDays(2))
                .build());

        // Topic 2: In Progress & Developing
        progressRepository.save(Progress.builder()
                .user(savedStudent)
                .topic(t2)
                .status(ProgressStatus.IN_PROGRESS)
                .knowledgeLevel(KnowledgeLevel.DEVELOPING)
                .masteryScore(65.0)
                .attemptsCount(2)
                .totalTimeSpentMinutes(50)
                .lastAttemptAt(LocalDateTime.now().minusDays(1))
                .build());

        // Topic 4: Weak (knowledge gap)
        progressRepository.save(Progress.builder()
                .user(savedStudent)
                .topic(t4)
                .status(ProgressStatus.IN_PROGRESS)
                .knowledgeLevel(KnowledgeLevel.WEAK)
                .masteryScore(42.0)
                .attemptsCount(1)
                .totalTimeSpentMinutes(30)
                .lastAttemptAt(LocalDateTime.now().minusHours(5))
                .build());

        // 10. Seed Quiz Attempt
        quizAttemptRepository.save(QuizAttempt.builder()
                .user(savedStudent)
                .topic(t1)
                .score(4)
                .totalQuestions(4)
                .percentage(100.0)
                .passed(true)
                .timeSpentSeconds(120)
                .completedAt(LocalDateTime.now().minusDays(2))
                .build());

        quizAttemptRepository.save(QuizAttempt.builder()
                .user(savedStudent)
                .topic(t2)
                .score(3)
                .totalQuestions(4)
                .percentage(75.0)
                .passed(true)
                .timeSpentSeconds(160)
                .completedAt(LocalDateTime.now().minusDays(1))
                .build());

        // 11. Seed Initial Recommendations
        recommendationRepository.save(Recommendation.builder()
                .user(savedStudent)
                .recommendationType(RecommendationType.RESOURCE)
                .targetId(t4.getId())
                .title("Mastery Alert: Review Machine Learning Foundations")
                .reason("Your mastery on Supervised ML is at 42%. Reviewing cross-validation and bias-variance tradeoff will unlock advanced neural networks.")
                .priorityScore(0.95)
                .createdAt(LocalDateTime.now())
                .build());

        recommendationRepository.save(Recommendation.builder()
                .user(savedStudent)
                .recommendationType(RecommendationType.QUIZ)
                .targetId(t2.getId())
                .title("Level-Up Challenge: NumPy Broadcasting")
                .reason("Score 80%+ on your next quiz to reach Proficient level on vectorized computing.")
                .priorityScore(0.85)
                .createdAt(LocalDateTime.now())
                .build());

        log.info("LearnPath AI database seeding completed successfully!");
        log.info("Demo accounts seeded:");
        log.info("  Admin:   admin@example.com   / Admin@123   (Development only)");
        log.info("  Student: student@example.com / Student@123 (Development only)");
    }

    private void createAssessmentQuestions(Assessment assessment, Topic t1, Topic t2, Topic t3, Topic t4) {
        try {
            // Question 1 (t1 - Core Python)
            questionRepository.save(Question.builder()
                    .assessment(assessment)
                    .topic(t1)
                    .questionText("What is the average time complexity of looking up a key in a standard Python dictionary?")
                    .questionType(QuestionType.MULTIPLE_CHOICE)
                    .options(objectMapper.writeValueAsString(List.of("O(1)", "O(n)", "O(log n)", "O(n^2)")))
                    .correctOptionIndex(0)
                    .explanation("Python dictionaries are implemented using hash tables, offering O(1) average time complexity for key lookups.")
                    .difficulty(DifficultyLevel.BEGINNER)
                    .points(1)
                    .build());

            // Question 2 (t1 - Core Python)
            questionRepository.save(Question.builder()
                    .assessment(assessment)
                    .topic(t1)
                    .questionText("Which of the following creates a generator expression rather than a list in memory?")
                    .questionType(QuestionType.MULTIPLE_CHOICE)
                    .options(objectMapper.writeValueAsString(List.of(
                            "[x * 2 for x in range(10)]",
                            "(x * 2 for x in range(10))",
                            "{x: x * 2 for x in range(10)}",
                            "{x * 2 for x in range(10)}"
                    )))
                    .correctOptionIndex(1)
                    .explanation("Parentheses with a comprehension syntax define a generator expression, yielding items lazily without constructing the entire collection in memory.")
                    .difficulty(DifficultyLevel.INTERMEDIATE)
                    .points(1)
                    .build());

            // Question 3 (t2 - NumPy)
            questionRepository.save(Question.builder()
                    .assessment(assessment)
                    .topic(t2)
                    .questionText("When adding array A with shape (3, 1) and array B with shape (1, 4), what is the resulting array shape according to NumPy broadcasting rules?")
                    .questionType(QuestionType.MULTIPLE_CHOICE)
                    .options(objectMapper.writeValueAsString(List.of(
                            "(3, 4)",
                            "(3, 1)",
                            "(1, 4)",
                            "ValueError (Incompatible shapes)"
                    )))
                    .correctOptionIndex(0)
                    .explanation("Both dimensions with length 1 are stretched along the matching axis, resulting in a shape of (3, 4).")
                    .difficulty(DifficultyLevel.INTERMEDIATE)
                    .points(1)
                    .build());

            // Question 4 (t2 - NumPy)
            questionRepository.save(Question.builder()
                    .assessment(assessment)
                    .topic(t2)
                    .questionText("True or False: Vectorized operations in NumPy are executed in optimized C loops, avoiding Python interpreter overhead.")
                    .questionType(QuestionType.TRUE_FALSE)
                    .options(objectMapper.writeValueAsString(List.of("True", "False")))
                    .correctOptionIndex(0)
                    .explanation("NumPy arrays store homogeneous continuous memory buffers executed via compiled C and BLAS/LAPACK routines.")
                    .difficulty(DifficultyLevel.BEGINNER)
                    .points(1)
                    .build());

            // Question 5 (t4 - Scikit-learn)
            questionRepository.save(Question.builder()
                    .assessment(assessment)
                    .topic(t4)
                    .questionText("In classification models, what does the F1-score represent?")
                    .questionType(QuestionType.MULTIPLE_CHOICE)
                    .options(objectMapper.writeValueAsString(List.of(
                            "Arithmetic average of precision and recall",
                            "Harmonic mean of precision and recall",
                            "Area under the ROC curve",
                            "Percentage of true negative predictions"
                    )))
                    .correctOptionIndex(1)
                    .explanation("The F1 score is the harmonic mean of precision and recall: 2 * (Precision * Recall) / (Precision + Recall).")
                    .difficulty(DifficultyLevel.INTERMEDIATE)
                    .points(1)
                    .build());

            // Question 6 (t4 - Scikit-learn)
            questionRepository.save(Question.builder()
                    .assessment(assessment)
                    .topic(t4)
                    .questionText("What technique is primarily used to mitigate overfitting in decision tree classifiers?")
                    .questionType(QuestionType.MULTIPLE_CHOICE)
                    .options(objectMapper.writeValueAsString(List.of(
                            "Increasing max_depth infinitely",
                            "Pruning and limiting max_depth or min_samples_leaf",
                            "Removing feature scaling",
                            "Using zero training data"
                    )))
                    .correctOptionIndex(1)
                    .explanation("Tree regularization techniques like cost-complexity pruning, limiting max_depth, and setting min_samples_leaf restrict tree complexity and prevent overfitting.")
                    .difficulty(DifficultyLevel.INTERMEDIATE)
                    .points(1)
                    .build());

        } catch (Exception e) {
            log.error("Failed to seed assessment questions: {}", e.getMessage());
        }
    }
}
