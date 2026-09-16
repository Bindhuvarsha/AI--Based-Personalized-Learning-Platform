import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useMobileNav } from '../context/MobileNavContext';
import {
  LayoutDashboard, Brain, Mic, Bot, Compass, GitBranch,
  Zap, Code, Camera, FileCheck, Activity, ShieldAlert,
  Map, FileText, Trophy, Users, Calendar, Shield, UserCheck,
  BarChart3, Target, History, ClipboardList, Route, Lightbulb,
  X, BookOpen
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const { isDrawerOpen, closeDrawer } = useMobileNav();

  const sections = [
    {
      title: 'Home & Overview',
      links: [
        { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
        { to: '/analytics', label: 'Analytics', icon: BarChart3 },
        { to: '/profile', label: t('nav.profile'), icon: UserCheck },
      ]
    },
    {
      title: 'Core Learning & AI',
      links: [
        { to: '/mentor', label: t('nav.mentor'), icon: Brain, badge: 'AI' },
        { to: '/voice-tutor', label: t('nav.voiceTutor'), icon: Mic, badge: 'Voice' },
        { to: '/tutor', label: t('nav.tutor'), icon: Bot },
        { to: '/courses', label: t('nav.courses'), icon: Compass },
        { to: '/roadmap', label: 'Learning Roadmap', icon: Route },
        { to: '/recommendations', label: 'AI Recommendations', icon: Lightbulb },
      ]
    },
    {
      title: 'Practice & Mastery',
      links: [
        { to: '/knowledge-graph', label: t('nav.knowledgeGraph'), icon: GitBranch },
        { to: '/assessment', label: 'Assessment', icon: ClipboardList },
        { to: '/quiz/adaptive', label: t('nav.adaptiveQuiz'), icon: Zap },
        { to: '/quiz/history', label: 'Quiz History', icon: History },
        { to: '/coding-tutor', label: t('nav.codingTutor'), icon: Code },
        { to: '/image-solver', label: t('nav.imageSolver'), icon: Camera },
        { to: '/assignments', label: t('nav.assignments'), icon: FileCheck },
      ]
    },
    {
      title: 'Career & Analytics',
      links: [
        { to: '/career-roadmap', label: t('nav.careerRoadmap'), icon: Map },
        { to: '/resume-analyzer', label: t('nav.resumeAnalyzer'), icon: FileText },
        { to: '/behavior', label: t('nav.behaviorPrediction'), icon: Activity },
        { to: '/early-warning', label: t('nav.earlyWarning'), icon: ShieldAlert },
      ]
    },
    {
      title: 'Community & Goals',
      links: [
        { to: '/gamification', label: t('nav.gamification'), icon: Trophy },
        { to: '/study-groups', label: t('nav.studyGroups'), icon: Users },
        { to: '/study-planner', label: t('nav.studyPlanner'), icon: Calendar },
        { to: '/study-plan', label: 'Study Plan', icon: Target },
      ]
    }
  ];

  const renderNavLinks = (onLinkClick?: () => void) => (
    <nav className="space-y-5 flex-1">
      {sections.map((section, sIdx) => (
        <div key={sIdx} className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {section.title}
          </p>
          {section.links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onLinkClick}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1020] active:scale-[0.98] ${
                    isActive
                      ? 'bg-indigo-600/35 border-l-2 border-indigo-400 text-white font-semibold shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.07] active:bg-white/[0.10]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon 
                        className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isActive ? 'text-indigo-300' : 'text-indigo-400/80 group-hover:text-indigo-300'
                        }`} 
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span 
                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex-shrink-0 ml-1.5 transition-colors ${
                          isActive
                            ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/40'
                            : 'bg-white/[0.08] text-indigo-300 border border-white/[0.1] group-hover:bg-indigo-500/20'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      ))}

      {/* Admin Console */}
      <div className="pt-3 border-t border-white/[0.12]">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-violet-300/80 mb-1">
          Administration
        </p>
        <NavLink
          to="/admin"
          onClick={onLinkClick}
          className={({ isActive }) =>
            `group flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1020] active:scale-[0.98] ${
              isActive
                ? 'bg-violet-600/35 border-l-2 border-violet-400 text-white font-semibold shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                : 'text-slate-300 hover:text-white hover:bg-violet-500/15 active:bg-violet-500/20'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Shield 
                className={`w-4 h-4 flex-shrink-0 transition-colors ${
                  isActive ? 'text-violet-300' : 'text-violet-400 group-hover:text-violet-300'
                }`} 
              />
              <span className="truncate">Admin Console</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar (Hidden on mobile) */}
      <aside 
        style={{ backgroundColor: '#0B1020', borderColor: 'rgba(255, 255, 255, 0.12)' }}
        className="hidden md:flex w-64 border-r min-h-[calc(100vh-4rem)] flex-col p-4 flex-shrink-0 overflow-y-auto select-none"
      >
        {renderNavLinks()}
      </aside>

      {/* 2. Mobile Slide-Over Drawer Navigation */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 md:hidden flex"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Slide Drawer Content */}
          <div 
            style={{ backgroundColor: '#0B1020', borderColor: 'rgba(255, 255, 255, 0.15)' }}
            className="relative w-72 max-w-[85vw] border-r flex flex-col p-4 z-50 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-200 select-none"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <Link 
                to={user ? "/dashboard" : "/"} 
                onClick={closeDrawer}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="text-base font-extrabold text-white">
                  LearnPath <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">AI</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close navigation drawer"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            {renderNavLinks(closeDrawer)}

            {/* Mobile Footer User Info */}
            {user && (
              <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <div className="truncate">
                  <p className="text-white font-semibold truncate">{user.fullName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 font-bold border border-violet-500/30">
                    Admin
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
