import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Assessment, Question, AssessmentResult } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { KnowledgeBadge } from '../components/Badge';
import { Brain, ChevronRight, Clock, Award, CheckCircle2, XCircle, ArrowLeft, RotateCcw } from 'lucide-react';

export const AssessmentPage: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    api.get('/assessments')
      .then(r => setAssessments(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const startAssessment = async (a: Assessment) => {
    setLoading(true);
    try {
      const resp = await api.get(`/assessments/${a.id}`);
      setActiveAssessment(resp.data);
      setCurrentQ(0);
      setAnswers({});
      setResult(null);
      setStartTime(Date.now());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (qId: number, optIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const submitAssessment = async () => {
    if (!activeAssessment) return;
    setSubmitting(true);
    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    const submissionPayload = {
      assessmentId: activeAssessment.id,
      answers: Object.entries(answers).map(([qId, optIdx]) => ({
        questionId: Number(qId),
        selectedOptionIndex: optIdx,
      })),
      totalTimeSpentSeconds: timeSpent,
    };

    try {
      const resp = await api.post('/assessments/submit', submissionPayload);
      setResult(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetToList = () => {
    setActiveAssessment(null);
    setResult(null);
    setAnswers({});
  };

  if (loading) return <LoadingSpinner message="Loading diagnostic assessments..." />;

  // Result View
  if (result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-black ${
            result.overallScore >= 75 ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : result.overallScore >= 50 ? 'bg-amber-500 shadow-lg shadow-amber-500/20' : 'bg-red-500 shadow-lg shadow-red-500/20'
          }`}>
            {result.overallScore.toFixed(0)}%
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Diagnostic Assessment Complete!</h2>
          <p className="text-sm text-slate-500 mb-6">
            You answered {result.correctAnswers} of {result.totalQuestions} questions correctly.
          </p>

          {/* Topic-by-Topic Knowledge Diagnostic */}
          {result.topicScores && result.topicScores.length > 0 && (
            <div className="text-left space-y-3 mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Knowledge Level Breakdown
              </h3>
              <div className="grid gap-3">
                {result.topicScores.map(ts => (
                  <div key={ts.topicId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-900">{ts.topicTitle}</span>
                        <KnowledgeBadge level={ts.knowledgeLevel} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{ts.statusRecommendation}</p>
                    </div>
                    <div className="text-right sm:flex-shrink-0">
                      <span className="text-sm font-bold text-slate-800">{ts.percentage.toFixed(0)}%</span>
                      <p className="text-[11px] text-slate-400">{ts.correctQuestions}/{ts.totalQuestions} correct</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={resetToList}
              className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs hover:bg-brand-700 transition-all shadow-sm"
            >
              Back to Assessments
            </button>
          </div>
        </div>

        {/* Question Review Section */}
        {result.questionReviews && result.questionReviews.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Question Reviews & Explanations</h3>
            {result.questionReviews.map((rev, idx) => (
              <div key={rev.questionId} className={`bg-white rounded-xl border p-4 ${rev.correct ? 'border-emerald-200' : 'border-red-200'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {rev.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  <span className="text-xs font-bold text-slate-500">Question {idx + 1} — {rev.topicTitle}</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-3">{rev.questionText}</p>
                <div className="text-xs space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <p><span className="font-semibold text-slate-600">Your choice:</span> {rev.options[rev.selectedOptionIndex] || 'None'}</p>
                  {!rev.correct && (
                    <p><span className="font-semibold text-emerald-700">Correct choice:</span> {rev.options[rev.correctOptionIndex]}</p>
                  )}
                  {rev.explanation && (
                    <p className="pt-1.5 border-t border-slate-200 text-slate-600"><span className="font-semibold">Explanation:</span> {rev.explanation}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Question-by-Question Taking View
  if (activeAssessment && activeAssessment.questions && activeAssessment.questions.length > 0) {
    const questions = activeAssessment.questions;
    const q = questions[currentQ];
    const progress = ((currentQ + 1) / questions.length) * 100;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={resetToList} className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-700">
            <ArrowLeft className="w-4 h-4 mr-1" /> Exit
          </button>
          <span className="text-xs font-medium text-slate-500">
            Question {currentQ + 1} of {questions.length}
          </span>
        </div>

        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
              {q.topicTitle || activeAssessment.subject}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              Level: {q.difficulty}
            </span>
          </div>

          <h2 className="text-sm font-bold text-slate-900 leading-snug">{q.questionText}</h2>

          <div className="space-y-2.5 pt-2">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => selectAnswer(q.id, idx)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  answers[q.id] === idx
                    ? 'border-brand-600 bg-brand-50/50 text-brand-900 ring-2 ring-brand-500/20 shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 text-xs font-bold ${
                  answers[q.id] === idx ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            Previous
          </button>

          {currentQ === questions.length - 1 ? (
            <button
              onClick={submitAssessment}
              disabled={submitting || answers[q.id] === undefined}
              className="px-6 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 disabled:opacity-40 shadow-sm"
            >
              {submitting ? 'Evaluating Diagnostic...' : 'Submit Assessment'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQ(currentQ + 1)}
              disabled={answers[q.id] === undefined}
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 disabled:opacity-40 inline-flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Assessment List View
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
          <Brain className="w-6 h-6 text-brand-600" />
          <span>Diagnostic Skill Assessments</span>
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Benchmark your starting mastery and discover your exact knowledge gaps before studying.
        </p>
      </div>

      {assessments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Brain className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-600 font-medium">No assessments available</p>
          <p className="text-xs text-slate-400 mt-1">Check back soon or explore course catalog modules.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {assessments.map(a => (
            <div key={a.id} className="bg-white rounded-2xl border border-slate-200 p-5 card-hover shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[11px] font-bold border border-brand-200">
                    {a.subject}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Difficulty: {a.difficulty}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{a.title}</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">{a.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Brain className="w-3.5 h-3.5" />
                  <span>{a.questions?.length || 5} Questions</span>
                </div>
                <button
                  onClick={() => startAssessment(a)}
                  className="px-4 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-all shadow-xs"
                >
                  Start Assessment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
