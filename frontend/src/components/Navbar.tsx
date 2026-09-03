import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguagePreference } from '../types';
import { Flame, LogOut, User as UserIcon, BookOpen, ShieldCheck, Globe, Bell } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                LearnPath <span className="text-brand-600">AI</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguagePreference)}
                className="bg-transparent font-semibold focus:outline-none cursor-pointer text-slate-800"
              >
                <option value="ENGLISH">English</option>
                <option value="KANNADA">ಕನ್ನಡ (Kannada)</option>
                <option value="HINDI">हिन्दी (Hindi)</option>
              </select>
            </div>

            {user ? (
              <>
                <Link
                  to="/early-warning"
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
                  title="Alerts & Warnings"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                </Link>

                <div className="hidden sm:flex items-center px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold space-x-1.5">
                  <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>5-Day Streak</span>
                </div>

                {isAdmin && (
                  <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Admin
                  </span>
                )}

                <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
                  <div className="flex flex-col text-right hidden lg:block">
                    <span className="text-xs font-semibold text-slate-800">{user.fullName}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{user.email}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                    title={t('nav.profile')}
                  >
                    <UserIcon className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                    title={t('nav.logout')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-brand-600 px-3 py-2 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-3.5 py-2 rounded-lg shadow-sm transition-colors"
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
