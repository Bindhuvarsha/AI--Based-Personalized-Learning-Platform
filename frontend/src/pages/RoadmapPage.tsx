import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { RoadmapResponse, RoadmapNode, Course } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { KnowledgeBadge, StatusBadge } from '../components/Badge';
import { Target, Lock, CheckCircle2, ChevronRight, Brain, BookOpen, Sparkles, RefreshCw } from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const resp = await api.get('/courses');
        setCourses(resp.data);
        if (resp.data.length > 0) {
          setSelectedCourseId(resp.data[0].id);
        }
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    const fetchRoadmap = async () => {
      setRefreshing(true);
      try {
        const resp = await api.get(`/roadmap/courses/${selectedCourseId}`);
        setRoadmap(resp.data);
      } catch (err) {
        console.error('Failed to load roadmap', err);
      } finally {
        setRefreshing(false);
      }
    };
    fetchRoadmap();
  }, [selectedCourseId]);

  if (loading) return <LoadingSpinner message="Loading learning roadmaps..." />;

  return (
    <div className="space-y-6">
      {/* Header and Course Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Target className="w-6 h-6 text-brand-600" />
            <span>Personalized Learning Roadmap</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Prerequisite-based adaptive path tuned by your quiz scores & AI diagnostics.
          </p>
        </div>

        {courses.length > 0 && (
          <div className="flex items-center space-x-2">
            <label className="text-xs font-semibold text-slate-600">Course:</label>
            <select
              value={selectedCourseId || ''}
              onChange={e => setSelectedCourseId(Number(e.target.value))}
              className="text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-brand-500"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {roadmap && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Active Curriculum</span>
              <h2 className="text-lg font-bold text-slate-900">{roadmap.courseTitle}</h2>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-slate-900">{roadmap.progressPercentage}%</span>
              <p className="text-xs text-slate-400">Mastery Progress</p>
            </div>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${roadmap.progressPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>{roadmap.completedTopics} of {roadmap.totalTopics} modules completed</span>
            <span>Prerequisites automatically evaluated</span>
          </div>
        </div>
      )}

      {/* Roadmap Interactive Step-by-Step Pathway */}
      {refreshing ? (
        <LoadingSpinner message="Evaluating pathway prerequisites..." />
      ) : roadmap && roadmap.nodes.length > 0 ? (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 ml-4 sm:ml-6 space-y-6 py-2">
          {roadmap.nodes.map((node: RoadmapNode, index: number) => {
            const isCompleted = node.status === 'COMPLETED';
            const isLocked = !node.isUnlocked;
            const isNext = node.recommendedNext;

            return (
              <div key={node.topicId} className="relative group">
                {/* Timeline Icon */}
                <div className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : isNext
                    ? 'bg-brand-600 border-brand-600 text-white ring-4 ring-brand-100 shadow-md animate-pulse'
                    : isLocked
                    ? 'bg-slate-100 border-slate-300 text-slate-400'
                    : 'bg-white border-brand-400 text-brand-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Node Box */}
                <div className={`rounded-2xl border p-5 transition-all ${
                  isNext
                    ? 'bg-white border-brand-400 shadow-lg shadow-brand-500/10 ring-1 ring-brand-300'
                    : isLocked
                    ? 'bg-slate-50/60 border-slate-200 opacity-75'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-slate-900">{node.title}</h3>
                      {isNext && (
                        <span className="inline-flex items-center text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3 mr-1 text-amber-600" /> Recommended Next
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <KnowledgeBadge level={node.knowledgeLevel} />
                      <StatusBadge status={node.status} />
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{node.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span>Est. {node.estimatedMinutes} mins</span>
                      <span>Mastery Score: <strong>{node.masteryScore}%</strong></span>
                    </div>

                    {!isLocked ? (
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/quiz/${node.topicId}`}
                          className="px-3.5 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors inline-flex items-center space-x-1"
                        >
                          <Brain className="w-3.5 h-3.5" />
                          <span>{isCompleted ? 'Retake Quiz' : 'Take Quiz'}</span>
                        </Link>
                      </div>
                    ) : (
                      <div className="inline-flex items-center space-x-1 text-xs text-slate-400 font-medium">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Complete earlier modules to unlock</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <Target className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No roadmap generated for this course.</p>
          <p className="text-xs text-slate-400 mt-1">Please select another course or take an assessment.</p>
        </div>
      )}
    </div>
  );
};
