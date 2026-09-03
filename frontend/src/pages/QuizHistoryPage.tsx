import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { QuizHistoryItem } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { FileQuestion, CheckCircle2, XCircle, Clock, Calendar, ChevronRight, Brain } from 'lucide-react';

export const QuizHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const resp = await api.get('/quizzes/history');
        setHistory(resp.data);
      } catch (err) {
        console.error('Failed to load quiz history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <LoadingSpinner message="Loading your quiz history..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
          <FileQuestion className="w-6 h-6 text-brand-600" />
          <span>Quiz Attempt History</span>
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Review your past test scores, mastery progression, and time spent per topic.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No quizzes taken yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Choose a course topic or follow your roadmap to attempt your first adaptive quiz.
          </p>
          <Link
            to="/roadmap"
            className="mt-4 inline-block px-5 py-2.5 bg-brand-600 text-white text-xs font-semibold rounded-xl hover:bg-brand-700 shadow-sm"
          >
            Explore Roadmap
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Completed Attempts ({history.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Topic</th>
                  <th className="p-3.5">Score</th>
                  <th className="p-3.5">Percentage</th>
                  <th className="p-3.5">Result</th>
                  <th className="p-3.5">Time Spent</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map(item => (
                  <tr key={item.attemptId} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{item.topicTitle}</td>
                    <td className="p-3.5 text-slate-700">{item.score} / {item.totalQuestions}</td>
                    <td className="p-3.5 font-semibold text-slate-900">{item.percentage.toFixed(0)}%</td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.passed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {item.passed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{item.passed ? 'Passed' : 'Failed'}</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{item.timeSpentSeconds || 0}s</td>
                    <td className="p-3.5 text-slate-500">
                      {new Date(item.completedAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right">
                      {item.topicId && (
                        <Link
                          to={`/quiz/${item.topicId}`}
                          className="inline-flex items-center space-x-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                        >
                          <span>Retake</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
