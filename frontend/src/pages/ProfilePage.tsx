import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StudentProfile } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { User, BookOpen, Target, Clock, Globe, Award, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const [educationLevel, setEducationLevel] = useState('');
  const [learningGoals, setLearningGoals] = useState('');
  const [preferredDifficulty, setPreferredDifficulty] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('INTERMEDIATE');
  const [preferredLanguage, setPreferredLanguage] = useState<'ENGLISH' | 'HINDI' | 'KANNADA'>('ENGLISH');
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [subjectsText, setSubjectsText] = useState('');
  const [skillsText, setSkillsText] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const resp = await api.get('/profile');
        const p: StudentProfile = resp.data;
        setProfile(p);
        setEducationLevel(p.educationLevel || 'Undergraduate');
        setLearningGoals(p.learningGoals || '');
        setPreferredDifficulty(p.preferredDifficulty || 'INTERMEDIATE');
        setPreferredLanguage(p.preferredLanguage || 'ENGLISH');
        setWeeklyHours(Math.round((p.weeklyStudyTargetMinutes || 600) / 60));
        setSubjectsText(p.subjectsOfInterest ? p.subjectsOfInterest.join(', ') : '');
        setSkillsText(p.currentSkills ? p.currentSkills.join(', ') : '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        educationLevel,
        learningGoals,
        preferredDifficulty,
        preferredLanguage,
        weeklyStudyTargetMinutes: weeklyHours * 60,
        subjectsOfInterest: subjectsText.split(',').map(s => s.trim()).filter(Boolean),
        currentSkills: skillsText.split(',').map(s => s.trim()).filter(Boolean),
      };
      const resp = await api.put('/profile', payload);
      setProfile(resp.data);
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading learner profile..." />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
          <User className="w-6 h-6 text-brand-600" />
          <span>Learner Profile & Preferences</span>
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Configure your education level, skills, and language preferences to personalize your AI tutor and recommendations.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Education Level</label>
              <input
                type="text"
                value={educationLevel}
                onChange={e => setEducationLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="e.g. Undergraduate, High School, Professional"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Weekly Study Target (Hours)</label>
              <input
                type="number"
                min={1}
                max={60}
                value={weeklyHours}
                onChange={e => setWeeklyHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Preferred Difficulty</label>
              <select
                value={preferredDifficulty}
                onChange={e => setPreferredDifficulty(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white"
              >
                <option value="BEGINNER">BEGINNER</option>
                <option value="INTERMEDIATE">INTERMEDIATE</option>
                <option value="ADVANCED">ADVANCED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Preferred Language</label>
              <select
                value={preferredLanguage}
                onChange={e => setPreferredLanguage(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none bg-white"
              >
                <option value="ENGLISH">ENGLISH</option>
                <option value="HINDI">HINDI</option>
                <option value="KANNADA">KANNADA</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subjects of Interest (Comma separated)</label>
            <input
              type="text"
              value={subjectsText}
              onChange={e => setSubjectsText(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="e.g. Machine Learning, System Design, Python, Algorithms"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Skills & Technologies</label>
            <input
              type="text"
              value={skillsText}
              onChange={e => setSkillsText(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="e.g. Java, Git, SQL, HTML"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Primary Learning Goals</label>
            <textarea
              value={learningGoals}
              onChange={e => setLearningGoals(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none resize-none"
              placeholder="What do you want to accomplish on LearnPath AI?"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-50 inline-flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
