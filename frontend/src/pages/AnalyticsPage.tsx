import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AnalyticsDashboard } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { BarChart3, TrendingUp, Flame, Clock, Brain, AlertTriangle, CheckCircle, Award } from 'lucide-react';

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#6366f1'];

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const resp = await api.get('/analytics');
        setAnalytics(resp.data);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner message="Synthesizing learning analytics & mastery metrics..." />;

  const distData = analytics?.knowledgeDistribution ? [
    { name: 'Weak', value: analytics.knowledgeDistribution.weak },
    { name: 'Developing', value: analytics.knowledgeDistribution.developing },
    { name: 'Proficient', value: analytics.knowledgeDistribution.proficient },
    { name: 'Advanced', value: analytics.knowledgeDistribution.advanced },
  ] : [];

  const trendData = analytics?.quizTrends?.map(t => ({
    name: t.dateFormatted || t.topicTitle.substring(0, 10),
    Score: t.scorePercentage,
  })) || [];

  const topicPerfData = analytics?.topicPerformance?.slice(0, 6).map(p => ({
    name: p.topicTitle.length > 15 ? p.topicTitle.substring(0, 15) + '...' : p.topicTitle,
    Mastery: p.masteryScore,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-brand-600" />
          <span>Learner Analytics & Mastery Tracking</span>
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Detailed breakdown of your diagnostic progress, score trajectories, and topic strengths.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Mastery</span>
            <TrendingUp className="w-4 h-4 text-brand-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">
            {analytics?.overallMasteryPercentage?.toFixed(0) || 0}%
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Across all assessed modules</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average Quiz Score</span>
            <Award className="w-4 h-4 text-violet-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">
            {analytics?.averageQuizScore?.toFixed(0) || 0}%
          </span>
          <p className="text-[11px] text-slate-400 mt-1">{analytics?.totalQuizzesTaken || 0} quizzes submitted</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Study Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900">
            {analytics?.currentStreakDays || 0} Days
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Keep consistent daily activity</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Study Time</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">
            {analytics?.totalStudyTimeMinutes || 0}m
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Total active learning minutes</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quiz Trends Line Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Quiz Score Trajectory</h3>
          <div className="h-64">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="Score" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No quiz history data recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Knowledge Distribution Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Knowledge Level Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            {distData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                  >
                    {distData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">Take an assessment to view distribution.</div>
            )}
          </div>
        </div>
      </div>

      {/* Weak & Strong Topics Analysis */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-800">Knowledge Gaps (Action Required)</h3>
          </div>
          {analytics?.weakTopics && analytics.weakTopics.length > 0 ? (
            <div className="space-y-2.5">
              {analytics.weakTopics.map(w => (
                <div key={w.topicId} className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                    <span>{w.topicTitle}</span>
                    <span className="text-amber-700">{w.score}% Mastery</span>
                  </div>
                  <p className="text-slate-600">{w.suggestedAction}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4">No critical knowledge gaps identified.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-800">Proficient & Strong Topics</h3>
          </div>
          {analytics?.strongTopics && analytics.strongTopics.length > 0 ? (
            <div className="space-y-2.5">
              {analytics.strongTopics.map(s => (
                <div key={s.topicId} className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
                  <span className="font-bold text-slate-800">{s.topicTitle}</span>
                  <span className="text-emerald-700 font-bold">{s.score}% Mastery</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4">Complete more quizzes to demonstrate mastery.</p>
          )}
        </div>
      </div>
    </div>
  );
};
