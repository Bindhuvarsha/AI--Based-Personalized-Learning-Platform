import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { BookOpen, Users, Clock, ChevronRight, Search, Filter } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedHours: number;
  enrolledCount: number;
  topicCount: number;
  published: boolean;
}

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('ALL');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const resp = await api.get('/courses');
        setCourses(resp.data);
      } catch { setCourses([]); }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchDiff = filterDifficulty === 'ALL' || c.difficulty === filterDifficulty;
    return matchSearch && matchDiff;
  });

  const difficultyColor: Record<string, string> = {
    BEGINNER: 'bg-emerald-100 text-emerald-700',
    INTERMEDIATE: 'bg-amber-100 text-amber-700',
    ADVANCED: 'bg-red-100 text-red-700',
  };

  if (loading) return <LoadingSpinner message="Loading courses..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Course Catalog</h1>
          <p className="text-sm text-slate-500">{filtered.length} course{filtered.length !== 1 ? 's' : ''} available</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
            placeholder="Search courses..." />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}
            className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none appearance-none bg-white">
            <option value="ALL">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-600 font-medium">No courses found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => (
            <Link key={c.id} to={`/courses/${c.id}`}
              className="bg-white rounded-xl border border-slate-200 p-5 card-hover block">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${difficultyColor[c.difficulty] || 'bg-slate-100 text-slate-600'}`}>
                  {c.difficulty}
                </span>
                <span className="text-xs text-slate-400">{c.category}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2">{c.title}</h3>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">{c.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1"><BookOpen className="w-3.5 h-3.5" /><span>{c.topicCount} topics</span></span>
                  <span className="flex items-center space-x-1"><Clock className="w-3.5 h-3.5" /><span>{c.estimatedHours}h</span></span>
                </div>
                <span className="flex items-center space-x-1"><Users className="w-3.5 h-3.5" /><span>{c.enrolledCount}</span></span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
