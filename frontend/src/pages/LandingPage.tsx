import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Target, BarChart3, Bot, Sparkles, ArrowRight, Zap, Shield, Users } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden text-slate-900 py-20 sm:py-28">
        {/* Glow blobs */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[42rem] h-[42rem] bg-gradient-to-br from-indigo-400/20 via-violet-400/15 to-transparent rounded-full blur-3xl -z-10" 
        />
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute top-1/2 -right-40 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl -z-10" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-md border border-indigo-200/60 rounded-full px-4 py-1.5 mb-6 shadow-xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs sm:text-sm font-semibold text-indigo-900">
                Powered by Real ML Models & RAG Architecture
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Learn Smarter with{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent">
                AI-Powered
              </span>{' '}
              Personalization
            </h1>

            <p className="text-base sm:text-lg text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Adaptive skill assessments, knowledge-gap analysis, prerequisite roadmaps, an AI tutor grounded in your study materials, and ML-driven recommendations — all in one platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="glass-btn-primary inline-flex items-center px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg group"
              >
                Start Learning Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3.5 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-white hover:text-indigo-600 shadow-xs transition-all"
              >
                Demo Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Everything You Need to Master Any Subject
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              A complete AI-powered learning ecosystem built with Spring Boot, FastAPI, React, and real scikit-learn models.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="glass-panel rounded-2xl p-6 card-hover border border-white/80">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 border border-indigo-200/50 flex items-center justify-center mb-4 text-indigo-600">
                    <Icon className="w-6 h-6" />
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
      <section className="py-16 relative z-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Quick Demo Access</h3>
          <p className="text-xs text-slate-500 mb-6">Development-only credentials. Use quick autofill on the login page.</p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="glass-btn-student rounded-2xl p-4 text-left shadow-xs">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-emerald-700" />
                <span className="text-sm font-bold text-emerald-900">Student Account</span>
              </div>
              <p className="text-xs text-emerald-800 font-mono">student@example.com</p>
              <p className="text-xs text-emerald-800 font-mono">Student@123</p>
            </div>
            <div className="glass-btn-admin rounded-2xl p-4 text-left shadow-xs">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-violet-700" />
                <span className="text-sm font-bold text-violet-900">Admin Account</span>
              </div>
              <p className="text-xs text-violet-800 font-mono">admin@example.com</p>
              <p className="text-xs text-violet-800 font-mono">Admin@123</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white/70 backdrop-blur-md border-t border-slate-200/70 text-slate-500 py-8 text-center text-xs">
        <p>© 2026 LearnPath AI. Full-stack platform: React + Spring Boot 3 + FastAPI + H2/PostgreSQL + scikit-learn.</p>
      </footer>
    </div>
  );
};
