import React, { useState } from 'react';
import { adaptiveQuizApi } from '../services/api';
import { AdaptiveSessionStart, AdaptiveSubmitResponse, Question } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import {
  Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw,
  Zap, AlertCircle, Award, Compass, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdaptiveQuizPage: React.FC = () => {
  const { showToast } = useToast();

  const [topicId, setTopicId] = useState<number>(1);
  const [session, setSession] = useState<AdaptiveSessionStart | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number>(3);
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<AdaptiveSubmitResponse | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [starting, setStarting] = useState(false);

  const startQuiz = async (selectedTopicId: number = topicId) => {
    setStarting(true);
    setLastResult(null);
    setIsCompleted(false);
    setSelectedOption(null);
    try {
      const res = await adaptiveQuizApi.startSession(selectedTopicId);
      setSession(res.data);
      setCurrentQuestion(res.data.firstQuestion);
    } catch (err: any) {
      showToast('Failed to start adaptive session', 'error');
    } finally {
      setStarting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null || !session || !currentQuestion) {
      showToast('Please select an option before submitting.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await adaptiveQuizApi.submitAnswer({
        sessionId: session.sessionId,
        questionId: currentQuestion.id,
        selectedOptionIndex: selectedOption,
        timeSpentSeconds: 25,
        confidenceScore: confidence
      });
      const data: AdaptiveSubmitResponse = res.data;
      setLastResult(data);

      if (data.isQuizCompleted) {
        setIsCompleted(true);
      }
    } catch (err: any) {
      showToast('Failed to evaluate answer', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (lastResult?.nextQuestion) {
      setCurrentQuestion(lastResult.nextQuestion);
      setSelectedOption(null);
      setLastResult(null);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'ADVANCED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'INTERMEDIATE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'BEGINNER':
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white rounded-2xl p-6 shadow-xl space-y-2">
        <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Real-Time Difficulty Scaling</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Adaptive Knowledge Quiz</h1>
        <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl">
          Questions dynamically scale across Beginner, Intermediate, and Advanced tiers depending on consecutive answers.
        </p>
      </div>

      {/* Start / Topic Selection */}
      {!session ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Select Topic to Test Mastery</h2>
            <p className="text-xs text-slate-500">
              The quiz will calibrate to your current level and adjust in real time.
            </p>
          </div>

          <div className="max-w-xs mx-auto space-y-3">
            <select
              value={topicId}
              onChange={(e) => setTopicId(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value={1}>Java 21 Fundamentals & OOP</option>
              <option value={2}>Data Structures & Algorithms</option>
              <option value={3}>Relational Databases & SQL</option>
              <option value={4}>Spring Boot 3 Web Services</option>
            </select>

            <button
              onClick={() => startQuiz(topicId)}
              disabled={starting}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all"
            >
              {starting ? 'Calibrating Question Pool...' : 'Start Adaptive Quiz'}
            </button>
          </div>
        </div>
      ) : isCompleted ? (
        /* Completion View */
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900">Adaptive Quiz Completed!</h2>
            <p className="text-xs text-slate-500">Your topic mastery score has been updated in the Knowledge Graph.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-2xl font-extrabold text-slate-900">{lastResult?.currentScore} / {lastResult?.totalAnswered}</span>
              <p className="text-[11px] text-slate-500 font-semibold uppercase mt-0.5">Correct Answers</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-2xl font-extrabold text-emerald-700">{lastResult?.currentMasteryScore}%</span>
              <p className="text-[11px] text-emerald-600 font-semibold uppercase mt-0.5">Calculated Mastery</p>
            </div>
          </div>

          <div className="flex justify-center space-x-3 pt-2">
            <button
              onClick={() => setSession(null)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Take Another Quiz
            </button>
            <Link
              to="/knowledge-graph"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-colors"
            >
              View Updated Knowledge Graph
            </Link>
          </div>
        </div>
      ) : (
        /* Active Question View */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          {/* Status Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Question #{lastResult ? lastResult.totalAnswered : 1}
              </span>
              <span className="text-slate-300">•</span>
              <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${getDifficultyColor(currentQuestion?.difficulty || 'BEGINNER')}`}>
                {currentQuestion?.difficulty}
              </span>
            </div>

            <span className="text-xs font-semibold text-slate-400">Adaptive Calibration</span>
          </div>

          {/* Difficulty Change Alert */}
          {lastResult?.difficultyChanged && (
            <div className="p-3.5 bg-brand-50 border border-brand-200 rounded-xl flex items-center space-x-2.5 text-xs text-brand-900 animate-fadeIn">
              <Zap className="w-4 h-4 text-brand-600 flex-shrink-0" />
              <span>
                <strong>Difficulty Adjusted ({lastResult.previousDifficulty} → {lastResult.currentDifficulty}):</strong>{' '}
                {lastResult.changeReason}
              </span>
            </div>
          )}

          {/* Question Text */}
          {currentQuestion && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {currentQuestion.questionText}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options?.map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={lastResult !== null}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all ${
                      selectedOption === idx
                        ? 'border-brand-500 bg-brand-50/60 text-brand-900 ring-2 ring-brand-400'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                ))}
              </div>

              {/* Confidence Selector */}
              {!lastResult && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>How confident are you?</span>
                  <div className="flex space-x-1.5">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setConfidence(lvl)}
                        className={`w-6 h-6 rounded text-[11px] font-bold ${
                          confidence === lvl ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Explanation Feedback */}
          {lastResult && (
            <div className={`p-4 rounded-xl border space-y-2 ${lastResult.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'}`}>
              <div className="flex items-center space-x-2 font-bold text-xs">
                {lastResult.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Correct Answer!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Incorrect Answer</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed">{lastResult.explanation}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 border-t border-slate-100 flex justify-end">
            {!lastResult ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null || submitting}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-md shadow-brand-500/20"
              >
                {submitting ? 'Checking...' : 'Submit Answer'}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors shadow-md shadow-brand-500/20 flex items-center"
              >
                Next Adaptive Question <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
