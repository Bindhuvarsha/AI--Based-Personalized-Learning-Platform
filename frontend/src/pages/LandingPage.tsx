import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket,
  Play,
  Sparkles,
  Target,
  Brain,
  Map,
  Bot,
  Star,
  CheckCircle2,
  GitBranch,
  LineChart,
  Award,
  Layers,
  Compass,
  FileText,
  Mail,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  ShieldCheck,
  Smartphone,
  Globe2
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

const StatGradIcon = () => (
  <svg viewBox="0 0 32 32" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4L3 11L16 18L29 11L16 4Z" fill="url(#grad-blue)" stroke="#2563EB" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 15V22C8 25 11.5 27.5 16 27.5C20.5 27.5 24 25 24 22V15" fill="url(#grad-blue-sub)" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M29 11V20" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="grad-blue" x1="3" y1="4" x2="29" y2="18" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#4F46E5" />
      </linearGradient>
      <linearGradient id="grad-blue-sub" x1="8" y1="15" x2="24" y2="27.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60A5FA" />
        <stop offset="1" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
  </svg>
);

const StatBookIcon = () => (
  <svg viewBox="0 0 32 32" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 6C8 6 12 7.5 16 10C20 7.5 24 6 27 6V23C24 23 20 24.5 16 27C12 24.5 8 23 5 23V6Z" fill="url(#grad-book)" stroke="#2563EB" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M16 10V27" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M20 12C22 11.5 24 11 25 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    <defs>
      <linearGradient id="grad-book" x1="5" y1="6" x2="27" y2="27" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
  </svg>
);

const StatStarIcon = () => (
  <svg viewBox="0 0 32 32" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 3L19.8 11.2L29 12.3L22.2 18.5L24 27.5L16 22.8L8 27.5L9.8 18.5L3 12.3L12.2 11.2L16 3Z" fill="url(#grad-star)" stroke="#2563EB" strokeWidth="1.5" strokeLinejoin="round" />
    <defs>
      <linearGradient id="grad-star" x1="3" y1="3" x2="29" y2="27.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
  </svg>
);

const StatHeartIcon = () => (
  <svg viewBox="0 0 32 32" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M27.2 6.8C24.4 4 19.8 4 17 6.8L16 7.8L15 6.8C12.2 4 7.6 4 4.8 6.8C2 9.6 2 14.2 4.8 17L16 28.2L27.2 17C30 14.2 30 9.6 27.2 6.8Z" fill="url(#grad-heart)" stroke="#2563EB" strokeWidth="1.5" strokeLinejoin="round" />
    <defs>
      <linearGradient id="grad-heart" x1="2" y1="4" x2="30" y2="28.2" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
  </svg>
);

const featurePillars = [
  {
    icon: Target,
    title: 'Personalized Learning',
    description: 'Adaptive paths based on your strengths and goals.',
    circleBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    icon: Brain,
    title: 'Skill Assessment',
    description: 'Identify gaps and track your progress.',
    circleBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
  },
  {
    icon: Map,
    title: 'Smart Roadmaps',
    description: 'Get guided learning paths with prerequisites.',
    circleBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
  },
  {
    icon: Bot,
    title: 'AI Tutor',
    description: 'Learn with an AI tutor using your study materials.',
    circleBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    icon: Star,
    title: 'ML Recommendations',
    description: 'Get the right resources at the right time.',
    circleBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
];

const detailedFeatures = [
  {
    icon: Target,
    title: 'Adaptive Diagnostic Quizzes',
    description: '3-tier dynamic difficulty calibration that automatically adjusts in real-time based on your consecutive answers.',
    tag: 'Dynamic Difficulty',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 text-blue-600',
    route: '/quiz/adaptive',
  },
  {
    icon: GitBranch,
    title: 'Prerequisite Knowledge Graphs',
    description: 'Directed graph roadmap algorithms prevent learning bottlenecks by sequencing prerequisites before complex topics.',
    tag: 'Dependency Graphs',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 text-emerald-600',
    route: '/roadmap',
  },
  {
    icon: Bot,
    title: 'Multilingual RAG AI Tutor',
    description: 'Upload your PDF and text notes to receive grounded, Socratic tutoring with exact verifiable document citations.',
    tag: 'RAG Retrieval',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 text-violet-600',
    route: '/tutor',
  },
  {
    icon: LineChart,
    title: 'Mastery & Struggle Analytics',
    description: 'Real-time telemetry tracking quiz trends, mastery gaps, burnout probability, and active study velocity.',
    tag: 'Predictive ML',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50 text-amber-600',
    route: '/analytics',
  },
  {
    icon: Sparkles,
    title: 'Scikit-Learn Recommendation Engine',
    description: 'Random Forest & KMeans models analyze your learning history to suggest tailored videos, courses, and practice questions.',
    tag: 'RandomForest & KMeans',
    color: 'from-cyan-500 to-blue-600',
    bg: 'bg-cyan-50 text-cyan-600',
    route: '/recommendations',
  },
  {
    icon: Award,
    title: 'Verifiable Certificates & Resume Match',
    description: 'Earn cryptographic SHA-256 verifiable certificates and analyze skill gaps against target industry job descriptions.',
    tag: 'Verifiable SHA-256',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50 text-rose-600',
    route: '/certificates',
  },
];

const steps = [
  {
    number: '01',
    title: 'Baseline Diagnostic Assessment',
    desc: 'Take an initial adaptive quiz to benchmark your existing skills. Our system immediately pinpoints knowledge gaps across each subject.',
    icon: Compass,
    accent: 'bg-blue-500 text-white',
  },
  {
    number: '02',
    title: 'AI Builds Your Prerequisite Roadmap',
    desc: 'Knowledge graph algorithms construct a step-by-step personalized curriculum, locking advanced concepts until fundamentals are mastered.',
    icon: Map,
    accent: 'bg-indigo-500 text-white',
  },
  {
    number: '03',
    title: 'Study with RAG AI Tutor & Voice Chat',
    desc: 'Upload study notes for instant summaries, ask questions to the grounded RAG AI tutor, or practice hands-on coding exercises.',
    icon: Bot,
    accent: 'bg-purple-500 text-white',
  },
  {
    number: '04',
    title: 'Continuous ML Adaptation & Certification',
    desc: 'Scikit-Learn models recalibrate your difficulty in real time. Complete your curriculum to receive verifiable certificates.',
    icon: Award,
    accent: 'bg-emerald-500 text-white',
  },
];

const faqs = [
  {
    q: 'How does the AI personalize my study plan?',
    a: 'LearnPath AI combines prerequisite graph roadmaps with scikit-learn recommendation models (RandomForest and KMeans). Every quiz answer recalibrates your mastery level (Weak, Developing, Proficient, Advanced) and adjusts future recommendations accordingly.',
  },
  {
    q: 'What is the RAG AI Study Tutor?',
    a: 'Retrieval-Augmented Generation (RAG) indexes your uploaded PDFs and notes into a semantic vector store. When you ask a question, the AI retrieves exact passages from your materials and provides citations alongside explanations.',
  },
  {
    q: 'Are the demo accounts ready to use immediately?',
    a: 'Yes! Pre-seeded accounts for Student (student@example.com), Teacher (teacher@example.com), and Admin (admin@example.com) are built into the database for immediate one-click testing.',
  },
  {
    q: 'Can instructors track classroom cohorts?',
    a: 'Absolutely. The Teacher Dashboard provides cohort score bell curves, concept bottleneck telemetry, at-risk student early warning detection, and one-click remedial interventions.',
  },
];

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Hero Section (#home) */}
      <section id="home" className="relative overflow-hidden bg-white pt-6 pb-8 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-16">
        {/* Soft background ambient gradient washes */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute top-0 right-1/4 w-[38rem] h-[38rem] bg-gradient-to-br from-cyan-100/40 via-sky-100/30 to-transparent rounded-full blur-3xl -z-10" 
        />
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute -top-10 left-10 w-[28rem] h-[28rem] bg-indigo-50/50 rounded-full blur-3xl -z-10" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-5 text-left">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-indigo-50/80 border border-indigo-100/90 rounded-full px-4 py-1.5 mb-6 shadow-xs">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs sm:text-sm font-semibold text-indigo-900">
                  Powered by Real ML Models &amp; RAG Architecture
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-[#0B1536] leading-[1.12] mb-6">
                Learn Smarter with{' '}
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI-Powered
                </span>
                <span>Personalization</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                Adaptive skill assessments, knowledge-gap analysis, prerequisite roadmaps, an AI tutor grounded in your study materials, and ML-driven recommendations — all in one platform.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all group"
                >
                  <Rocket className="w-4 h-4 fill-white text-white" />
                  <span>Start Learning Free</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    const demoEl = document.getElementById('demo-credentials');
                    if (demoEl) demoEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 font-semibold text-sm shadow-xs transition-all hover:border-slate-300"
                >
                  <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-white">
                    <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                  </div>
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>

            {/* Right Illustration & Floating Cards */}
            <div className="lg:col-span-7 flex justify-center items-center relative">
              <div className="w-full relative max-w-2xl">
                <img 
                  src="/hero-illustration-clean.png" 
                  alt="LearnPath AI Assistant and Learner" 
                  className="w-full h-auto object-contain drop-shadow-sm select-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Features Pillars Section */}
      <section className="py-8 bg-white relative border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-100 gap-6 md:gap-0 py-2">
            {featurePillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center px-4 py-3 group">
                  <div className={`w-14 h-14 rounded-full ${item.circleBg} flex items-center justify-center mb-3 transition-transform group-hover:scale-110 shadow-xs`}>
                    <Icon className={`w-7 h-7 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Stats Banner */}
      <section className="py-6 sm:py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#EEF4FF] border border-blue-100/60 rounded-3xl p-6 sm:p-7 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
            {/* 4 Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 divide-slate-200/50 sm:divide-x w-full lg:w-auto flex-1">
              {/* Stat 1 */}
              <div className="flex items-center space-x-3.5 sm:pr-4 lg:pr-6">
                <div className="flex-shrink-0">
                  <StatGradIcon />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 leading-none mb-1">1K+</div>
                  <div className="text-xs text-slate-500 font-medium">Active Learners</div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center space-x-3.5 sm:px-4 lg:px-6">
                <div className="flex-shrink-0">
                  <StatBookIcon />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 leading-none mb-1">500+</div>
                  <div className="text-xs text-slate-500 font-medium">Study Materials</div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center space-x-3.5 sm:px-4 lg:px-6">
                <div className="flex-shrink-0">
                  <StatStarIcon />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 leading-none mb-1">95%</div>
                  <div className="text-xs text-slate-500 font-medium">Success Rate</div>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex items-center space-x-3.5 sm:px-4 lg:px-6">
                <div className="flex-shrink-0">
                  <StatHeartIcon />
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900 leading-none mb-1">24/7</div>
                  <div className="text-xs text-slate-500 font-medium">Learning Support</div>
                </div>
              </div>
            </div>

            {/* Handwritten callout script */}
            <div className="flex-shrink-0 flex items-center justify-center lg:border-l lg:border-blue-200/60 lg:pl-6">
              <img 
                src="/handwritten-callout-transparent.png" 
                alt="Your Learning Journey, Powered by AI" 
                className="h-16 sm:h-18 w-auto object-contain select-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: Features (#features) */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 bg-slate-50/70 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full AI Learning Suite</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Everything You Need to Master Any Subject
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Explore our core capabilities powered by Spring Boot 3 enterprise backends, FastAPI machine learning microservices, and scikit-learn recommendation algorithms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detailedFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-2xl ${feat.bg} flex items-center justify-center transition-transform group-hover:scale-105`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                        {feat.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {feat.description}
                    </p>
                  </div>

                  <Link
                    to={feat.route}
                    className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 pt-4 border-t border-slate-100 group-hover:translate-x-1 transition-all"
                  >
                    <span>Try Feature</span>
                    <span className="ml-1.5">→</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: How It Works (#how-it-works) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
              <Compass className="w-3.5 h-3.5" />
              <span>Simple 4-Step Methodology</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              How LearnPath AI Guides Your Journey
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              From your initial diagnostic assessment to verifiable certification, our intelligent workflow adapts to your personal learning velocity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-50/80 rounded-3xl p-6 border border-slate-200/70 hover:bg-white hover:shadow-md transition-all relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-10 h-10 rounded-xl ${st.accent} flex items-center justify-center font-bold text-sm shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-black text-slate-300">
                        {st.number}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-2.5">
                      {st.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-slate-200/60 flex items-center text-xs font-semibold text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
                    <span>Automated step</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all"
            >
              <span>Get Started in 60 Seconds</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: About (#about) */}
      {/* ========================================================================= */}
      <section id="about" className="py-20 bg-slate-50/70 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6 text-left">
              <div className="inline-flex items-center space-x-2 bg-purple-50 border border-purple-200/70 text-purple-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
                <Brain className="w-3.5 h-3.5" />
                <span>About LearnPath AI</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-5 leading-tight">
                Designed for Autonomous, High-Retention Learning
              </h2>
              <p className="text-base text-slate-600 leading-relaxed mb-6">
                Traditional education forces every student through the exact same syllabus at the exact same pace. LearnPath AI re-imagines learning by treating education as a dynamic graph of concepts.
              </p>
              <p className="text-base text-slate-600 leading-relaxed mb-8">
                By diagnosing prerequisite gaps early, grounding study notes with semantic RAG vectors, and offering Socratic AI explanations in multiple languages, students achieve genuine mastery without frustration.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <Cpu className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Deterministic ML Fallback</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Works 100% offline without mandatory cloud API keys.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Enterprise Security</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Stateless JWT tokens, BCrypt salting, role-based authorization.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <Globe2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Multilingual Ecosystem</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Native translations in English, Hindi, and Kannada.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                  <Smartphone className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">PWA &amp; Mobile Ready</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Installable web app and native Capacitor mobile support.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Tech Architecture Cards */}
            <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Production Monorepo Architecture</h3>
              <p className="text-xs text-slate-500 mb-4">A high-performance decoupled multi-tier stack:</p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-blue-900">Spring Boot 3 &amp; Java 21</div>
                    <div className="text-[11px] text-blue-700">Enterprise core, REST controllers, Spring Data JPA, JWT security</div>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800">Port 8080</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald-900">FastAPI &amp; Python 3.14</div>
                    <div className="text-[11px] text-emerald-700">PyMuPDF parsing, scikit-learn recommendation models, semantic vectors</div>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">Port 8000</span>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-purple-900">React 18 + Vite + Tailwind</div>
                    <div className="text-[11px] text-purple-700">Single Page Application, Recharts visual analytics, Lucide icons</div>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800">Port 3000</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-amber-900">PostgreSQL 16 &amp; In-Memory H2</div>
                    <div className="text-[11px] text-amber-700">Auto-migrating Hibernate DDL with comprehensive seed data</div>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800">Port 5432</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: Contact (#contact) */}
      {/* ========================================================================= */}
      <section id="contact" className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
              <Mail className="w-3.5 h-3.5" />
              <span>Get in Touch</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Have Questions or Feedback? We're Here to Help
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Reach out to our support team or explore the frequently asked questions below.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* Contact Form */}
            <div className="lg:col-span-6 bg-slate-50/80 p-8 rounded-3xl border border-slate-200/80">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Send Us a Message</h3>
              <p className="text-xs text-slate-500 mb-6">We typically respond to inquiries within 2 hours.</p>

              {contactSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900">Message Received!</h4>
                  <p className="text-xs text-emerald-700">Thank you for reaching out. A learning specialist will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Topic</label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option>General Inquiry</option>
                      <option>Curriculum / Teacher Integration</option>
                      <option>Technical Question / Bug Report</option>
                      <option>Feature Request</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us what you need help with..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center space-x-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm shadow-blue-500/25"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>

            {/* FAQs Accordion */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Frequently Asked Questions</h3>
              <p className="text-xs text-slate-500 mb-6">Quick answers to common questions about LearnPath AI.</p>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-bold text-slate-900 hover:bg-slate-50/60 transition-colors"
                      >
                        <span className="pr-4">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Direct Support Card */}
              <div className="mt-8 p-5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-blue-900">Need Immediate Help?</div>
                  <div className="text-[11px] text-blue-700">Our RAG AI Tutor is ready to answer questions 24/7.</div>
                </div>
                <Link
                  to="/tutor"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors whitespace-nowrap shadow-xs"
                >
                  Open AI Tutor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Credentials Section (#demo-credentials) */}
      <section id="demo-credentials" className="py-16 bg-slate-50/70 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ready-to-Use Accounts</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Quick Demo Access</h2>
          <p className="text-sm text-slate-600 mb-8 max-w-xl mx-auto">
            Experience the platform from different perspectives with pre-seeded role credentials:
          </p>

          <div className="grid sm:grid-cols-3 gap-5 text-left">
            {/* Student */}
            <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">ST</div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Student Account</h4>
                  <p className="text-[11px] text-emerald-600 font-medium">Full learner suite</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 font-mono text-xs text-slate-700 space-y-1 mb-4">
                <div>student@example.com</div>
                <div>Student@123</div>
              </div>
              <Link
                to="/login"
                className="w-full inline-flex justify-center items-center py-2 px-3 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                Login as Student
              </Link>
            </div>

            {/* Teacher */}
            <div className="bg-white border border-indigo-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">TC</div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Teacher Account</h4>
                  <p className="text-[11px] text-indigo-600 font-medium">Cohort analytics</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 font-mono text-xs text-slate-700 space-y-1 mb-4">
                <div>teacher@example.com</div>
                <div>Teacher@123</div>
              </div>
              <Link
                to="/login"
                className="w-full inline-flex justify-center items-center py-2 px-3 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                Login as Teacher
              </Link>
            </div>

            {/* Admin */}
            <div className="bg-white border border-purple-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs">AD</div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Admin Account</h4>
                  <p className="text-[11px] text-purple-600 font-medium">Curriculum management</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 font-mono text-xs text-slate-700 space-y-1 mb-4">
                <div>admin@example.com</div>
                <div>Admin@123</div>
              </div>
              <Link
                to="/login"
                className="w-full inline-flex justify-center items-center py-2 px-3 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors"
              >
                Login as Admin
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-100 text-slate-500 py-8 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900">LearnPath AI</span>
            <span>—</span>
            <span>AI-Based Personalized Learning Platform</span>
          </div>
          <p>© 2026 LearnPath AI. React + Spring Boot 3 + FastAPI + Scikit-Learn.</p>
        </div>
      </footer>
    </div>
  );
};
