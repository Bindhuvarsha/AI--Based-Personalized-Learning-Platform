import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Sparkles, ArrowRight, Brain, BookOpen, Target } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [preferredDifficulty, setPreferredDifficulty] = useState('INTERMEDIATE');
  const [preferredLanguage, setPreferredLanguage] = useState('ENGLISH');
  const [learningGoals, setLearningGoals] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put('/profile', {
        educationLevel,
        preferredDifficulty,
        preferredLanguage,
        learningGoals,
        weeklyStudyTargetMinutes: 600,
        subjectsOfInterest: ['Computer Science'],
        currentSkills: ['Basics'],
      });
      showToast('Profile setup complete! Welcome aboard.', 'success');
      navigate('/assessment');
    } catch (err) {
      showToast('Setup failed, continuing to dashboard', 'info');
      navigate('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Personalize Your Experience</h1>
          <p className="text-xs text-slate-500 mt-1">
            Let's tune the AI tutor and recommendation models to your exact background.
          </p>
        </div>

        <form onSubmit={handleFinish} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Education Background</label>
            <select
              value={educationLevel}
              onChange={e => setEducationLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white"
            >
              <option value="High School">High School</option>
              <option value="Undergraduate">Undergraduate Student</option>
              <option value="Postgraduate">Graduate / Master's Student</option>
              <option value="Working Professional">Working Professional</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Difficulty</label>
              <select
                value={preferredDifficulty}
                onChange={e => setPreferredDifficulty(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white"
              >
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">AI Tutor Language</label>
              <select
                value={preferredLanguage}
                onChange={e => setPreferredLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white"
              >
                <option value="ENGLISH">English</option>
                <option value="HINDI">Hindi (हिंदी)</option>
                <option value="KANNADA">Kannada (ಕನ್ನಡ)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">What is your primary goal?</label>
            <textarea
              value={learningGoals}
              onChange={e => setLearningGoals(e.target.value)}
              placeholder="e.g. Prepare for technical interviews and build full-stack AI applications."
              rows={2}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors shadow-sm inline-flex items-center justify-center space-x-1.5"
          >
            <span>{submitting ? 'Saving...' : 'Complete Setup & Take Diagnostic'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
