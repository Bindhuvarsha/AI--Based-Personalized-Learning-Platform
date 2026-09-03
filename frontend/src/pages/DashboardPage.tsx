import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AnalyticsDashboard, RecommendationItem, StudyPlan } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { KnowledgeBadge } from '../components/Badge';
import { BarChart3, Flame, Target, BookOpen, Sparkles, ArrowRight, Calendar, Trophy, TrendingUp, Brain } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
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
        if (recsResp.status === 'fulfilled') setRecommendations(recsResp.value.data.slice(0, 3));
        if (planResp.status === 'fulfilled') setPlan(planResp.value.data);
      } catch { /* Graceful fallback */ }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;

  const stats = [
    { label: 'Overall Mastery', value: `${analytics?.overallMasteryPercentage?.toFixed(0) || 0}%`, icon: TrendingUp, color: 'text-brand-600 bg-brand-50' },
    { label: 'Topics Completed', value: `${analytics?.completedTopicsCount || 0}/${analytics?.totalTopicsCount || 0}`, icon: Target, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Quizzes Taken', value: analytics?.totalQuizzesTaken || 0, icon: Brain, color: 'text-violet-600 bg-violet-50' },
    { label: 'Learning Streak', value: `${analytics?.currentStreakDays || 0} days`, icon: Flame, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-brand-500/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold mb-1">Welcome back, {user?.fullName?.split(' ')[0] || 'Learner'}! 👋</h1>
            <p className="text-blue-100 text-sm">Your personalized learning dashboard is ready. Keep your streak alive!</p>
          </div>
          <div className="hidden sm:flex items-center space-x-3">
            <Link to="/assessment" className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/30 transition-all">
              Take Assessment
            </Link>
            <Link to="/tutor" className="px-4 py-2 rounded-lg bg-white text-brand-700 text-sm font-bold hover:bg-blue-50 transition-all">
              Ask AI Tutor
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 card-hover">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{s.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recommendations */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Recommendations</span>
            </h2>
            <Link to="/recommendations" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center">
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          {recommendations.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">Complete an assessment to unlock personalized recommendations.</p>
          ) : (
            <div className="space-y-3">
              {recommendations.map((r) => (
                <div key={r.id} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${r.type === 'QUIZ' ? 'bg-violet-100 text-violet-600' : r.type === 'RESOURCE' ? 'bg-amber-100 text-amber-600' : 'bg-brand-100 text-brand-600'
                    }`}>
                    {r.type === 'QUIZ' ? <Brain className="w-4 h-4" /> : r.type === 'RESOURCE' ? <BookOpen className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{r.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{r.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Study Plan Preview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Today's Plan</span>
            </h2>
            <Link to="/study-plan" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center">
              Full Plan <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          {plan && plan.items.length > 0 ? (
            <div className="space-y-2">
              {plan.items.slice(0, 4).map((item) => (
                <div key={item.id} className={`flex items-center space-x-3 p-2.5 rounded-lg text-sm ${item.completed ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50 border border-slate-100'}`}>
                  <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${item.completed ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300'}`}>
                    {item.completed && <Trophy className="w-3 h-3" />}
                  </div>
                  <span className={`truncate ${item.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}`}>{item.title}</span>
                </div>
              ))}
              <div className="pt-2">
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${plan.completionPercentage}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{plan.completionPercentage}% complete</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 py-6 text-center">No active plan. Generate one in the Study Planner.</p>
          )}
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { to: '/roadmap', label: 'Roadmap', icon: Target, color: 'border-brand-200 bg-brand-50 text-brand-700' },
          { to: '/courses', label: 'Courses', icon: BookOpen, color: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
          { to: '/analytics', label: 'Analytics', icon: BarChart3, color: 'border-violet-200 bg-violet-50 text-violet-700' },
          { to: '/tutor', label: 'AI Tutor', icon: Brain, color: 'border-amber-200 bg-amber-50 text-amber-700' },
        ].map((nav) => {
          const Icon = nav.icon;
          return (
            <Link key={nav.to} to={nav.to} className={`flex items-center space-x-3 px-4 py-3 rounded-xl border ${nav.color} text-sm font-semibold card-hover`}>
              <Icon className="w-5 h-5" />
              <span>{nav.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
