import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard, Brain, Mic, Bot, Compass, GitBranch,
  Zap, Code, Camera, FileCheck, Activity, ShieldAlert,
  Map, FileText, Trophy, Users, Calendar, Shield, UserCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();

  const sections = [
    {
      title: 'Core Learning & AI',
      links: [
        { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
        { to: '/mentor', label: t('nav.mentor'), icon: Brain, badge: 'AI' },
        { to: '/voice-tutor', label: t('nav.voiceTutor'), icon: Mic, badge: 'Voice' },
        { to: '/tutor', label: t('nav.tutor'), icon: Bot },
        { to: '/courses', label: t('nav.courses'), icon: Compass },
      ]
    },
    {
      title: 'Practice & Mastery',
      links: [
        { to: '/knowledge-graph', label: t('nav.knowledgeGraph'), icon: GitBranch },
        { to: '/quiz/adaptive', label: t('nav.adaptiveQuiz'), icon: Zap },
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
        { to: '/profile', label: t('nav.profile'), icon: UserCheck },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col p-4 flex-shrink-0 overflow-y-auto">
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
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0 text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}

        {isAdmin && (
          <div className="pt-3 border-t border-slate-200">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-1">
              Administration
            </p>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-purple-50/50'
                }`
              }
            >
              <Shield className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span>Admin Console</span>
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
};
