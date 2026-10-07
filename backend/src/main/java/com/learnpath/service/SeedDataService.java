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

import org.springframework.context.annotation.Profile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Profile("!prod")
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
    private final CertificateRepository certificateRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting LearnPath AI development database seed...");

        // 1. Seed Roles safely
        Role studentRole = roleRepository.findByName(RoleType.ROLE_STUDENT)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ROLE_STUDENT).build()));
        Role teacherRole = roleRepository.findByName(RoleType.ROLE_TEACHER)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ROLE_TEACHER).build()));
        Role adminRole = roleRepository.findByName(RoleType.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ROLE_ADMIN).build()));

        // 2. Seed/Verify Admin User: admin@example.com / Admin@123
        final Role finalAdminRole = adminRole;
        final Role finalStudentRole = studentRole;
        final Role finalTeacherRole = teacherRole;
        User adminUser = userRepository.findByEmail("admin@example.com")
                .map(existing -> {
                    existing.setPassword(passwordEncoder.encode("Admin@123"));
                    existing.setActive(true);
                    existing.getRoles().add(finalAdminRole);
                    existing.getRoles().add(finalTeacherRole);
                    existing.getRoles().add(finalStudentRole);
                    return userRepository.save(existing);
                })
                .orElseGet(() -> userRepository.save(User.builder()
                        .fullName("System Administrator")
                        .email("admin@example.com")
                        .password(passwordEncoder.encode("Admin@123"))
                        .active(true)
                        .roles(new HashSet<>(Set.of(finalAdminRole, finalTeacherRole, finalStudentRole)))
                        .build()));

        // 3. Seed/Verify Teacher User: teacher@example.com / Teacher@123
        User teacherUser = userRepository.findByEmail("teacher@example.com")
                .map(existing -> {
                    existing.setPassword(passwordEncoder.encode("Teacher@123"));
                    existing.setActive(true);
                    existing.getRoles().add(finalTeacherRole);
                    existing.getRoles().add(finalStudentRole);
                    return userRepository.save(existing);
                })
                .orElseGet(() -> userRepository.save(User.builder()
                        .fullName("Prof. Marcus Vance (Faculty Instructor)")
                        .email("teacher@example.com")
                        .password(passwordEncoder.encode("Teacher@123"))
                        .active(true)
                        .roles(new HashSet<>(Set.of(finalTeacherRole, finalStudentRole)))
                        .build()));

        // 4. Seed/Verify Student User: student@example.com / Student@123
        User studentUser = userRepository.findByEmail("student@example.com")
                .map(existing -> {
                    existing.setPassword(passwordEncoder.encode("Student@123"));
                    existing.setActive(true);
                    existing.getRoles().add(finalStudentRole);
                    existing.getRoles().add(finalAdminRole);
                    return userRepository.save(existing);
                })
                .orElseGet(() -> userRepository.save(User.builder()
                        .fullName("Alex Chen (Demo Learner)")
                        .email("student@example.com")
                        .password(passwordEncoder.encode("Student@123"))
                        .active(true)
                        .roles(new HashSet<>(Set.of(finalStudentRole, finalAdminRole)))
                        .build()));
        User savedStudent = studentUser;

        // 4. Seed/Verify Student Profile
        if (profileRepository.findByUserId(savedStudent.getId()).isEmpty()) {
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
        }

        // Skip remaining course/topic seeding if already populated, but ensure question library is complete
        if (courseRepository.count() > 0) {
            log.info("Courses and curriculum data already seeded. Verifying question bank completeness...");
            ensureQuestionsAreSeeded();
            log.info("Seed data ready.");
            log.info("Demo accounts verified:");
            log.info("  Admin:   ID={}, email=admin@example.com   / Admin@123   (Development only)", adminUser.getId());
            log.info("  Teacher: ID={}, email=teacher@example.com / Teacher@123 (Development only)", teacherUser.getId());
            log.info("  Student: ID={}, email=student@example.com / Student@123 (Development only)", studentUser.getId());
            return;
        }

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

        Assessment webAssessment = Assessment.builder()
                .title("Full-Stack Web Engineering Diagnostic Assessment")
                .subject("Web Development")
                .difficulty(DifficultyLevel.INTERMEDIATE)
                .description("Assess your competencies in Spring Boot REST APIs, JWT security architecture, and modern React development.")
                .build();
        webAssessment = assessmentRepository.save(webAssessment);

        seedAllComprehensiveQuestions(pyAssessment, webAssessment, t1, t2, t3, t4, t5, w1, w2, w3);

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

        // 12. Seed Verified Academic Certificate
        if (certificateRepository.count() == 0) {
            certificateRepository.save(Certificate.builder()
                    .certificateId("LP-CERT-2026-JAVA9921")
                    .user(savedStudent)
                    .recipientName(savedStudent.getFullName() != null ? savedStudent.getFullName() : "Alex Chen")
                    .courseTitle("Java 21 & Spring Boot 3 Enterprise Architecture")
                    .score(94.5)
                    .grade("Distinction (High Honors)")
                    .skillsAcquired("Java 21, Spring Boot 3, REST APIs, Microservices, PostgreSQL, JWT Security")
                    .verificationHash("7b8f9e0a1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f")
                    .issueDate(LocalDateTime.now().minusDays(3))
                    .status("VERIFIED")
                    .build());
            log.info("Seeded initial verifiable certificate: LP-CERT-2026-JAVA9921");
        }

        log.info("LearnPath AI database seeding completed successfully!");
        log.info("Demo accounts seeded:");
        log.info("  Admin:   admin@example.com   / Admin@123   (Development only)");
        log.info("  Student: student@example.com / Student@123 (Development only)");
    }

    private void ensureQuestionsAreSeeded() {
        List<Topic> topics = topicRepository.findAll();
        if (topics.isEmpty()) {
            return;
        }

        Topic t1 = topics.stream().filter(t -> t.getTitle().toLowerCase().contains("python core")).findFirst().orElse(null);
        Topic t2 = topics.stream().filter(t -> t.getTitle().toLowerCase().contains("numpy")).findFirst().orElse(null);
        Topic t3 = topics.stream().filter(t -> t.getTitle().toLowerCase().contains("pandas")).findFirst().orElse(null);
        Topic t4 = topics.stream().filter(t -> t.getTitle().toLowerCase().contains("scikit")).findFirst().orElse(null);
        Topic t5 = topics.stream().filter(t -> t.getTitle().toLowerCase().contains("neural networks")).findFirst().orElse(null);

        Topic w1 = topics.stream().filter(t -> t.getTitle().toLowerCase().contains("restful")).findFirst().orElse(null);
        Topic w2 = topics.stream().filter(t -> t.getTitle().toLowerCase().contains("jwt")).findFirst().orElse(null);
        Topic w3 = topics.stream().filter(t -> t.getTitle().toLowerCase().contains("react")).findFirst().orElse(null);

        Assessment pyAssessment = assessmentRepository.findBySubjectIgnoreCase("Artificial Intelligence").stream().findFirst().orElse(null);
        Assessment webAssessment = assessmentRepository.findBySubjectIgnoreCase("Web Development").stream().findFirst().orElse(null);

        if (webAssessment == null) {
            webAssessment = assessmentRepository.save(Assessment.builder()
                    .title("Full-Stack Web Engineering Diagnostic Assessment")
                    .subject("Web Development")
                    .difficulty(DifficultyLevel.INTERMEDIATE)
                    .description("Assess your competencies in Spring Boot REST APIs, JWT security architecture, and modern React development.")
                    .build());
        }

        seedAllComprehensiveQuestions(pyAssessment, webAssessment, t1, t2, t3, t4, t5, w1, w2, w3);
    }

    private void seedAllComprehensiveQuestions(
            Assessment pyAssessment, Assessment webAssessment,
            Topic t1, Topic t2, Topic t3, Topic t4, Topic t5,
            Topic w1, Topic w2, Topic w3) {

        Set<String> existing = questionRepository.findAll().stream()
                .map(q -> q.getQuestionText().trim().toLowerCase())
                .collect(Collectors.toSet());

        // ==========================================
        // Topic 1: Python Core Syntax & Data Structures
        // ==========================================
        if (t1 != null) {
            addQ(existing, t1, pyAssessment,
                    "What is the average time complexity of looking up a key in a standard Python dictionary?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of("O(1)", "O(n)", "O(log n)", "O(n^2)"),
                    0,
                    "Python dictionaries are implemented using hash tables, offering O(1) average time complexity for key lookups.",
                    DifficultyLevel.BEGINNER, 1);

            addQ(existing, t1, null,
                    "In Python, strings and tuples are immutable sequences whose contents cannot be altered in-place after instantiation.",
                    QuestionType.TRUE_FALSE,
                    List.of("True", "False"),
                    0,
                    "Strings and tuples are immutable in Python. Any modification operation produces a newly allocated object rather than mutating in place.",
                    DifficultyLevel.BEGINNER, 1);

            addQ(existing, t1, pyAssessment,
                    "Which of the following creates a generator expression rather than a list in memory?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "[x * 2 for x in range(10)]",
                            "(x * 2 for x in range(10))",
                            "{x: x * 2 for x in range(10)}",
                            "{x * 2 for x in range(10)}"
                    ),
                    1,
                    "Parentheses with a comprehension syntax define a generator expression, yielding items lazily without constructing the entire collection in memory.",
                    DifficultyLevel.INTERMEDIATE, 2);

            addQ(existing, t1, null,
                    "What is the result of list(filter(None, [0, 1, False, 2, '', 3, []])) in Python?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of("[1, 2, 3]", "[0, 1, 2, 3]", "[False, '']", "[0, False, '', []]"),
                    0,
                    "When the function argument to filter() is None, the identity truth evaluation is assumed, discarding all falsy elements (0, False, '', []) and retaining [1, 2, 3].",
                    DifficultyLevel.INTERMEDIATE, 2);

            addQ(existing, t1, pyAssessment,
                    "How does Python's GIL (Global Interpreter Lock) impact CPU-bound multi-threaded programs in CPython?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "It prevents multiple native OS threads from executing Python bytecodes simultaneously in parallel",
                            "It automatically converts multi-threaded programs to asynchronous event loops",
                            "It provides automatic hardware-level SIMD vectorization across all CPU cores",
                            "It disables garbage collection during thread execution"
                    ),
                    0,
                    "CPython's GIL ensures only one thread executes Python bytecode at any given moment, bottlenecking CPU-bound multi-threaded performance and requiring multiprocessing for true CPU parallelism.",
                    DifficultyLevel.ADVANCED, 3);

            addQ(existing, t1, null,
                    "In Python's collections module, what is the asymptotic time complexity of appending or popping elements from either end of a deque?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of("O(1)", "O(n)", "O(log n)", "O(n log n)"),
                    0,
                    "A deque (double-ended queue) is implemented as a doubly-linked list of fixed-size blocks, providing O(1) time complexity for appending and popping from both ends.",
                    DifficultyLevel.ADVANCED, 3);
        }

        // ==========================================
        // Topic 2: NumPy & Vectorized Computing
        // ==========================================
        if (t2 != null) {
            addQ(existing, t2, pyAssessment,
                    "True or False: Vectorized operations in NumPy are executed in optimized C loops, avoiding Python interpreter overhead.",
                    QuestionType.TRUE_FALSE,
                    List.of("True", "False"),
                    0,
                    "NumPy arrays store homogeneous continuous memory buffers executed via compiled C and BLAS/LAPACK routines.",
                    DifficultyLevel.BEGINNER, 1);

            addQ(existing, t2, null,
                    "Which NumPy function creates an array of 5 evenly spaced values between 0.0 and 1.0 inclusive?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of("np.linspace(0, 1, 5)", "np.arange(0, 1, 5)", "np.step(0, 1, 5)", "np.interval(0, 1, 5)"),
                    0,
                    "np.linspace(start, stop, num) generates num evenly spaced samples over the specified closed interval [start, stop].",
                    DifficultyLevel.BEGINNER, 1);

            addQ(existing, t2, pyAssessment,
                    "When adding array A with shape (3, 1) and array B with shape (1, 4), what is the resulting array shape according to NumPy broadcasting rules?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of("(3, 4)", "(3, 1)", "(1, 4)", "ValueError (Incompatible shapes)"),
                    0,
                    "Both dimensions with length 1 are stretched along the matching axis, resulting in a broadcasted shape of (3, 4).",
                    DifficultyLevel.INTERMEDIATE, 2);

            addQ(existing, t2, null,
                    "What operation does np.dot(A, B) perform when both A and B are 2-dimensional arrays?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of("Matrix multiplication", "Element-wise multiplication", "Outer product", "Kronecker sum"),
                    0,
                    "For 2D arrays, np.dot is equivalent to matrix multiplication, matching the behavior of the @ operator.",
                    DifficultyLevel.INTERMEDIATE, 2);

            addQ(existing, t2, null,
                    "What is the primary behavioral and memory distinction between a NumPy array view and a copy?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "A view shares the underlying data buffer with the original array, so modifying it alters the original",
                            "A view allocates separate heap memory while a copy lives in cache memory",
                            "A copy is read-only whereas a view permits mutating operations",
                            "There is no functional or memory difference between them"
                    ),
                    0,
                    "Basic slicing in NumPy returns a view which references the original buffer without copying data. Modifying elements in a view mutates the original array.",
                    DifficultyLevel.ADVANCED, 3);
        }

        // ==========================================
        // Topic 3: Data Manipulation with Pandas
        // ==========================================
        if (t3 != null) {
            addQ(existing, t3, pyAssessment,
                    "Which Pandas method is used to inspect the first N rows of a DataFrame?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of("df.head(N)", "df.first(N)", "df.top(N)", "df.peek(N)"),
                    0,
                    "df.head(n) returns the first n rows of the DataFrame, defaulting to 5 rows if n is not specified.",
                    DifficultyLevel.BEGINNER, 1);

            addQ(existing, t3, null,
                    "In Pandas, df.dropna() permanently modifies the original DataFrame by default without specifying inplace=True.",
                    QuestionType.TRUE_FALSE,
                    List.of("True", "False"),
                    1,
                    "By default, df.dropna() returns a new DataFrame copy with missing values dropped. The original DataFrame remains unchanged unless inplace=True is passed.",
                    DifficultyLevel.BEGINNER, 1);

            addQ(existing, t3, pyAssessment,
                    "What is the fundamental difference between .loc[] and .iloc[] indexers in Pandas?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            ".loc is label-based indexing, whereas .iloc is integer zero-indexed position-based",
                            ".loc only accepts numeric values, while .iloc accepts string names",
                            ".iloc is deprecated in Pandas 2.0 in favor of .loc",
                            ".loc creates a copy, while .iloc always creates a view"
                    ),
                    0,
                    ".loc selects rows and columns using index labels or boolean arrays, while .iloc selects strictly by integer position (0 to length-1).",
                    DifficultyLevel.INTERMEDIATE, 2);

            addQ(existing, t3, null,
                    "Which Pandas method generates summary statistics (count, mean, std, min, percentiles, max) for numeric columns?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of("df.describe()", "df.summary()", "df.info()", "df.stats()"),
                    0,
                    "df.describe() computes descriptive statistics that summarize the central tendency, dispersion, and shape of a dataset's distribution.",
                    DifficultyLevel.INTERMEDIATE, 2);

            addQ(existing, t3, null,
                    "When performing pd.merge() on two DataFrames with duplicate key values on both sides, what join result is produced by default?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "A Cartesian product of the matching rows (many-to-many relationship)",
                            "Only the first matching record is preserved, and subsequent duplicates are discarded",
                            "Pandas throws a MergeConflictException",
                            "All duplicated keys are replaced with NaN entries"
                    ),
                    0,
                    "By default, pd.merge performs an inner join producing a Cartesian product of all rows matching the key, expanding the output row count accordingly.",
                    DifficultyLevel.ADVANCED, 3);
        }

        // ==========================================
        // Topic 4: Supervised Machine Learning with Scikit-Learn
        // ==========================================
        if (t4 != null) {
            addQ(existing, t4, null,
                    "Why should data preprocessing (e.g., StandardScaler) be fitted exclusively on training data rather than the full dataset?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "To avoid data leakage from the test distribution into the training pipeline",
                            "Because test datasets cannot contain floating-point numerical values",
                            "To reduce CPU memory allocation by 50%",
                            "Scikit-learn raises a fit validation error if fitted on testing records"
                    ),
                    0,
                    "Fitting scalers or transformers on the full dataset leaks information from the test set into training, resulting in overly optimistic validation scores.",
                    DifficultyLevel.BEGINNER, 1);

            addQ(existing, t4, pyAssessment,
                    "In classification models, what does the F1-score represent?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "Arithmetic average of precision and recall",
                            "Harmonic mean of precision and recall",
                            "Area under the ROC curve",
                            "Percentage of true negative predictions"
                    ),
                    1,
                    "The F1 score is the harmonic mean of precision and recall: 2 * (Precision * Recall) / (Precision + Recall).",
                    DifficultyLevel.INTERMEDIATE, 2);

            addQ(existing, t4, pyAssessment,
                    "What technique is primarily used to mitigate overfitting in decision tree classifiers?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "Increasing max_depth infinitely",
                            "Pruning and limiting max_depth or min_samples_leaf",
                            "Removing feature scaling",
                            "Using zero training data"
                    ),
                    1,
                    "Tree regularization techniques like cost-complexity pruning, limiting max_depth, and setting min_samples_leaf restrict tree complexity and prevent overfitting.",
                    DifficultyLevel.INTERMEDIATE, 2);

            addQ(existing, t4, null,
                    "What is the primary purpose of K-Fold Cross-Validation in machine learning?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "To evaluate model generalizability across K distinct validation folds and decrease metric variance",
                            "To compress feature space into K principal components",
                            "To group unlabeled training records into K distinct clusters",
                            "To eliminate all bias from the model training process"
                    ),
                    0,
                    "K-Fold cross-validation splits data into K subsets, iteratively training on K-1 folds and validating on the remaining fold to reliably evaluate generalization.",
                    DifficultyLevel.INTERMEDIATE, 2);

            addQ(existing, t4, null,
                    "In Ridge Regression (L2) versus Lasso Regression (L1), what distinctive mathematical property does Lasso regularization provide?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "It performs automated feature selection by driving coefficients of uninformative features exactly to zero",
                            "It minimizes numerical matrix inversion errors during gradient optimization",
                            "It strictly works with non-linear radial basis kernel functions",
                            "It guarantees zero residual sum of squares error"
                    ),
                    0,
                    "L1 regularization penalizes the absolute value of coefficients. Because the L1 diamond constraint has corners on coordinate axes, solutions often intersect at zero, zeroing out non-essential weights.",
                    DifficultyLevel.ADVANCED, 3);
        }

        // ==========================================
        // Topic 5: Neural Networks & Deep Learning Intro
        // ==========================================
        if (t5 != null) {
            addQ(existing, t5, pyAssessment,
                    "What is the primary role of non-linear activation functions (such as ReLU or Sigmoid) in deep neural networks?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "To introduce non-linearity, enabling the network to approximate complex non-linear decision boundaries",
                            "To initialize all layer weights to zero",
                            "To accelerate GPU CUDA kernel memory transfers",
                            "To convert continuous float values into integer tokens"
                    ),
                    0,
                    "Without non-linear activation functions, any composition of stacked linear layers collapses mathematically into a single linear transformation (W2 * W1 * x = W' * x).",
                    DifficultyLevel.BEGINNER, 1);

            addQ(existing, t5, null,
                    "The Rectified Linear Unit (ReLU) activation function outputs x when x > 0, and 0 when x <= 0.",
                    QuestionType.TRUE_FALSE,
                    List.of("True", "False"),
                    0,
                    "ReLU is defined as f(x) = max(0, x), which avoids saturating positive gradients and is computationally very lightweight.",
                    DifficultyLevel.BEGINNER, 1);

            addQ(existing, t5, pyAssessment,
                    "Which algorithm calculates partial derivatives of the loss function with respect to all network weights using the chain rule of calculus?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of("Backpropagation", "Forward pass inference", "Monte Carlo sampling", "Principal Component Analysis"),
                    0,
                    "Backpropagation propagates errors backward from the loss through each layer via the chain rule to obtain gradients for optimization.",
                    DifficultyLevel.INTERMEDIATE, 2);

            addQ(existing, t5, null,
                    "What is the consequence of the Vanishing Gradient Problem during training of deep neural networks?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "Gradients diminish exponentially as they backpropagate, causing early layers to train extremely slowly or stall",
                            "Model weights grow to positive infinity causing numerical overflow",
                            "The loss function becomes negative and breaks convex convergence",
                            "The training dataset is exhausted prematurely"
                    ),
                    0,
                    "When using activations with derivatives less than 1 (e.g. sigmoid), multiplying them through many layers causes gradients to vanish exponentially before reaching early layers.",
                    DifficultyLevel.INTERMEDIATE, 2);

            addQ(existing, t5, null,
                    "What is the primary mechanism distinguishing the Adam optimizer from standard Stochastic Gradient Descent (SGD)?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "It computes adaptive per-parameter learning rates using exponential moving averages of both first and second gradient moments",
                            "It guarantees locating the global minimum in non-convex optimization problems",
                            "It completely removes the requirement to compute backpropagation gradients",
                            "It replaces weight matrices with random projection hashes"
                    ),
                    0,
                    "Adam (Adaptive Moment Estimation) stores exponential moving averages of past gradients (momentum) and squared gradients (scaling), adapting learning rates individually for each parameter.",
                    DifficultyLevel.ADVANCED, 3);
        }

        // ==========================================
        // Topic 6: RESTful API Design & Spring Boot 3
        // ==========================================
        if (w1 != null) {
            addQ(existing, w1, webAssessment,
                    "According to RESTful conventions, which HTTP method is idempotent and intended to completely replace an existing resource?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of("PUT", "POST", "PATCH", "DELETE"),
                    0,
                    "PUT is designed to be idempotent: invoking it multiple times with the same body replaces the target resource and results in the same state.",
                    DifficultyLevel.BEGINNER, 1);

            addQ(existing, w1, null,
                    "In Spring Boot, @RestController is a composite annotation combining @Controller and @ResponseBody.",
                    QuestionType.TRUE_FALSE,
                    List.of("True", "False"),
                    0,
                    "@RestController simplifies writing RESTful web services by automatically serializing return values into the HTTP response body as JSON or XML.",
                    DifficultyLevel.BEGINNER, 1);

            addQ(existing, w1, webAssessment,
                    "Which HTTP status code should a REST API return when a requested resource identifier does not exist on the server?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of("404 Not Found", "400 Bad Request", "401 Unauthorized", "500 Internal Server Error"),
                    0,
                    "404 Not Found is the standard HTTP status indicating the origin server cannot find a current representation for the requested resource URI.",
                    DifficultyLevel.INTERMEDIATE, 2);

            addQ(existing, w1, null,
                    "In Spring Boot 3 controller methods, which annotation extracts dynamic path values from a URI template like /api/courses/{courseId}/topics?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of("@PathVariable", "@RequestParam", "@RequestBody", "@RequestHeader"),
                    0,
                    "@PathVariable binds a URI template path variable to a method parameter in Spring MVC controllers.",
                    DifficultyLevel.INTERMEDIATE, 2);

            addQ(existing, w1, webAssessment,
                    "What architectural role does @RestControllerAdvice fulfill in enterprise Spring Boot applications?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "Centralizes cross-cutting exception handling and standardized error response formatting across all controllers",
                            "Configures HikariCP database connection pooling properties",
                            "Manages asynchronous thread pools for parallel WebSocket connections",
                            "Automatically exposes Swagger OpenAPI JSON schemas without annotations"
                    ),
                    0,
                    "@RestControllerAdvice intercepts exceptions thrown across all REST controllers, formatting consistent structured error envelopes (status, message, timestamp).",
                    DifficultyLevel.ADVANCED, 3);
        }

        // ==========================================
        // Topic 7: JWT Authentication & Security Filters
        // ==========================================
        if (w2 != null) {
            addQ(existing, w2, webAssessment,
                    "What are the three dot-separated components that constitute a standard JSON Web Token (JWT)?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of("Header, Payload, Signature", "Header, Body, Footer", "Prefix, Token, Checksum", "Issuer, Subject, Expiration"),
                    0,
                    "A standard JWT consists of three Base64URL encoded parts joined with dots: Header (algorithm metadata), Payload (claims/data), and Signature (cryptographic hash).",
                    DifficultyLevel.BEGINNER, 1);

            addQ(existing, w2, null,
                    "By default, the payload of a signed JSON Web Token (JWS) is encrypted and confidential from anyone intercepting the token.",
                    QuestionType.TRUE_FALSE,
                    List.of("True", "False"),
                    1,
                    "The payload in a standard signed JWT is Base64URL-encoded, not encrypted. The signature ensures data tampering cannot occur undetected, but claims can be decoded and read by anyone with access to the token.",
                    DifficultyLevel.BEGINNER, 1);

            addQ(existing, w2, webAssessment,
                    "In Spring Security 6's filter chain, where is a custom JwtAuthenticationFilter typically placed relative to UsernamePasswordAuthenticationFilter?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "Before UsernamePasswordAuthenticationFilter",
                            "After AnonymousAuthenticationFilter",
                            "After ExceptionTranslationFilter",
                            "At the very end of the SecurityFilterChain"
                    ),
                    0,
                    "Placing the JWT filter before UsernamePasswordAuthenticationFilter parses the Bearer token early and populates the SecurityContextHolder before downstream filters execute.",
                    DifficultyLevel.INTERMEDIATE, 2);

            addQ(existing, w2, null,
                    "In HTTP requests, what authentication scheme keyword precedes the bearer token in the Authorization header?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of("Bearer", "Basic", "Token", "ApiKey"),
                    0,
                    "RFC 6750 specifies the syntax 'Authorization: Bearer <token>' for transmitting OAuth 2.0 and JWT credentials.",
                    DifficultyLevel.INTERMEDIATE, 2);

            addQ(existing, w2, webAssessment,
                    "Why should access tokens maintain short lifespans while refresh tokens employ single-use rotation strategies?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "Short access tokens minimize vulnerability windows if intercepted, while rotation detects token reuse and prevents replay attacks",
                            "Refresh tokens are required to decrypt TLS transport layer packets",
                            "Stateless access tokens cannot store user authorities or email claims",
                            "Single-use rotation is intended solely to conserve database connection pool capacity"
                    ),
                    0,
                    "Short-lived access tokens limit the window an attacker can exploit a stolen token. Single-use refresh token rotation invalidates the entire token family if an already-consumed refresh token is replayed, exposing theft.",
                    DifficultyLevel.ADVANCED, 3);
        }

        // ==========================================
        // Topic 8: React 18 State Management & Hooks
        // ==========================================
        if (w3 != null) {
            addQ(existing, w3, webAssessment,
                    "Which React hook is used to declare state variables inside functional components?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of("useState", "useEffect", "useMemo", "useContext"),
                    0,
                    "useState is the primary React hook for persisting component-local state across renders.",
                    DifficultyLevel.BEGINNER, 1);

            addQ(existing, w3, null,
                    "In React, you can safely invoke hooks conditionally inside if-statements or nested loops as long as the component is mounted.",
                    QuestionType.TRUE_FALSE,
                    List.of("True", "False"),
                    1,
                    "The Rules of Hooks mandate that hooks must only be called at the top level. Conditional calls break React's internal call-order tracking between renders.",
                    DifficultyLevel.BEGINNER, 1);

            addQ(existing, w3, webAssessment,
                    "What behavior occurs when passing an empty dependency array [] as the second argument to useEffect?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "The effect executes exactly once after the initial component mount",
                            "The effect runs after every single render and re-render",
                            "The effect never executes under any circumstance",
                            "React throws a compile-time syntax error"
                    ),
                    0,
                    "An empty dependency array indicates no dependencies can trigger re-execution, causing the effect to run solely after the initial DOM mount.",
                    DifficultyLevel.INTERMEDIATE, 2);

            addQ(existing, w3, null,
                    "What is the primary use case for React's useMemo hook?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "To memoize and avoid re-calculating expensive computed values across renders when dependencies remain unchanged",
                            "To mutate persistent DOM node references directly without triggering renders",
                            "To execute side-effect HTTP network requests",
                            "To replace Redux for global asynchronous thunk dispatching"
                    ),
                    0,
                    "useMemo caches the result of an expensive calculation, recalculating only when one of its specified dependencies changes.",
                    DifficultyLevel.INTERMEDIATE, 2);

            addQ(existing, w3, webAssessment,
                    "How does React 18's Automatic Batching improve rendering performance?",
                    QuestionType.MULTIPLE_CHOICE,
                    List.of(
                            "It groups multiple state updates (including those within promises, setTimeout, and event handlers) into a single re-render pass",
                            "It compiles JSX components into multi-threaded Web Workers",
                            "It compresses HTTP response JSON payloads automatically on the client side",
                            "It renders child components only after user scroll intersection occurs"
                    ),
                    0,
                    "Prior to React 18, batching only occurred within native React event handlers. React 18 automatically batches state updates across async fetch callbacks, timeouts, and promises into a single unified render.",
                    DifficultyLevel.ADVANCED, 3);
        }

        log.info("Comprehensive question bank seeding complete. Total questions in database: {}", questionRepository.count());
    }

    private void addQ(
            Set<String> existing,
            Topic topic,
            Assessment assessment,
            String questionText,
            QuestionType questionType,
            List<String> options,
            int correctOptionIndex,
            String explanation,
            DifficultyLevel difficulty,
            int points) {
        if (topic == null || existing.contains(questionText.trim().toLowerCase())) {
            return;
        }
        try {
            questionRepository.save(Question.builder()
                    .topic(topic)
                    .assessment(assessment)
                    .questionText(questionText)
                    .questionType(questionType)
                    .options(objectMapper.writeValueAsString(options))
                    .correctOptionIndex(correctOptionIndex)
                    .explanation(explanation)
                    .difficulty(difficulty)
                    .points(points)
                    .build());
            existing.add(questionText.trim().toLowerCase());
        } catch (Exception e) {
            log.error("Failed to seed question: {}", questionText, e);
        }
    }
}
