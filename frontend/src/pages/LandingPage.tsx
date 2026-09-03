import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Target, BarChart3, Bot, Sparkles, ArrowRight, Zap, Shield, Users } from 'lucide-react';
import { Navbar } from '../components/Navbar';

const features = [
  { icon: Brain, title: 'AI Skill Assessments', desc: 'Diagnose knowledge gaps with adaptive baseline tests that classify your mastery as Weak, Developing, Proficient, or Advanced.' },
  { icon: Target, title: 'Personalized Roadmaps', desc: 'Prerequisite-aware learning paths that auto-update after every quiz and assessment result.' },
  { icon: Bot, title: 'RAG AI Study Tutor', desc: 'Upload your PDF/TXT study notes and ask questions answered directly from your materials with source citations.' },
  { icon: BarChart3, title: 'Mastery Analytics', desc: 'Interactive Recharts dashboards tracking quiz trends, topic radar, study streaks, and knowledge distribution.' },
  { icon: Sparkles, title: 'ML Recommendations', desc: 'Scikit-learn RandomForest and KMeans models predict your next best topic, quiz, or review resource.' },
  { icon: Zap, title: 'Adaptive Quizzes', desc: 'Difficulty auto-adjusts based on your performance. Instant explanations and retry support included.' },
];

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzEuMTA1IDAgMiAuODk1IDIgMnMtLjg5NSAyLTIgMi0yLS44OTUtMi0yIC44OTUtMiAyLTJ6TTI0IDMwYzEuMTA1IDAgMiAuODk1IDIgMnMtLjg5NSAyLTIgMi0yLS44OTUtMi0yIC44OTUtMiAyLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-white/90">Powered by Real ML Models & RAG Architecture</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Learn Smarter with{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                AI-Powered
              </span>{' '}
              Personalization
            </h1>
            <p className="text-lg sm:text-xl text-blue-100/80 mb-10 leading-relaxed">
              Adaptive skill assessments, knowledge-gap analysis, prerequisite roadmaps, an AI tutor grounded in your study materials, and ML-driven recommendations — all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-3.5 rounded-xl bg-white text-brand-700 font-bold text-sm shadow-xl shadow-white/10 hover:bg-blue-50 transition-all group"
              >
                Start Learning Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3.5 rounded-xl border-2 border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all"
              >
                Demo Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Everything You Need to Master Any Subject</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">A complete AI-powered learning ecosystem built with Spring Boot, FastAPI, React, and real scikit-learn models.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 card-hover">
                  <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo Credentials */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Quick Demo Access</h3>
          <p className="text-sm text-slate-500 mb-6">⚠️ Development-only credentials. Do not use in production.</p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-800">Student</span>
              </div>
              <p className="text-xs text-emerald-700 font-mono">student@example.com</p>
              <p className="text-xs text-emerald-700 font-mono">Student@123</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-bold text-purple-800">Admin</span>
              </div>
              <p className="text-xs text-purple-700 font-mono">admin@example.com</p>
              <p className="text-xs text-purple-700 font-mono">Admin@123</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© 2026 LearnPath AI. Full-stack monorepo: React + Spring Boot 3 + FastAPI + PostgreSQL + scikit-learn.</p>
      </footer>
    </div>
  );
};
