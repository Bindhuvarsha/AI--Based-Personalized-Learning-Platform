import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Course, TopicSummary } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { BookOpen, Clock, Users, ChevronRight, Brain, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const resp = await api.get(`/courses/${id}`);
        setCourse(resp.data);
      } catch (err) {
        console.error('Failed to load course', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading course curriculum..." />;
  if (!course) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-bold text-slate-800">Course not found</h2>
        <Link to="/courses" className="text-sm text-brand-600 hover:underline mt-2 inline-block">
          Back to Courses
        </Link>
      </div>
    );
  }

  const difficultyColor: Record<string, string> = {
    BEGINNER: 'bg-emerald-100 text-emerald-700',
    INTERMEDIATE: 'bg-amber-100 text-amber-700',
    ADVANCED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link to="/courses" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-brand-600">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Catalog
      </Link>

      {/* Course Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${difficultyColor[course.difficulty] || 'bg-slate-100 text-slate-600'}`}>
            {course.difficulty}
          </span>
          <span className="text-xs bg-brand-50 text-brand-700 font-medium px-2.5 py-0.5 rounded-lg">
            {course.category}
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">{course.title}</h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl mb-4">{course.description}</p>
        <div className="flex items-center space-x-6 text-xs text-slate-500 pt-4 border-t border-slate-100">
          <span className="flex items-center space-x-1.5"><BookOpen className="w-4 h-4 text-slate-400" /><span>{course.topics?.length || 0} Topics</span></span>
          <span className="flex items-center space-x-1.5"><Brain className="w-4 h-4 text-slate-400" /><span>Adaptive Quizzes Included</span></span>
        </div>
      </div>

      {/* Curriculum / Topics List */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-3">Syllabus & Topic Modules</h2>
        <div className="space-y-3">
          {course.topics && course.topics.length > 0 ? (
            course.topics.map((topic, idx) => (
              <div key={topic.id} className="bg-white rounded-xl border border-slate-200 p-4 transition-all hover:border-brand-300">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{topic.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{topic.description}</p>
                      {topic.prerequisites && (
                        <p className="text-[11px] text-amber-600 font-medium mt-1">
                          Prerequisites: {topic.prerequisites}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                    <Link
                      to={`/quiz/${topic.id}`}
                      className="px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 text-xs font-semibold flex items-center space-x-1 transition-colors"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>Take Quiz</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 py-6 text-center bg-white rounded-xl border border-slate-200">
              No topics published for this course yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
