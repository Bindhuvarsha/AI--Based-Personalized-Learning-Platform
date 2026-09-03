import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { RecommendationItem } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Sparkles, Brain, BookOpen, Target, ArrowRight, RefreshCw, Filter } from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const resp = await api.get('/recommendations');
      setRecommendations(resp.data);
    } catch (err) {
      console.error('Failed to load recommendations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const filtered = recommendations.filter(item => {
    if (filterType === 'ALL') return true;
    return item.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'QUIZ':
        return <Brain className="w-5 h-5 text-violet-600" />;
      case 'RESOURCE':
        return <BookOpen className="w-5 h-5 text-amber-600" />;
      default:
        return <Target className="w-5 h-5 text-brand-600" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'QUIZ':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      case 'RESOURCE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-brand-50 text-brand-700 border-brand-200';
    }
  };

  const getActionLink = (item: RecommendationItem) => {
    if (item.type === 'QUIZ') {
      return `/quiz/${item.targetId}`;
    }
    return `/courses`;
  };

  if (loading) return <LoadingSpinner message="Generating ML personalized recommendations..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span>AI & ML Recommendations</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time recommendations powered by scikit-learn models based on your quiz performance and knowledge gaps.
          </p>
        </div>

        <button
          onClick={fetchRecommendations}
          className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Engine</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        {['ALL', 'TOPIC', 'QUIZ', 'RESOURCE'].map(t => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === t
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t === 'ALL' ? 'All Items' : t}
          </button>
        ))}
      </div>

      {/* Recommendations Feed */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No recommendations found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Take a diagnostic assessment or attempt a topic quiz to train your learner profile.
          </p>
          <Link
            to="/assessment"
            className="mt-4 inline-block px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700 transition-colors"
          >
            Take Skill Assessment
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getBadgeColor(item.type)}`}>
                    {getIcon(item.type)}
                    <span className="ml-1">{item.type}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Priority: {item.priorityScore.toFixed(0)}%
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.reason}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">{item.category}</span>
                <Link
                  to={getActionLink(item)}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  <span>{item.type === 'QUIZ' ? 'Attempt Quiz' : 'Study Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
