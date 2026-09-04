import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token (except on login/register)
api.interceptors.request.use(
  (config) => {
    const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register');
    const token = localStorage.getItem('accessToken');
    if (token && config.headers && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: auto-refresh token on 401 (excluding auth endpoints)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/login') ||
                           originalRequest?.url?.includes('/auth/register') ||
                           originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const resp = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const newAccessToken = resp.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const mentorApi = {
  getProfile: () => api.get('/mentor/profile'),
  chat: (message: string, language: string = 'ENGLISH') => api.post('/mentor/chat', { message, language }),
  getDailyAdvice: () => api.get('/mentor/daily-advice'),
  getWeeklyReview: () => api.get('/mentor/weekly-review'),
};

export const voiceApi = {
  createSession: (title?: string) => api.post('/voice/session', null, { params: { title } }),
  processAudio: (sessionId: number, formData: FormData) =>
    api.post('/voice/process', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getSession: (sessionId: number) => api.get(`/voice/session/${sessionId}`),
};

export const visionApi = {
  solveImage: (formData: FormData) =>
    api.post('/vision/solve', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getHistory: () => api.get('/vision/history'),
};

export const graphApi = {
  getGraph: () => api.get('/knowledge-graph'),
  getPrerequisites: (conceptId: number) => api.get(`/knowledge-graph/prerequisites/${conceptId}`),
};

export const behaviorApi = {
  predict: () => api.get('/behavior/predict'),
};

export const adaptiveQuizApi = {
  startSession: (topicId: number) => api.post(`/quiz/adaptive/start/${topicId}`),
  submitAnswer: (data: { sessionId: number; questionId: number; selectedOptionIndex: number; timeSpentSeconds: number; confidenceScore: number }) =>
    api.post('/quiz/adaptive/submit', data),
};

export const assignmentApi = {
  list: () => api.get('/assignments'),
  submit: (id: number, contentText: string, fileUrl?: string) =>
    api.post(`/assignments/${id}/submit`, { contentText, fileUrl }),
  teacherOverride: (submissionId: number, overriddenScore: number, teacherComments: string) =>
    api.put(`/assignments/submissions/${submissionId}/override`, { overriddenScore, teacherComments }),
};

export const codingApi = {
  getExercises: () => api.get('/coding/exercises'),
  runCode: (exerciseId: number | null, sourceCode: string, language: string, customInput?: string) =>
    api.post('/coding/run', { exerciseId, sourceCode, language, customInput }),
};

export const gamificationApi = {
  getProfile: () => api.get('/gamification/profile'),
  getLeaderboard: () => api.get('/gamification/leaderboard'),
  awardXp: (amount: number, reason: string, idempotencyKey?: string) =>
    api.post('/gamification/award-xp', null, { params: { amount, reason, idempotencyKey } }),
};

export const studyGroupApi = {
  list: () => api.get('/study-groups'),
  create: (data: { name: string; description: string; topicFocus: string; targetCareer: string; language: string; maxMembers: number }) =>
    api.post('/study-groups', data),
  join: (id: number) => api.post(`/study-groups/${id}/join`),
  leave: (id: number) => api.post(`/study-groups/${id}/leave`),
  getMessages: (id: number) => api.get(`/study-groups/${id}/messages`),
  postMessage: (id: number, content: string) => api.post(`/study-groups/${id}/messages`, { content }),
};

export const plannerApi = {
  getWeekly: () => api.get('/study-planner/weekly'),
  toggleSession: (id: number) => api.post(`/study-planner/sessions/${id}/toggle`),
  reschedule: (sessionId: number, newDate: string, reason?: string) =>
    api.post('/study-planner/reschedule', { sessionId, newDate, reason }),
};

export const earlyWarningApi = {
  getWarnings: () => api.get('/early-warning'),
  dismiss: (id: number, snoozeDays?: number, actionTaken?: string) =>
    api.post(`/early-warning/${id}/dismiss`, { snoozeDays, actionTaken }),
  getNotifications: () => api.get('/early-warning/notifications'),
};

export const careerApi = {
  listPaths: () => api.get('/career-roadmap/paths'),
  getRoadmap: (pathId: number) => api.get(`/career-roadmap/paths/${pathId}`),
};

export const resumeApi = {
  upload: (formData: FormData) =>
    api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  analyze: (documentId: number, targetRole?: string) =>
    api.post('/resume/analyze', null, { params: { documentId, targetRole } }),
  deleteResume: (id: number) => api.delete(`/resume/${id}`),
};
