import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useMobileNav } from '../context/MobileNavContext';
import { LanguagePreference } from '../types';
import { Flame, LogOut, User as UserIcon, ShieldCheck, Globe, Bell, Menu, Users, ChevronDown } from 'lucide-react';

export const RobotLogo: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="44" height="44" rx="12" fill="url(#bot-grad)" />
    {/* Antenna */}
    <circle cx="22" cy="8.5" r="1.5" fill="white" />
    <path d="M22 10V13" stroke="white" strokeWidth="2" strokeLinecap="round" />
    {/* Head */}
    <rect x="10.5" y="13" width="23" height="19" rx="6" fill="white" />
    {/* Screen / Eye area */}
    <rect x="14.5" y="16.5" width="4.5" height="8" rx="2" fill="url(#bot-grad)" />
    <rect x="25" y="16.5" width="4.5" height="8" rx="2" fill="url(#bot-grad)" />
    {/* Chin / mouth notch */}
    <rect x="18" y="27" width="8" height="2" rx="1" fill="url(#bot-grad)" />
    <defs>
      <linearGradient id="bot-grad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0070F3" />
        <stop offset="1" stopColor="#6366F1" />
      </linearGradient>
    </defs>
  </svg>
);

const NAV_ITEMS = [
  { name: 'Home', id: 'home' },
  { name: 'Features', id: 'features' },
  { name: 'How It Works', id: 'how-it-works' },
  { name: 'About', id: 'about' },
  { name: 'Contact', id: 'contact' },
];

export const Navbar: React.FC = () => {
  const { user, logout, isTeacher, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toggleDrawer } = useMobileNav();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const [activeSection, setActiveSection] = useState<string>('home');

  // Handle active section on scroll
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 250) {
        setActiveSection('home');
        return;
      }

      const sections = ['contact', 'about', 'how-it-works', 'features'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleNavClick = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveSection(sectionId);

    if (isHomePage) {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(sectionId === 'home' ? '/' : `/#${sectionId}`);
      setTimeout(() => {
        if (sectionId === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left: Mobile Hamburger + Logo */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {user && (
              <button
                type="button"
                onClick={toggleDrawer}
                aria-label="Open Navigation Menu"
                className="md:hidden p-2 -ml-1.5 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 active:scale-95 transition-all focus:outline-none"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link 
              to={user ? "/dashboard" : "/"} 
              onClick={(e) => {
                if (!user && isHomePage) {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setActiveSection('home');
                }
              }}
              className="group flex items-center space-x-3 focus-visible:outline-none"
            >
              <RobotLogo className="w-10 h-10 shadow-xs transition-transform group-hover:scale-105" />
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                LearnPath <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">AI</span>
              </span>
            </Link>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => {
              const isActive = isHomePage && activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => handleNavClick(item.id, e)}
                  className={`text-sm py-2 relative transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 font-medium'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-blue-600 rounded-full transition-all" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Navigation Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-1.5 text-slate-700 text-sm font-medium bg-transparent px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              <Globe className="w-4 h-4 text-slate-700 flex-shrink-0" />
              <div className="relative flex items-center">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as LanguagePreference)}
                  aria-label="Select Language"
                  className="bg-transparent font-semibold focus:outline-none cursor-pointer text-slate-800 text-sm appearance-none pr-4"
                >
                  <option value="ENGLISH">EN</option>
                  <option value="KANNADA">KN</option>
                  <option value="HINDI">HI</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-0 pointer-events-none" />
              </div>
            </div>

            {user ? (
              <>
                <Link
                  to="/early-warning"
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
                  title="Alerts & Warnings"
                  aria-label="Alerts and Warnings"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                </Link>

                <div className="hidden sm:flex items-center px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-semibold space-x-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>5-Day Streak</span>
                </div>

                {isAdmin && (
                  <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-violet-500/10 text-violet-900 border border-violet-500/20">
                    <ShieldCheck className="w-3 h-3 mr-1 text-violet-600" />
                    Admin
                  </span>
                )}

                {isTeacher && !isAdmin && (
                  <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-indigo-500/10 text-indigo-900 border border-indigo-500/20">
                    <Users className="w-3 h-3 mr-1 text-indigo-600" />
                    Teacher
                  </span>
                )}

                <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
                  <div className="hidden xl:flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-900 leading-tight">{user.fullName}</span>
                    <span className="text-[10px] text-slate-500 truncate max-w-[150px]">{user.email}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
                    title={t('nav.profile')}
                    aria-label={t('nav.profile')}
                  >
                    <UserIcon className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 outline-none"
                    title={t('nav.logout')}
                    aria-label={t('nav.logout')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm px-5 py-2.5 rounded-full transition-colors whitespace-nowrap"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all flex items-center space-x-1.5 shadow-sm shadow-blue-500/25 whitespace-nowrap group"
                >
                  <span>Get Started</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
