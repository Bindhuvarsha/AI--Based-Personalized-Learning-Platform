import React, { useState, useEffect } from 'react';
import { assignmentApi } from '../services/api';
import { AssignmentSummary, EvaluationResultData } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import {
  FileCheck, Award, AlertCircle, CheckCircle, Clock,
  Upload, ChevronRight, BookOpen, Quote, ShieldAlert
} from 'lucide-react';

export const AssignmentPage: React.FC = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<AssignmentSummary[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentSummary | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResultData | null>(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const res = await assignmentApi.list();
      setAssignments(res.data);
      if (res.data.length > 0) {
        setSelectedAssignment(res.data[0]);
      }
    } catch (err: any) {
      showToast('Failed to load assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    if (!submissionText.trim() && !fileUrl.trim()) {
      showToast('Please provide your solution text or file link.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await assignmentApi.submit(selectedAssignment.id, submissionText, fileUrl);
      setEvaluationResult(res.data);
      showToast('Assignment submitted and evaluated by AI Rubric Engine!', 'success');
      loadAssignments();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to submit assignment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading assignments and rubrics..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white rounded-2xl p-6 shadow-xl space-y-2">
        <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          <FileCheck className="w-3.5 h-3.5 text-brand-300" />
          <span>Rubric-Grounded Automated Grading</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">AI Assignment Evaluator</h1>
        <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl">
          Submit technical design documents and code explanations. Every submission receives detailed rubric criteria scoring, cited quotes, and actionable suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignments List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Course Assignments</h3>
          <div className="space-y-2.5">
            {assignments.map((a) => (
              <div
                key={a.id}
                onClick={() => {
                  setSelectedAssignment(a);
                  setEvaluationResult(null);
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedAssignment?.id === a.id
                    ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-400'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{a.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    a.submissionStatus === 'EVALUATED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {a.submissionStatus === 'EVALUATED' ? 'Graded' : 'Open'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{a.description}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-100">
                  <span>Max Score: {a.maxScore} pts</span>
                  {a.earnedScore != null && (
                    <span className="font-bold text-emerald-600">Earned: {a.earnedScore}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Assignment Workspace */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAssignment && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              {/* Assignment Overview */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Technical Assignment</span>
                  <span className="text-xs font-semibold text-slate-400">Max: {selectedAssignment.maxScore} pts</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">{selectedAssignment.title}</h2>
                <p className="text-xs text-slate-600 leading-relaxed">{selectedAssignment.description}</p>
              </div>

              {/* Rubric Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Evaluation Rubric</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedAssignment.rubrics.map((r) => (
                    <div key={r.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span>{r.criterionName}</span>
                        <span className="text-brand-600">{r.maxPoints} pts</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{r.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submission Form */}
              {!evaluationResult && (
                <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Your Technical Response / Design Notes</label>
                    <textarea
                      rows={6}
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      placeholder="Paste your architecture review, design decisions, trade-off analysis, or algorithmic solution here..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Optional File or Repository Link</label>
                    <input
                      type="url"
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center justify-center"
                  >
                    <Upload className="w-3.5 h-3.5 mr-2" />
                    {submitting ? 'Evaluating against Rubrics with AI...' : 'Submit Assignment for Evaluation'}
                  </button>
                </form>
              )}

              {/* Evaluation Feedback View */}
              {evaluationResult && (
                <div className="space-y-6 pt-4 border-t border-slate-100 animate-fadeIn">
                  {/* Score Tile */}
                  <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Evaluation Score</span>
                      <h3 className="text-2xl font-extrabold text-emerald-800 mt-0.5">
                        {evaluationResult.overallScore} / {evaluationResult.maxScore} ({evaluationResult.percentage}%)
                      </h3>
                      <p className="text-xs text-emerald-700 mt-0.5">Grounded in assignment rubric criteria</p>
                    </div>
                    <Award className="w-12 h-12 text-emerald-500 opacity-80" />
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-xs font-bold text-emerald-700 flex items-center">
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Key Strengths
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                        {evaluationResult.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-xs font-bold text-rose-700 flex items-center">
                        <AlertCircle className="w-3.5 h-3.5 mr-1.5" /> Areas for Improvement
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                        {evaluationResult.weaknesses.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Quoted Evidence */}
                  {evaluationResult.quotedEvidence && evaluationResult.quotedEvidence.length > 0 && (
                    <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-1.5">
                      <span className="text-xs font-bold text-indigo-900 flex items-center">
                        <Quote className="w-3.5 h-3.5 mr-1.5 text-indigo-600" /> Evidence Cited From Submission
                      </span>
                      {evaluationResult.quotedEvidence.map((q, i) => (
                        <p key={i} className="text-xs text-indigo-950 italic font-mono pl-4 border-l-2 border-indigo-400">
                          {q}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Actionable Suggestions */}
                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-amber-900">Recommended Follow-Up</span>
                    <p className="text-xs text-amber-950 leading-relaxed">{evaluationResult.improvementSuggestions}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
