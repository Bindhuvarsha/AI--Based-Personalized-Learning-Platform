import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Map,
  ClipboardCheck,
  Compass,
  FileQuestion,
  Bot,
  BarChart3,
  Sparkles,
  Calendar,
  Shield,
  UserCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { isAdmin } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/roadmap', label: 'Personal Roadmap', icon: Map },
    { to: '/assessment', label: 'Skill Assessments', icon: ClipboardCheck },
    { to: '/courses', label: 'Explore Courses', icon: Compass },
    { to: '/quiz/history', label: 'Quizzes & History', icon: FileQuestion },
    { to: '/tutor', label: 'RAG AI Tutor', icon: Bot },
    { to: '/analytics', label: 'Mastery Analytics', icon: BarChart3 },
    { to: '/recommendations', label: 'Recommendations', icon: Sparkles },
    { to: '/study-plan', label: 'Study Planner', icon: Calendar },
    { to: '/profile', label: 'My Profile', icon: UserCheck },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col p-4 flex-shrink-0">
      <nav className="space-y-1.5 flex-1">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-slate-200">
            <p className="px-3.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Administration
            </p>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-purple-50/50'
                }`
              }
            >
              <Shield className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span>Admin Management</span>
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
};
