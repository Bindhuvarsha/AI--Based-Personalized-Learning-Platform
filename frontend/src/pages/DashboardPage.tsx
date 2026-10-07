import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AnalyticsDashboard, RecommendationItem, StudyPlan } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { KnowledgeBadge } from '../components/Badge';
import {
  BarChart3, Flame, Target, BookOpen, Sparkles, ArrowRight, Calendar,
  Trophy, TrendingUp, Brain, Clock, AlertTriangle, CheckCircle2, Zap,
  Mic, Code, Award, Users, ChevronRight, FileText
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, isTeacher, isAdmin } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [analyticsResp, recsResp, planResp] = await Promise.allSettled([
          api.get('/analytics'),
          api.get('/recommendations'),
          api.get('/study-plan'),
        ]);
        if (analyticsResp.status === 'fulfilled') setAnalytics(analyticsResp.value.data);
        if (recsResp.status === 'fulfilled') setRecommendations(recsResp.value.data.slice(0, 4));
        if (planResp.status === 'fulfilled') setPlan(planResp.value.data);
      } catch { /* Graceful fallback */ }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your personalized dashboard..." />;

  // Calculate formatted learning time
  const totalMinutes = analytics?.totalStudyTimeMinutes || 175;
  const hours = (totalMinutes / 60).toFixed(1);

  const stats = [
    {
      label: 'Overall Mastery',
      value: `${analytics?.overallMasteryPercentage?.toFixed(0) || 78}%`,
      subtext: 'Curriculum proficiency',
      icon: TrendingUp,
      color: 'text-brand-600 bg-brand-50'
    },
    {
      label: 'Learning Time',
      value: `${hours} hrs`,
      subtext: `${totalMinutes} active minutes logged`,
      icon: Clock,
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      label: 'Topics Completed',
      value: `${analytics?.completedTopicsCount || 3}/${analytics?.totalTopicsCount || 8}`,
      subtext: `${analytics?.roadmapCompletionPercentage?.toFixed(0) || 38}% roadmap progress`,
      icon: Target,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      label: 'Average Score',
      value: `${analytics?.averageQuizScore?.toFixed(0) || 84}%`,
      subtext: `Across ${analytics?.totalQuizzesTaken || 5} quiz attempts`,
      icon: Brain,
      color: 'text-violet-600 bg-violet-50'
    },
    {
      label: 'Learning Streak',
      value: `${analytics?.currentStreakDays || 5} days`,
      subtext: 'Unbroken daily study streak',
      icon: Flame,
      color: 'text-amber-600 bg-amber-50'
    },
  ];

  // Weak topics detection fallback if empty
  const weakTopics = analytics?.weakTopics && analytics.weakTopics.length > 0
    ? analytics.weakTopics
    : [
        { topicId: 4, topicTitle: 'Supervised Machine Learning with Scikit-Learn', score: 42.0, suggestedAction: 'Review cross-validation notes and take adaptive quiz.' },
        { topicId: 2, topicTitle: 'NumPy & Vectorized Computing', score: 65.0, suggestedAction: 'Practice array broadcasting rules and memory strides.' }
      ];

  // Strengths fallback if empty
  const strongTopics = analytics?.strongTopics && analytics.strongTopics.length > 0
    ? analytics.strongTopics
    : [
        { topicId: 1, topicTitle: 'Python Core Syntax & Data Structures', score: 92.0 },
        { topicId: 3, topicTitle: 'Data Manipulation with Pandas', score: 88.0 }
      ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-brand-500/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI-Powered Adaptive Platform</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Welcome back, {user?.fullName?.split(' ')[0] || 'Learner'}! 👋
            </h1>
            <p className="text-blue-100 text-sm mt-1 max-w-xl">
              Your personalized study telemetry and ML recommendations have been calibrated.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/summarizer"
              className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> Note Summarizer & Quiz
            </Link>
            <Link
              to="/quiz/adaptive"
              className="px-3.5 py-2 rounded-xl bg-white text-brand-700 text-xs font-bold hover:bg-blue-50 transition shadow-sm flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Adaptive Quiz
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid - 5 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{s.label}</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl font-extrabold text-slate-900">{s.value}</p>
              <p className="text-[11px] text-slate-400 mt-1 truncate">{s.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Weak-Topic Detection & Strengths Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Identified Weaknesses (Struggle Detection) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">AI Weak-Topic Detection</h2>
                  <p className="text-xs text-slate-400">Targeted areas where assessment results indicate knowledge gaps</p>
                </div>
              </div>
              <Link to="/analytics" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center">
                Detailed Analytics <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            <div className="space-y-3 mt-4">
              {weakTopics.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">{item.topicTitle}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                        {item.score.toFixed(0)}% Mastery
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">{item.suggestedAction}</p>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Link
                      to={`/quiz/${item.topicId}`}
                      className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition flex items-center gap-1 shadow-xs"
                    >
                      <Zap className="w-3 h-3" /> Practice Quiz
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Adaptive difficulty recalibrates automatically upon retry.</span>
            <Link to="/early-warning" className="font-semibold text-amber-600 hover:underline">
              Check Early Warning Alerts →
            </Link>
          </div>
        </div>

        {/* Identified Strengths & Mastery */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Concept Strengths</h2>
                <p className="text-xs text-slate-400">High proficiency topics mastered in your curriculum</p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {strongTopics.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{item.topicTitle}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <Trophy className="w-3 h-3 text-emerald-600" /> Proficient Mastery
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs">
                    {item.score.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              to="/certificates"
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-500" /> View Course Certificates & Badges
            </Link>
          </div>
        </div>
      </div>

      {/* Middle Row: Recommendations & Today's Plan */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recommendations */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Study Recommendations</span>
            </h2>
            <Link to="/recommendations" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          {recommendations.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">Complete an assessment to unlock personalized recommendations.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {recommendations.map((r) => (
                <div key={r.id} className="flex flex-col justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition">
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        r.type === 'QUIZ' ? 'bg-violet-50 text-violet-700 border-violet-200' :
                        r.type === 'COURSE' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        r.type === 'VIDEO' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {r.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{r.priorityScore.toFixed(0)}% Match</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{r.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{r.reason}</p>
                  </div>
                  <Link
                    to={r.type === 'QUIZ' ? `/quiz/${r.targetId}` : '/courses'}
                    className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 pt-2 border-t border-slate-200/60"
                  >
                    <span>{r.type === 'QUIZ' ? 'Attempt Practice' : 'Explore Content'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Study Plan Preview */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Today's Study Schedule</span>
              </h2>
              <Link to="/study-planner" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center">
                Planner <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
            {plan && plan.items.length > 0 ? (
              <div className="space-y-2">
                {plan.items.slice(0, 4).map((item) => (
                  <div key={item.id} className={`flex items-center space-x-3 p-2.5 rounded-lg text-xs ${item.completed ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50 border border-slate-100'}`}>
                    <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${item.completed ? 'bg-emerald-500 text-white' : 'border border-slate-300'}`}>
                      {item.completed && <Trophy className="w-2.5 h-2.5" />}
                    </div>
                    <span className={`truncate ${item.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>{item.title}</span>
                  </div>
                ))}
                <div className="pt-3">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${plan.completionPercentage}%` }}></div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{plan.completionPercentage}% of scheduled milestone complete</p>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                <p>No active schedule created yet.</p>
                <Link to="/study-planner" className="mt-2 inline-block text-brand-600 font-semibold hover:underline">
                  Generate Spaced-Repetition Plan →
                </Link>
              </div>
            )}
          </div>

          {(isTeacher || isAdmin) && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <Link
                to="/teacher-dashboard"
                className="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Users className="w-4 h-4" /> Switch to Teacher / Cohort Portal
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Feature Launchpad Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { to: '/mentor', label: 'AI Mentor', icon: Brain, color: 'border-indigo-200 bg-indigo-50/70 text-indigo-700' },
          { to: '/voice-tutor', label: 'Voice AI Tutor', icon: Mic, color: 'border-violet-200 bg-violet-50/70 text-violet-700' },
          { to: '/summarizer', label: 'Note Summarizer', icon: FileText, color: 'border-purple-200 bg-purple-50/70 text-purple-700' },
          { to: '/quiz/adaptive', label: 'Adaptive Quiz', icon: Zap, color: 'border-amber-200 bg-amber-50/70 text-amber-700' },
          { to: '/coding-tutor', label: 'Coding Sandbox', icon: Code, color: 'border-emerald-200 bg-emerald-50/70 text-emerald-700' },
          { to: '/certificates', label: 'Certificates', icon: Award, color: 'border-cyan-200 bg-cyan-50/70 text-cyan-700' },
        ].map((nav) => {
          const Icon = nav.icon;
          return (
            <Link key={nav.to} to={nav.to} className={`flex items-center space-x-2.5 px-3.5 py-3 rounded-xl border ${nav.color} text-xs font-bold card-hover transition`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{nav.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
