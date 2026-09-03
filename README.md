# LearnPath AI — AI-Based Personalized Learning Platform

[![Production Quality Full-Stack Monorepo](https://img.shields.io/badge/Architecture-Monorepo-blue.svg)](#)
[![Spring Boot 3](https://img.shields.io/badge/Backend-Spring%20Boot%203.2-brightgreen.svg)](#)
[![FastAPI](https://img.shields.io/badge/AI%20Microservice-FastAPI%200.110-teal.svg)](#)
[![React Vite](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20Tailwind-cyan.svg)](#)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2016-blue.svg)](#)

LearnPath AI is a production-grade personalized learning ecosystem that combines **adaptive skill assessments**, **prerequisite-based knowledge graph roadmaps**, a **multilingual RAG AI study tutor**, and **scikit-learn recommendation models** (Random Forest & KMeans).

---

## 🏛️ System Architecture

```mermaid
graph TD
    User([Learner / Admin]) <--> Frontend[React 18 + Vite + Tailwind SPA\nPort 3000 / 80]
    Frontend <--> Backend[Spring Boot 3 Java 21 Backend\nPort 8080]
    Backend <--> Postgres[(PostgreSQL 16\nPort 5432)]
    Backend <--> AIService[FastAPI AI/ML Service\nPort 8000]
    AIService <--> VectorStore[(Vector Store / In-Memory / Chroma)]
    AIService <--> MLModels[Scikit-Learn\nRandomForest & KMeans]
```

### Monorepo Structure

- **`frontend/`**: Modern React 18 SPA built with Vite, TypeScript, Tailwind CSS, React Router v6, Axios, Lucide Icons, and Recharts.
- **`backend/`**: Enterprise-grade Spring Boot 3 & Java 21 microservice using Spring Data JPA, Spring Security, JWT authentication, and database auto-seeding.
- **`ai-service/`**: Python 3.11 FastAPI microservice implementing PyMuPDF document ingestion, text chunking, semantic vector search, deterministic mock & OpenAI LLM providers, and scikit-learn recommendation engines.
- **`docker-compose.yml`**: Multi-container production deployment orchestration.

---

## 🔑 Quick Demo Credentials (Pre-Seeded)

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Student** | `student@example.com` | `Student@123` | Roadmaps, Diagnostic Assessments, Adaptive Quizzes, RAG AI Tutor, Analytics, Study Planner |
| **Admin** | `admin@example.com` | `Admin@123` | Curriculum Management, Course Creation & Publishing, Topic & Question Management |

---

## 🚀 Getting Started

### Option 1: One-Command Docker Compose (Recommended)

1. Clone or navigate to the project directory:
   ```bash
   cd "AI--Based-Personalized-Learning-Platform"
   ```

2. Copy environment template:
   ```bash
   cp .env.example .env
   ```

3. Launch the full stack:
   ```bash
   docker-compose up --build
   ```

4. Access the services:
   - **Web Application**: [http://localhost:3000](http://localhost:3000)
   - **Spring Boot Backend**: [http://localhost:8080](http://localhost:8080)
   - **Swagger API Documentation**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
   - **FastAPI AI Microservice Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **PostgreSQL Database**: `localhost:5432` (`learnpath_db`)

---

### Option 2: Local Development Setup

#### 1. PostgreSQL Database
Ensure PostgreSQL is running on port 5432 with database `learnpath_db`, user `learnpath_user`, password `learnpath_secure_password_2026`.

#### 2. Python AI Microservice (`ai-service/`)
```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 3. Spring Boot Backend (`backend/`)
```bash
cd backend
mvn spring-boot:run
```

#### 4. React Frontend (`frontend/`)
```bash
cd frontend
npm install
npm run dev
```

---

---

## 🌟 Advanced AI Features Suite (15 End-to-End Capabilities)

LearnPath AI includes 15 interconnected, production-ready AI capabilities spanning frontend, backend, AI microservice, and database:

1. **AI Personal Mentor (`/mentor`)**:
   - 24/7 dedicated coach maintaining conversation context and learning telemetry.
   - Socratic guidance, daily study advice, weekly progress reviews, and metric citations.
   - Multilingual interaction in English, Kannada, and Hindi.

2. **Voice AI Tutor (`/voice-tutor`)**:
   - Voice question recording via Web Audio MediaRecorder API.
   - Speech-to-text (STT) transcription and audio response synthesis (TTS).
   - Grounded explanations with cited knowledge-base references.

3. **Multilingual Support (English, Kannada, Hindi)**:
   - Dynamic language switcher in top navigation bar (`Navbar.tsx`).
   - Seamless translations across UI text, mentor prompts, and tutoring responses.

4. **Image-Based Question Solving (`/image-solver`)**:
   - Upload photos or screenshots of math equations, coding problems, or diagrams.
   - OCR text extraction, formula derivations, step-by-step reasoning, and confidence estimation.

5. **Interactive Knowledge Graph (`/knowledge-graph`)**:
   - Directed Acyclic Graph (DAG) concept dependency network.
   - Real-time concept status classification: `MASTERED`, `DEVELOPING`, `WEAK`, `LOCKED`, and `RECOMMENDED`.
   - Cycle prevention validation for concept relations.

6. **Learning Behavior Prediction (`/behavior`)**:
   - Continuous learner snapshot telemetry tracking assessment trends, drop-off risks, and burnout likelihood.
   - Explainable ML struggle prediction with targeted pedagogical interventions.

7. **Adaptive Quizzes (`/quiz/adaptive`)**:
   - Dynamic difficulty calibration (Beginner, Intermediate, Advanced) adjusting after consecutive correct/incorrect answers.
   - Confidence-rated testing with post-quiz topic mastery recalculation.

8. **Assignment Evaluator & Rubrics (`/assignments`)**:
   - Multi-criteria rubric evaluation with strengths, weaknesses, and quoted feedback.
   - Instructor score override and human feedback integration.

9. **AI Coding Tutor & Sandboxed Reviewer (`/coding-tutor`)**:
   - Interactive coding environment for Java and Python exercises.
   - Automated execution against test suites, Big-O time/space complexity analysis, syntax error diagnostics, and code diff suggestions.

10. **Gamification Ecosystem (`/gamification`)**:
    - Idempotent XP transactions, tiered student levels (Novice Explorer to Master Architect), streak tracking, unlockable achievement badges, and global leaderboards.

11. **AI Cohort Study Groups (`/study-groups`)**:
    - Peer discovery filtered by career goal and focus area.
    - Cohort discussion boards, shared study goals, and AI-moderated study recommendations.

12. **Intelligent Spaced-Repetition Study Planner (`/study-planner`)**:
    - Automatic schedule generation matching student availability and target milestones.
    - Interactive session completion toggle and automated catch-up rescheduling for missed days.

13. **Academic Early Warning System (`/early-warning`)**:
    - Real-time detection of score drops, inactivity, and struggling concept nodes.
    - Severity-graded warnings (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) with one-click action plans and notification center.

14. **AI Career Roadmap Generator (`/career-roadmap`)**:
    - Career readiness scoring for target tech roles (Backend Java, Full-Stack, AI Engineer).
    - Step-by-step milestone check-lists and portfolio capstone project recommendations.

15. **Resume Skill-Gap Analyzer (`/resume-analyzer`)**:
    - Upload resumes in PDF, DOCX, or TXT format with automated skill extraction.
    - Target job benchmarking with match percentage, 3-column breakdown (Matched, Partial, Missing), and GDPR-compliant data deletion.

---

## 🔒 Security & Best Practices

- Stateless JWT access tokens (24h) and refresh tokens (7d).
- Passwords salted and hashed with BCrypt.
- Role-based authorization (`ROLE_STUDENT`, `ROLE_ADMIN`).
- Zero secret leak policy: all keys managed through `.env` and environment variables.
- Comprehensive AI audit logging (`AIAuditService`) capturing model version, prompt ID, latency, user ID, and correlation IDs.
- Deterministic local mock AI fallback ensures full offline capability without requiring third-party API keys.

