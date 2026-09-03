import React, { useState, useEffect } from 'react';
import { earlyWarningApi } from '../services/api';
import { EarlyWarningAlert, InAppNotification } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import {
  AlertTriangle, ShieldAlert, Bell, CheckCircle, Clock,
  ArrowRight, Sparkles, X, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const EarlyWarningPage: React.FC = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [warnings, setWarnings] = useState<EarlyWarningAlert[]>([]);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [dismissingWarning, setDismissingWarning] = useState<EarlyWarningAlert | null>(null);
  const [snoozeDays, setSnoozeDays] = useState(3);
  const [actionTaken, setActionTaken] = useState('SCHEDULED_REVIEW');

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const [warnRes, notifRes] = await Promise.all([
        earlyWarningApi.getWarnings(),
        earlyWarningApi.getNotifications()
      ]);
      setWarnings(warnRes.data);
      setNotifications(notifRes.data);
    } catch (err: any) {
      showToast('Failed to load warning telemetry', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dismissingWarning) return;

    try {
      await earlyWarningApi.dismiss(dismissingWarning.id, snoozeDays, actionTaken);
      showToast('Alert resolved and intervention recorded', 'success');
      setDismissingWarning(null);
      loadAlerts();
    } catch (err) {
      showToast('Failed to dismiss alert', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Checking early warning detection systems..." />;
  }

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'URGENT':
      case 'HIGH':
        return 'border-rose-300 bg-rose-50/70 text-rose-900';
      case 'MEDIUM':
        return 'border-amber-300 bg-amber-50/70 text-amber-900';
      case 'LOW':
      default:
        return 'border-blue-300 bg-blue-50/70 text-blue-900';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white rounded-2xl p-6 shadow-xl space-y-2">
        <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
          <span>Continuous Proactive Academic Safeguards</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Academic Early Warning System</h1>
        <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl">
          Automated alerts detect sudden score declines, persistent knowledge gaps, or study drop-offs to initiate timely course corrections.
        </p>
      </div>

      {/* Active Warnings Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900">Active Academic Warnings</h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
            {warnings.length} Active
          </span>
        </div>

        {warnings.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Active Academic Warnings</h3>
            <p className="text-xs text-slate-500">Your study rhythm and quiz performance are in healthy zones.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {warnings.map((w) => (
              <div
                key={w.id}
                className={`p-5 rounded-2xl border-2 space-y-3 transition-all ${getSeverityStyle(w.severity)}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white/80 shadow-xs">
                        {w.severity} SEVERITY
                      </span>
                      <span className="text-xs opacity-75 font-mono">{w.warningType}</span>
                    </div>
                    <p className="text-xs font-semibold mt-2 leading-relaxed">{w.evidenceText}</p>
                  </div>
                  <button
                    onClick={() => setDismissingWarning(w)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 underline flex-shrink-0"
                  >
                    Acknowledge
                  </button>
                </div>

                <div className="bg-white/80 p-3 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-slate-800">Recommended Action:</span>
                  <p className="text-slate-600">{w.recommendedAction}</p>
                </div>

                <div className="flex justify-end space-x-2 pt-1">
                  <Link
                    to="/mentor"
                    className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors flex items-center shadow-xs"
                  >
                    Consult AI Mentor <ChevronRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* In-App Notifications Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Bell className="w-5 h-5 text-brand-600" />
          <h2 className="text-sm font-bold text-slate-900">Recent Notifications & Guidance</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {notifications.map((n) => (
            <div key={n.id} className="py-3.5 flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-800">{n.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">{n.notificationType}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Acknowledge Warning Modal */}
      {dismissingWarning && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Acknowledge & Record Action</h3>
            <p className="text-xs text-slate-500">{dismissingWarning.evidenceText}</p>

            <form onSubmit={handleDismiss} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Selected Action</label>
                <select
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="SCHEDULED_REVIEW">Scheduled focused mentor review</option>
                  <option value="STUDIED_PREREQUISITE">Reviewed prerequisite knowledge node</option>
                  <option value="ADJUSTED_TIMETABLE">Adjusted weekly study timetable</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Snooze Alert For</label>
                <select
                  value={snoozeDays}
                  onChange={(e) => setSnoozeDays(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value={1}>1 Day</option>
                  <option value={3}>3 Days</option>
                  <option value={7}>7 Days</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setDismissingWarning(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 text-white font-bold rounded-xl shadow-xs"
                >
                  Resolve Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
