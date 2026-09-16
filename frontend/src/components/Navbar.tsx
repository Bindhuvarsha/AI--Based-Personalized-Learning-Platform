import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useMobileNav } from '../context/MobileNavContext';
import { LanguagePreference } from '../types';
import { Flame, LogOut, User as UserIcon, BookOpen, ShieldCheck, Globe, Bell, Menu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toggleDrawer } = useMobileNav();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 glass-nav transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Mobile Hamburger + Logo Area */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            {user && (
              <button
                type="button"
                onClick={toggleDrawer}
                aria-label="Open Navigation Menu"
                className="md:hidden p-2 -ml-1.5 rounded-xl text-slate-700 hover:text-indigo-600 hover:bg-white/80 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link 
              to={user ? "/dashboard" : "/"} 
              className="group flex items-center space-x-2 sm:space-x-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200 flex-shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-sm sm:text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                LearnPath <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">AI</span>
              </span>
            </Link>
          </div>

          {/* Right Navigation Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2.5">
            {/* Language Selector */}
            <div className="flex items-center space-x-1 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-xl px-1.5 sm:px-2 py-1 sm:py-1.5 text-xs text-slate-700 shadow-xs hover:border-slate-300 transition-colors">
              <Globe className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguagePreference)}
                aria-label="Select Language"
                className="bg-transparent font-medium focus:outline-none cursor-pointer text-slate-800 text-[11px] sm:text-xs max-w-[70px] sm:max-w-none truncate"
              >
                <option value="ENGLISH">EN</option>
                <option value="KANNADA">ಕನ್ನಡ</option>
                <option value="HINDI">हिन्दी</option>
              </select>
            </div>

            {user ? (
              <>
                <Link
                  to="/early-warning"
                  className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/80 transition-colors relative focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                  title="Alerts & Warnings"
                  aria-label="Alerts and Warnings"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                </Link>

                <div className="hidden sm:flex items-center px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-semibold space-x-1.5 backdrop-blur-xs">
                  <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>5-Day Streak</span>
                </div>

                {isAdmin && (
                  <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-violet-500/10 text-violet-900 border border-violet-500/20 backdrop-blur-xs">
                    <ShieldCheck className="w-3 h-3 mr-1 text-violet-600" />
                    Admin
                  </span>
                )}

                <div className="flex items-center space-x-1 sm:space-x-2 border-l border-slate-200/80 pl-1.5 sm:pl-2.5">
                  <div className="hidden xl:flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-900 leading-tight">{user.fullName}</span>
                    <span className="text-[10px] text-slate-500 truncate max-w-[160px]">{user.email}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none"
                    title={t('nav.profile')}
                    aria-label={t('nav.profile')}
                  >
                    <UserIcon className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-1.5 sm:p-2 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 outline-none"
                    title={t('nav.logout')}
                    aria-label={t('nav.logout')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-indigo-600 px-2 sm:px-3 py-1.5 rounded-xl hover:bg-white/60 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 outline-none whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold rounded-xl px-2.5 sm:px-3.5 py-1.5 glass-btn-primary focus-visible:outline-none whitespace-nowrap"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
