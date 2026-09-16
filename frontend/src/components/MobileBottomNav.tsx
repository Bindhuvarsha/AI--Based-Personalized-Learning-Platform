import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Brain, Route, Zap, Menu } from 'lucide-react';
import { useMobileNav } from '../context/MobileNavContext';
import { useLanguage } from '../context/LanguageContext';

export const MobileBottomNav: React.FC = () => {
  const { toggleDrawer, isDrawerOpen } = useMobileNav();
  const { t } = useLanguage();

  const navItems = [
    { to: '/dashboard', label: t('nav.dashboard') || 'Home', icon: LayoutDashboard },
    { to: '/mentor', label: t('nav.mentor') || 'AI Mentor', icon: Brain, isAi: true },
    { to: '/roadmap', label: 'Roadmap', icon: Route },
    { to: '/quiz/adaptive', label: 'Quizzes', icon: Zap },
  ];

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B1020]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 shadow-[0_-8px_20px_rgba(0,0,0,0.35)] safe-area-pb"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-indigo-400 font-semibold scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-indigo-400' : ''}`} />
                    {item.isAi && (
                      <span className="absolute -top-1 -right-2 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] mt-1 tracking-tight truncate max-w-[56px] text-center">
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 w-6 h-0.5 bg-indigo-400 rounded-full shadow-[0_0_8px_#818cf8]" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* More / Full Menu Button */}
        <button
          type="button"
          onClick={toggleDrawer}
          aria-label="Open Full Navigation Drawer"
          aria-expanded={isDrawerOpen}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            isDrawerOpen
              ? 'text-indigo-400 font-semibold scale-105'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg transition-colors ${isDrawerOpen ? 'bg-indigo-600/30' : ''}`}>
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight text-center">
            {isDrawerOpen ? 'Close' : 'More'}
          </span>
        </button>
      </div>
    </nav>
  );
};
