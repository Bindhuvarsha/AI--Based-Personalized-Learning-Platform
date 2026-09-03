import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { QuizDetails, QuizResult } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Brain, CheckCircle, XCircle, ChevronRight, ArrowLeft, RotateCcw, Award } from 'lucide-react';

export const QuizPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [quizDetails, setQuizDetails] = useState<QuizDetails | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [startTime] = useState<number>(Date.now());

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const resp = await api.get(`/quizzes/topic/${topicId}`);
        setQuizDetails(resp.data);
      } catch (err) {
        console.error('Failed to load quiz', err);
      } finally {
        setLoading(false);
      }
    };
    if (topicId) fetchQuiz();
  }, [topicId]);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmit = async () => {
    if (!quizDetails) return;
    setSubmitting(true);
    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    
    // Transform answers object to list of AnswerSubmission
    const answersList = Object.entries(selectedAnswers).map(([qId, optIdx]) => ({
      questionId: Number(qId),
      selectedOptionIndex: optIdx,
    }));

    try {
      const resp = await api.post(`/quizzes/submit`, {
        topicId: Number(topicId),
        answers: answersList,
        timeSpentSeconds: timeSpent,
      });
      setResult(resp.data);
    } catch (err) {
      console.error('Failed to submit quiz', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setSelectedAnswers({});
    setCurrentIdx(0);
    setLoading(true);
    api.get(`/quizzes/topic/${topicId}`)
      .then(resp => setQuizDetails(resp.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  if (loading) return <LoadingSpinner message="Generating adaptive quiz questions..." />;
  if (!quizDetails || !quizDetails.questions || quizDetails.questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
        <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800 mb-1">No Quiz Available</h2>
        <p className="text-sm text-slate-500 mb-4">No active quiz questions found for this topic.</p>
        <Link to="/courses" className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700">
          Back to Courses
        </Link>
      </div>
    );
  }

  // Quiz Results View
  if (result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3 ${
            result.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
          }`}>
            <Award className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {result.passed ? 'Quiz Passed! 🎉' : 'Needs Practice'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{result.feedbackMessage}</p>
          <div className="flex items-center justify-center space-x-6 my-6">
            <div className="text-center">
              <span className="text-2xl font-bold text-slate-900">{result.score}/{result.totalQuestions}</span>
              <p className="text-xs text-slate-400">Score</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-brand-600">{result.percentage}%</span>
              <p className="text-xs text-slate-400">Accuracy</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-violet-600">{result.nextDifficulty}</span>
              <p className="text-xs text-slate-400">Next Level</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRetry}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 inline-flex items-center space-x-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
            <Link
              to="/roadmap"
              className="px-5 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 inline-flex items-center space-x-1.5"
            >
              <span>View Learning Roadmap</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Detailed Answer Review */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">Question Review & Explanations</h2>
          {result.reviews && result.reviews.map((rev, idx) => (
            <div key={rev.questionId} className={`bg-white rounded-xl border p-4 ${
              rev.correct ? 'border-emerald-200' : 'border-red-200'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 mb-2">
                  {rev.correct ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                  <span className="text-xs font-bold text-slate-500">Question {idx + 1}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-900 mb-3">{rev.questionText}</p>
              <div className="grid sm:grid-cols-2 gap-2 text-xs mb-3">
                <div className={`p-2.5 rounded-lg ${
                  rev.correct ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                }`}>
                  <span className="font-semibold">Your Answer:</span> {rev.options[rev.selectedOptionIndex] || 'None'}
                </div>
                {!rev.correct && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800">
                    <span className="font-semibold">Correct Answer:</span> {rev.options[rev.correctOptionIndex]}
                  </div>
                )}
              </div>
              {rev.explanation && (
                <div className="bg-slate-50 rounded-lg p-2.5 text-xs text-slate-600 border border-slate-100">
                  <span className="font-semibold text-slate-700">Explanation:</span> {rev.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Quiz Taking View
  const currentQuestion = quizDetails.questions[currentIdx];
  const progressPercent = ((currentIdx + 1) / quizDetails.questions.length) * 100;
  const isAnswered = selectedAnswers[currentQuestion.id] !== undefined;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Quiz Top Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/courses" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-700">
          <ArrowLeft className="w-4 h-4 mr-1" /> Exit Quiz
        </Link>
        <span className="text-xs font-semibold bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full">
          Level: {quizDetails.currentDifficulty}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-slate-500">
          <span>Question {currentIdx + 1} of {quizDetails.questions.length}</span>
          <span>{quizDetails.topicTitle}</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-600 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-slate-900 leading-snug">
          {currentQuestion.questionText}
        </h2>

        <div className="space-y-2.5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQuestion.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(currentQuestion.id, idx)}
                className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/50 text-brand-900 ring-2 ring-brand-500/20 shadow-sm'
                    : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          Previous
        </button>

        {currentIdx < quizDetails.questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx(prev => Math.min(quizDetails.questions.length - 1, prev + 1))}
            disabled={!isAnswered}
            className="px-5 py-2 rounded-xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50 inline-flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isAnswered || submitting}
            className="px-6 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? 'Evaluating...' : 'Submit Quiz'}
          </button>
        )}
      </div>
    </div>
  );
};
