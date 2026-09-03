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

// 1. Knowledge Graph
export interface GraphNode {
  id: number;
  code: string;
  name: string;
  category: string;
  difficulty: string;
  masteryScore: number;
  status: 'MASTERED' | 'DEVELOPING' | 'WEAK' | 'LOCKED' | 'RECOMMENDED';
  estimatedHours: number;
  courseId?: number;
}

export interface GraphEdge {
  id: number;
  source: string;
  target: string;
  relationType: string;
}

export interface KnowledgeGraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
  totalConcepts: number;
  masteredCount: number;
  weakCount: number;
  developingCount: number;
}

// 2. AI Personal Mentor
export interface MentorProfile {
  persona: string;
  learningGoal: string;
  targetCareer: string;
  weeklyStudyTargetHours: number;
  tone: string;
}

export interface MentorRecommendationItem {
  id: number;
  title: string;
  reason: string;
  actionType: string;
  actionPayload?: string;
  priority: number;
  isActioned: boolean;
}

export interface MentorChatResponse {
  reply: string;
  language: string;
  evidenceCited: string[];
  recommendations: MentorRecommendationItem[];
  timestamp: string;
}

export interface DailyAdviceResponse {
  date: string;
  greeting: string;
  dailyGoal: string;
  rationale: string;
  priorityTopics: string[];
  motivationalQuote: string;
  streakDays: number;
  recommendations: MentorRecommendationItem[];
}

export interface WeeklyReviewResponse {
  totalStudyHours: number;
  conceptsMastered: number;
  quizAverage: number;
  velocityAssessment: string;
  areasToReview: string[];
  nextWeekFocus: string[];
}

// 3. Voice AI Tutor
export interface VoiceProcessResponse {
  sessionId: number;
  userTranscript: string;
  aiResponseText: string;
  audioUrl: string;
  durationSeconds: number;
  language: string;
  sources: string[];
}

export interface VoiceMessageItem {
  id: number;
  speaker: 'user' | 'ai';
  transcript: string;
  audioUrl?: string;
  durationSeconds: number;
  language: string;
  createdAt: string;
}

export interface VoiceSessionDetails {
  sessionId: number;
  sessionTitle: string;
  startedAt: string;
  messages: VoiceMessageItem[];
}

// 4. Image Question Solver
export interface ImageSolveResponse {
  questionId: number;
  originalFilename: string;
  imageUrl: string;
  extractedText: string;
  ocrConfidence: number;
  stepByStepExplanation: string;
  finalAnswer: string;
  formulaDerivations: string[];
  relatedTopics: string[];
  solutionConfidence: number;
  disclaimer: string;
}

export interface ImageHistoryItem {
  id: number;
  originalFilename: string;
  imageUrl: string;
  extractedSnippet: string;
  finalAnswerSnippet: string;
  uploadedAt: string;
}

// 5. Behavior Prediction
export interface BehaviorPredictionResponse {
  riskCategory: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  struggleProbability: number;
  contributingFactors: string[];
  recommendedIntervention: string;
  modelVersion: string;
  disclaimer: string;
  avgQuizScore: number;
  scoreTrendSlope: number;
  inactivityDays: number;
  completionRate: number;
  predictedAt: string;
}

// 6. Adaptive Quiz
export interface AdaptiveSessionStart {
  sessionId: number;
  topicId: number;
  topicTitle: string;
  currentDifficulty: string;
  firstQuestion: Question;
  questionNumber: number;
  totalPlannedQuestions: number;
}

export interface AdaptiveSubmitResponse {
  isCorrect: boolean;
  explanation: string;
  previousDifficulty: string;
  currentDifficulty: string;
  difficultyChanged: boolean;
  changeReason: string;
  nextQuestion?: Question;
  isQuizCompleted: boolean;
  currentScore: number;
  totalAnswered: number;
  currentMasteryScore: number;
}

// 7. Assignments
export interface RubricItem {
  id: number;
  criterionName: string;
  maxPoints: number;
  description: string;
}

export interface AssignmentSummary {
  id: number;
  courseId?: number;
  title: string;
  description: string;
  maxScore: number;
  dueDate?: string;
  rubrics: RubricItem[];
  submissionStatus: string;
  earnedScore?: number;
}

export interface EvaluationResultData {
  submissionId: number;
  overallScore: number;
  maxScore: number;
  percentage: number;
  strengths: string[];
  weaknesses: string[];
  missingConcepts: string[];
  quotedEvidence: string[];
  improvementSuggestions: string;
  isOverriddenByTeacher: boolean;
  teacherOverriddenScore?: number;
  teacherComments?: string;
  evaluatedAt: string;
}

// 8. Coding Tutor
export interface CodingExerciseItem {
  id: number;
  title: string;
  description: string;
  language: string;
  difficulty: string;
  starterCode: string;
  testCasesJson: string;
}

export interface CodeRunResult {
  submissionId: number;
  executionStatus: string;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  memoryKb: number;
  syntaxErrors: string[];
  codeSmells: string[];
  securityConcerns: string[];
  timeComplexity: string;
  spaceComplexity: string;
  suggestions: string;
  correctedCodeDiff: string;
  allTestsPassed: boolean;
}

// 9. Gamification
export interface BadgeData {
  code: string;
  name: string;
  description: string;
  iconName: string;
  badgeType: string;
  xpBonus: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface XPTransactionItem {
  id: number;
  xpAmount: number;
  reason: string;
  awardedAt: string;
}

export interface GamificationProfile {
  currentLevel: number;
  currentXp: number;
  nextLevelXpRequired: number;
  title: string;
  levelProgressPercent: number;
  currentStreakDays: number;
  longestStreakDays: number;
  badges: BadgeData[];
  recentTransactions: XPTransactionItem[];
}

export interface LeaderboardUserEntry {
  rank: number;
  userId: number;
  studentName: string;
  level: number;
  totalXp: number;
  isCurrentUser: boolean;
}

export interface LeaderboardData {
  period: string;
  entries: LeaderboardUserEntry[];
  currentUserRank: number;
}

// 10. Study Groups
export interface StudyGroupItem {
  id: number;
  name: string;
  description: string;
  topicFocus: string;
  targetCareer: string;
  language: string;
  memberCount: number;
  maxMembers: number;
  isJoined: boolean;
  isOwner: boolean;
}

export interface GroupChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  isCurrentUser: boolean;
  sentAt: string;
}

// 11. Study Planner
export interface StudySessionItem {
  id: number;
  title: string;
  sessionDate: string;
  startTime?: string;
  durationMinutes: number;
  sessionType: string;
  isCompleted: boolean;
  explanationScheduled?: string;
}

export interface WeeklyScheduleData {
  weekStartDate: string;
  weekEndDate: string;
  totalPlannedMinutes: number;
  completedMinutes: number;
  sessions: StudySessionItem[];
}

// 12. Early Warning
export interface EarlyWarningAlert {
  id: number;
  warningType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  evidenceText: string;
  recommendedAction: string;
  isDismissed: boolean;
  createdAt: string;
}

export interface InAppNotification {
  id: number;
  title: string;
  message: string;
  notificationType: string;
  isRead: boolean;
  createdAt: string;
}

// 13. Career Roadmap
export interface CareerPathItem {
  id: number;
  title: string;
  description: string;
  averageSalaryRange: string;
  industryDemand: string;
  icon: string;
}

export interface CareerRoadmapCheckItem {
  id: number;
  title: string;
  category: string;
  orderIndex: number;
  isCompleted: boolean;
  conceptCode?: string;
}

export interface PortfolioProjectItem {
  id: number;
  title: string;
  description: string;
  skillsCovered: string;
  starterRepoUrl?: string;
  difficulty: string;
}

export interface CareerRoadmapDetails {
  roadmapId: number;
  careerTitle: string;
  careerDescription: string;
  readinessScore: number;
  estimatedWeeks: number;
  items: CareerRoadmapCheckItem[];
  portfolioProjects: PortfolioProjectItem[];
}

// 14. Resume Skill Gap
export interface ExtractedSkillItem {
  id: number;
  skillName: string;
  category: string;
  evidenceText: string;
  isVerified: boolean;
}

export interface ResumeUploadData {
  documentId: number;
  filename: string;
  extractedSkillsCount: number;
  previewText: string;
  extractedSkills: ExtractedSkillItem[];
}

export interface SkillGapItem {
  skill: string;
  status: 'MATCHED' | 'PARTIAL' | 'MISSING';
  evidenceOrAction: string;
}

export interface ResumeRecItem {
  title: string;
  category: string;
  recommendationText: string;
}

export interface SkillGapAnalysisData {
  analysisId: number;
  jobTitle: string;
  matchPercentage: number;
  matchedSkills: SkillGapItem[];
  partialSkills: SkillGapItem[];
  missingSkills: SkillGapItem[];
  recommendations: ResumeRecItem[];
}
