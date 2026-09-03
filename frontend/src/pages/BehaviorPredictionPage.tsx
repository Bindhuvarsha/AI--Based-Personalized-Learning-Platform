import React, { useState, useEffect } from 'react';
import { behaviorApi } from '../services/api';
import { BehaviorPredictionResponse } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import {
  TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Clock,
  Brain, ShieldCheck, Activity, Target, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const BehaviorPredictionPage: React.FC = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState<BehaviorPredictionResponse | null>(null);

  useEffect(() => {
    loadPrediction();
  }, []);

  const loadPrediction = async () => {
    try {
      setLoading(true);
      const res = await behaviorApi.predict();
      setPrediction(res.data);
    } catch (err: any) {
      showToast('Failed to run behavior prediction', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Computing learning trajectory and risk categorization..." />;
  }

  const getRiskBadge = (category: string) => {
    switch (category) {
      case 'HIGH':
      case 'CRITICAL':
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-800',
          icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
          label: 'Academic Risk Detected',
          desc: 'Significant performance deceleration or score drop detected in recent attempts.'
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-800',
          icon: <Clock className="w-5 h-5 text-amber-600" />,
          label: 'Moderate Attention Advised',
          desc: 'Minor pace slowdown observed. Timely revision will maintain optimal velocity.'
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-800',
          icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
          label: 'Optimal Learning Velocity',
          desc: 'Strong concept retention and consistent study schedule detected.'
        };
    }
  };

  const badge = prediction ? getRiskBadge(prediction.riskCategory) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white rounded-2xl p-6 shadow-xl space-y-2">
        <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          <Activity className="w-3.5 h-3.5 text-brand-300" />
          <span>Explainable ML Behavioral Telemetry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Study Telemetry & Risk Analytics</h1>
        <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl">
          Continuous machine-learning evaluation of study rhythms, quiz velocity, and retention trends to prevent academic struggle before it occurs.
        </p>
      </div>

      {/* Main Prediction Banner */}
      {prediction && badge && (
        <div className={`p-6 rounded-2xl border-2 ${badge.bg} flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm`}>
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm">{badge.icon}</div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold uppercase tracking-wider">{prediction.riskCategory} Risk Tier</span>
                <span className="text-xs opacity-50">•</span>
                <span className="text-xs font-bold">Struggle Probability: {Math.round(prediction.struggleProbability * 100)}%</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">{badge.label}</h2>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">{badge.desc}</p>
            </div>
          </div>
          <button
            onClick={loadPrediction}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            Recompute Metrics
          </button>
        </div>
      )}

      {/* Metric Tiles */}
      {prediction && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-2xl font-extrabold text-slate-900">{Math.round(prediction.avgQuizScore)}%</span>
            <p className="text-[11px] text-slate-500 font-semibold uppercase mt-1">Avg Quiz Score</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className={`text-2xl font-extrabold ${prediction.scoreTrendSlope >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {prediction.scoreTrendSlope >= 0 ? '+' : ''}{Math.round(prediction.scoreTrendSlope)}%
            </span>
            <p className="text-[11px] text-slate-500 font-semibold uppercase mt-1">Score Trajectory</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-2xl font-extrabold text-slate-900">{prediction.inactivityDays}d</span>
            <p className="text-[11px] text-slate-500 font-semibold uppercase mt-1">Days Since Active</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-2xl font-extrabold text-brand-600">{Math.round(prediction.completionRate)}%</span>
            <p className="text-[11px] text-slate-500 font-semibold uppercase mt-1">Module Completion</p>
          </div>
        </div>
      )}

      {/* Contributing Factors & Actionable Intervention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contributing Factors */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <Brain className="w-4 h-4 text-brand-600 mr-2" /> Explainable Model Factors
          </h3>
          <p className="text-xs text-slate-500">
            Why this classification was assigned by the Random Forest classifier:
          </p>
          <div className="space-y-2.5">
            {prediction?.contributingFactors.map((factor, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start space-x-2">
                <span className="text-brand-600 font-bold">•</span>
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Intervention */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <Target className="w-4 h-4 text-indigo-600 mr-2" /> Proactive Intervention
            </h3>
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 font-medium leading-relaxed">
              {prediction?.recommendedIntervention}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <Link
              to="/mentor"
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center transition-colors shadow-sm"
            >
              Consult AI Mentor Now <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
            <Link
              to="/study-planner"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center transition-colors"
            >
              Adjust Study Planner Schedule
            </Link>
          </div>
        </div>
      </div>

      {/* Model Versioning Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>Model: <strong>{prediction?.modelVersion}</strong> • Evaluated on latest learning telemetry</span>
        </div>
        <span>{prediction?.disclaimer}</span>
      </div>
    </div>
  );
};
