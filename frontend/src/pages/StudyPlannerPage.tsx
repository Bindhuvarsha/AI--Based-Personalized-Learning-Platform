import React, { useState, useEffect } from 'react';
import { plannerApi } from '../services/api';
import { WeeklyScheduleData, StudySessionItem } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import {
  Calendar, Clock, CheckCircle2, Circle, AlertCircle,
  RotateCcw, Sparkles, ArrowRight, ShieldAlert
} from 'lucide-react';

export const StudyPlannerPage: React.FC = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<WeeklyScheduleData | null>(null);
  const [reschedulingSession, setReschedulingSession] = useState<StudySessionItem | null>(null);
  const [newDate, setNewDate] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const res = await plannerApi.getWeekly();
      setSchedule(res.data);
    } catch (err: any) {
      showToast('Failed to load weekly study schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (session: StudySessionItem) => {
    try {
      await plannerApi.toggleSession(session.id);
      loadSchedule();
    } catch (err) {
      showToast('Failed to toggle session status', 'error');
    }
  };

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingSession || !newDate) return;

    try {
      await plannerApi.reschedule(reschedulingSession.id, newDate, reason);
      showToast('Session rescheduled successfully', 'success');
      setReschedulingSession(null);
      loadSchedule();
    } catch (err: any) {
      showToast('Failed to reschedule session', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Computing spaced repetition study timetable..." />;
  }

  const completionPct = schedule && schedule.totalPlannedMinutes > 0
    ? Math.round((schedule.completedMinutes / schedule.totalPlannedMinutes) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white rounded-2xl p-6 shadow-xl space-y-2">
        <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          <Calendar className="w-3.5 h-3.5 text-brand-300" />
          <span>Dynamic Spaced-Repetition Timetable</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">AI Intelligent Study Planner</h1>
        <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl">
          Automatically adjusts your study load across weekdays based on memory retention intervals, upcoming exam targets, and weak knowledge graph nodes.
        </p>
      </div>

      {/* Progress Bar */}
      {schedule && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">
              Week of {schedule.weekStartDate} to {schedule.weekEndDate}
            </span>
            <span className="font-extrabold text-brand-600">
              {schedule.completedMinutes} / {schedule.totalPlannedMinutes} Mins Completed ({completionPct}%)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Sessions Timetable List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900">Planned Sessions</h2>
          <span className="text-xs text-slate-400 font-medium">Click circle to complete</span>
        </div>

        <div className="space-y-3">
          {schedule?.sessions.map((s) => (
            <div
              key={s.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                s.isCompleted
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : 'border-slate-200 bg-white hover:border-brand-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => handleToggle(s)}
                  className="mt-0.5 text-slate-400 hover:text-brand-600 transition-colors"
                >
                  {s.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className={`text-xs font-bold ${s.isCompleted ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {s.title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {s.sessionType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{s.explanationScheduled}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-3 text-xs text-slate-500 pl-8 sm:pl-0">
                <div className="flex items-center space-x-1 font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.durationMinutes}m • {s.sessionDate}</span>
                </div>
                {!s.isCompleted && (
                  <button
                    onClick={() => {
                      setReschedulingSession(s);
                      setNewDate(s.sessionDate);
                    }}
                    className="text-[11px] font-bold text-brand-600 hover:text-brand-700 hover:underline"
                  >
                    Reschedule
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reschedule Modal */}
      {reschedulingSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Reschedule Study Session</h3>
            <p className="text-xs text-slate-500">{reschedulingSession.title}</p>

            <form onSubmit={handleReschedule} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select New Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason for Adjustment</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Work conflict, exam preparation..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setReschedulingSession(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 text-white font-bold rounded-xl"
                >
                  Save New Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
