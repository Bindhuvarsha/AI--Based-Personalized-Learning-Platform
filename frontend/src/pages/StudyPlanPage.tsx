import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StudyPlan, StudyPlanItem } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Calendar, CheckCircle2, Circle, Clock, Plus, Target, Flame, Trophy } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const StudyPlanPage: React.FC = () => {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('Full Stack AI Mastery');
  const [durationDays, setDurationDays] = useState(14);
  const [availableHours, setAvailableHours] = useState(10);
  const [creating, setCreating] = useState(false);
  const { showToast } = useToast();

  const fetchPlan = async () => {
    try {
      const resp = await api.get('/study-plan');
      setPlan(resp.data);
    } catch (err) {
      console.log('No active study plan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleToggleItem = async (item: StudyPlanItem) => {
    try {
      if (item.completed) {
        await api.post(`/study-plan/items/${item.id}/uncomplete`);
      } else {
        await api.post(`/study-plan/items/${item.id}/complete`);
      }
      fetchPlan();
    } catch (err) {
      showToast('Failed to update study plan item', 'error');
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const resp = await api.post('/study-plan/generate', {
        goalTitle,
        durationDays,
        availableHoursPerWeek: availableHours,
      });
      setPlan(resp.data);
      setShowCreateModal(false);
      showToast('Personalized study plan created!', 'success');
    } catch (err) {
      showToast('Failed to generate study plan', 'error');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your personal schedule..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-brand-600" />
            <span>AI Study Planner</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Structured daily milestone schedule tailored to your available study hours and goals.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{plan ? 'Regenerate Plan' : 'Create Study Plan'}</span>
        </button>
      </div>

      {/* Active Plan Overview */}
      {plan ? (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Goal</span>
                <h2 className="text-lg font-bold text-slate-900">{plan.goalTitle}</h2>
                <div className="flex items-center space-x-4 text-xs text-slate-400 mt-1">
                  <span>{plan.durationDays} Days Duration</span>
                  <span>•</span>
                  <span>{plan.availableHoursPerWeek} hrs/week</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">{plan.completionPercentage}%</span>
                <p className="text-xs text-slate-400">
                  {plan.completedItems} / {plan.totalItems} Tasks Done
                </p>
              </div>
            </div>

            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${plan.completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Daily Milestone Items */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Milestone Tasks</h3>
            {plan.items.map(item => (
              <div
                key={item.id}
                onClick={() => handleToggleItem(item)}
                className={`flex items-start justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                  item.completed
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button className="mt-0.5 text-slate-400 hover:text-emerald-600">
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </button>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                        Day {item.dayNumber}
                      </span>
                      <h4 className={`text-sm font-semibold ${item.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-slate-400 flex-shrink-0 ml-4">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.estimatedMinutes}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No active study plan</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Set your target learning goal and timeframe to generate a tailored daily roadmap.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 px-5 py-2.5 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700 shadow-sm"
          >
            Create Your Plan Now
          </button>
        </div>
      )}

      {/* Modal: Create / Regenerate Plan */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Generate Personalized Study Plan</h3>
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Learning Goal</label>
                <input
                  type="text"
                  value={goalTitle}
                  onChange={e => setGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="e.g. Master Backend & AI Engineering"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min={3}
                    max={60}
                    value={durationDays}
                    onChange={e => setDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hours / Week</label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={availableHours}
                    onChange={e => setAvailableHours(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 rounded-xl shadow-sm disabled:opacity-50"
                >
                  {creating ? 'Generating...' : 'Generate Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
