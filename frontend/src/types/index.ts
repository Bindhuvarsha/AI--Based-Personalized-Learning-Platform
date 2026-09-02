export type RoleType = 'ROLE_STUDENT' | 'ROLE_ADMIN';
export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type LanguagePreference = 'ENGLISH' | 'HINDI' | 'KANNADA';
export type KnowledgeLevel = 'WEAK' | 'DEVELOPING' | 'PROFICIENT' | 'ADVANCED';
export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
export type RecommendationType = 'TOPIC' | 'QUIZ' | 'RESOURCE';
export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
export type MaterialType = 'DOCUMENT' | 'ARTICLE' | 'VIDEO_LINK' | 'NOTE';

export interface UserSummary {
  id: number;
  email: string;
  fullName: string;
  roles: string[];
  onboardingCompleted: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserSummary;
}

export interface StudentProfile {
  id: number;
  userId: number;
  email: string;
  fullName: string;
  educationLevel: string;
  subjectsOfInterest: string[];
  currentSkills: string[];
  learningGoals: string;
  preferredDifficulty: DifficultyLevel;
  preferredLanguage: LanguagePreference;
  weeklyStudyTargetMinutes: number;
  currentStreakDays: number;
}

export interface TopicSummary {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  prerequisites?: string;
  estimatedMinutes: number;
  materialsCount: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: DifficultyLevel;
  published: boolean;
  topicsCount: number;
  topics: TopicSummary[];
  createdAt: string;
}

export interface LearningMaterial {
  id: number;
  topicId: number;
  title: string;
  materialType: MaterialType;
  content: string;
  fileUrl?: string;
  createdAt: string;
}

export interface TopicDetail {
  id: number;
  courseId: number;
  courseTitle: string;
  title: string;
  description: string;
  orderIndex: number;
  prerequisites?: string;
  estimatedMinutes: number;
  materials: LearningMaterial[];
}

export interface Question {
  id: number;
  topicId?: number;
  topicTitle?: string;
  questionText: string;
  questionType: QuestionType;
  options: string[];
  difficulty: DifficultyLevel;
  points: number;
}

export interface Assessment {
  id: number;
  title: string;
  subject: string;
  difficulty: DifficultyLevel;
  description: string;
  questions: Question[];
}

export interface QuestionReview {
  questionId: number;
  questionText: string;
  options: string[];
  selectedOptionIndex: number;
  correctOptionIndex: number;
  correct: boolean;
  explanation: string;
  topicTitle: string;
}

export interface TopicScoreResult {
  topicId: number;
  topicTitle: string;
  totalQuestions: number;
  correctQuestions: number;
  percentage: number;
  knowledgeLevel: KnowledgeLevel;
  statusRecommendation: string;
}

export interface AssessmentResult {
  attemptId: number;
  assessmentId: number;
  assessmentTitle: string;
  subject: string;
  totalQuestions: number;
  correctAnswers: number;
  overallScore: number;
  passed: boolean;
  topicScores: TopicScoreResult[];
  questionReviews: QuestionReview[];
  completedAt: string;
}

export interface QuizDetails {
  topicId: number;
  topicTitle: string;
  courseTitle: string;
  currentDifficulty: DifficultyLevel;
  questions: Question[];
}

export interface QuizResult {
  attemptId: number;
  topicId: number;
  topicTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  nextDifficulty: string;
  feedbackMessage: string;
  reviews: QuestionReview[];
  completedAt: string;
}

export interface QuizHistoryItem {
  attemptId: number;
  topicId?: number;
  topicTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  completedAt: string;
}

export interface RoadmapNode {
  topicId: number;
  title: string;
  description: string;
  orderIndex: number;
  prerequisiteTopicIds: number[];
  isUnlocked: boolean;
  status: ProgressStatus;
  knowledgeLevel: KnowledgeLevel;
  masteryScore: number;
  estimatedMinutes: number;
  recommendedNext: boolean;
}

export interface RoadmapResponse {
  courseId: number;
  courseTitle: string;
  totalTopics: number;
  completedTopics: number;
  progressPercentage: number;
  nodes: RoadmapNode[];
}

export interface RecommendationItem {
  id: number;
  type: RecommendationType;
  targetId: number;
  title: string;
  reason: string;
  priorityScore: number;
  category: string;
  createdAt: string;
}

export interface StudyPlanItem {
  id: number;
  dayNumber: number;
  scheduledDate: string;
  topicId?: number;
  topicTitle?: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
}

export interface StudyPlan {
  id: number;
  goalTitle: string;
  durationDays: number;
  availableHoursPerWeek: number;
  startingKnowledgeLevel: KnowledgeLevel;
  startDate: string;
  targetDate: string;
  active: boolean;
  totalItems: number;
  completedItems: number;
  completionPercentage: number;
  items: StudyPlanItem[];
  createdAt: string;
}

export interface SourceCitation {
  documentTitle: string;
  pageNumber: number;
  chunkIndex: number;
  excerpt: string;
  similarityScore?: number;
}

export interface TutorChatResponse {
  conversationId: number;
  response: string;
  language: LanguagePreference;
  sources: SourceCitation[];
  timestamp: string;
}

export interface ConversationSummary {
  id: number;
  title: string;
  language: LanguagePreference;
  messageCount: number;
  updatedAt: string;
}

export interface TopicPerformanceItem {
  topicId: number;
  topicTitle: string;
  courseTitle: string;
  masteryScore: number;
  knowledgeLevel: KnowledgeLevel;
  timeSpentMinutes: number;
}

export interface QuizScoreTrendItem {
  attemptId: number;
  topicTitle: string;
  scorePercentage: number;
  dateFormatted: string;
}

export interface WeakTopicItem {
  topicId: number;
  topicTitle: string;
  score: number;
  suggestedAction: string;
}

export interface StrongTopicItem {
  topicId: number;
  topicTitle: string;
  score: number;
}

export interface KnowledgeDistribution {
  weak: number;
  developing: number;
  proficient: number;
  advanced: number;
}

export interface AnalyticsDashboard {
  overallMasteryPercentage: number;
  completedTopicsCount: number;
  totalTopicsCount: number;
  completedCoursesCount: number;
  totalQuizzesTaken: number;
  averageQuizScore: number;
  totalStudyTimeMinutes: number;
  currentStreakDays: number;
  roadmapCompletionPercentage: number;
  topicPerformance: TopicPerformanceItem[];
  quizTrends: QuizScoreTrendItem[];
  weakTopics: WeakTopicItem[];
  strongTopics: StrongTopicItem[];
  knowledgeDistribution: KnowledgeDistribution;
}
