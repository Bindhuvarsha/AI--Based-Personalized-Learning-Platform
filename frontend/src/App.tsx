import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/DashboardLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { QuizPage } from './pages/QuizPage';
import { QuizHistoryPage } from './pages/QuizHistoryPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { StudyPlanPage } from './pages/StudyPlanPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { TutorPage } from './pages/TutorPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Advanced 15 Features Pages
import { MentorPage } from './pages/MentorPage';
import { VoiceTutorPage } from './pages/VoiceTutorPage';
import { ImageSolverPage } from './pages/ImageSolverPage';
import { KnowledgeGraphPage } from './pages/KnowledgeGraphPage';
import { BehaviorPredictionPage } from './pages/BehaviorPredictionPage';
import { AdaptiveQuizPage } from './pages/AdaptiveQuizPage';
import { AssignmentPage } from './pages/AssignmentPage';
import { CodingTutorPage } from './pages/CodingTutorPage';
import { GamificationPage } from './pages/GamificationPage';
import { StudyGroupsPage } from './pages/StudyGroupsPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { EarlyWarningPage } from './pages/EarlyWarningPage';
import { CareerRoadmapPage } from './pages/CareerRoadmapPage';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Student Setup */}
              <Route element={<ProtectedRoute />}>
                <Route path="/onboarding" element={<OnboardingPage />} />
              </Route>

              {/* Protected Authenticated App Layout */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/courses/:id" element={<CourseDetailPage />} />
                  <Route path="/quiz/history" element={<QuizHistoryPage />} />
                  <Route path="/quiz/:topicId" element={<QuizPage />} />
                  <Route path="/assessment" element={<AssessmentPage />} />
                  <Route path="/roadmap" element={<RoadmapPage />} />
                  <Route path="/recommendations" element={<RecommendationsPage />} />
                  <Route path="/study-plan" element={<StudyPlanPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/tutor" element={<TutorPage />} />
                  <Route path="/profile" element={<ProfilePage />} />

                  {/* 15 Advanced Features Routes */}
                  <Route path="/mentor" element={<MentorPage />} />
                  <Route path="/voice-tutor" element={<VoiceTutorPage />} />
                  <Route path="/image-solver" element={<ImageSolverPage />} />
                  <Route path="/knowledge-graph" element={<KnowledgeGraphPage />} />
                  <Route path="/behavior" element={<BehaviorPredictionPage />} />
                  <Route path="/quiz/adaptive" element={<AdaptiveQuizPage />} />
                  <Route path="/assignments" element={<AssignmentPage />} />
                  <Route path="/coding-tutor" element={<CodingTutorPage />} />
                  <Route path="/gamification" element={<GamificationPage />} />
                  <Route path="/study-groups" element={<StudyGroupsPage />} />
                  <Route path="/study-planner" element={<StudyPlannerPage />} />
                  <Route path="/early-warning" element={<EarlyWarningPage />} />
                  <Route path="/career-roadmap" element={<CareerRoadmapPage />} />
                  <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
                </Route>
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute adminOnly />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};
