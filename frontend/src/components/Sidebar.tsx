import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useMobileNav } from '../context/MobileNavContext';
import {
  LayoutDashboard, Brain, Mic, Bot, Compass, GitBranch,
  Zap, Code, Camera, FileCheck, Activity, ShieldAlert,
  Map, FileText, Trophy, Users, Calendar, Shield, UserCheck,
  BarChart3, Target, History, ClipboardList, Route, Lightbulb,
  X, BookOpen, Search, ChevronDown, ChevronRight,
  PanelLeftClose, PanelLeft, Sparkles
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  id: string;
  title: string;
  links: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();
  const { isDrawerOpen, closeDrawer } = useMobileNav();
  const location = useLocation();

  // Persist compact (rail) mode
  const [isCompact, setIsCompact] = useState<boolean>(() => {
    return localStorage.getItem('learnpath_sidebar_compact') === 'true';
  });

  const toggleCompact = () => {
    setIsCompact(prev => {
      const next = !prev;
      localStorage.setItem('learnpath_sidebar_compact', String(next));
      return next;
    });
  };

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Sections definition
  const sections: NavSection[] = useMemo(() => [
    {
      id: 'overview',
      title: 'Home & Overview',
      links: [
        { to: '/dashboard', label: t('nav.dashboard') || 'Dashboard', icon: LayoutDashboard },
        { to: '/analytics', label: 'Study Analytics', icon: BarChart3 },
        { to: '/profile', label: t('nav.profile') || 'My Profile', icon: UserCheck },
      ]
    },
    {
      id: 'ai_learning',
      title: 'AI Study Suite',
      links: [
        { to: '/mentor', label: t('nav.mentor') || 'AI Study Mentor', icon: Brain, badge: 'AI', badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
        { to: '/voice-tutor', label: t('nav.voiceTutor') || 'Multilingual Voice Tutor', icon: Mic, badge: 'Voice', badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
        { to: '/summarizer', label: 'AI Note Summarizer & Quiz', icon: BookOpen, badge: 'New', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
        { to: '/tutor', label: t('nav.tutor') || 'RAG Document Tutor', icon: Bot },
        { to: '/courses', label: t('nav.courses') || 'Explore Courses', icon: Compass },
        { to: '/roadmap', label: 'Personalized Roadmap', icon: Route },
        { to: '/recommendations', label: 'Smart Recommendations', icon: Lightbulb },
      ]
    },
    {
      id: 'practice',
      title: 'Practice & Mastery',
      links: [
        { to: '/knowledge-graph', label: t('nav.knowledgeGraph') || 'Prerequisite Graph', icon: GitBranch },
        { to: '/assessment', label: 'Diagnostic Assessment', icon: ClipboardList },
        { to: '/quiz/adaptive', label: t('nav.adaptiveQuiz') || 'Adaptive Practice Quiz', icon: Zap },
        { to: '/quiz/history', label: 'Quiz Performance History', icon: History },
        { to: '/coding-tutor', label: t('nav.codingTutor') || 'AI Coding Tutor', icon: Code },
        { to: '/image-solver', label: t('nav.imageSolver') || 'Visual Problem Solver', icon: Camera },
        { to: '/assignments', label: t('nav.assignments') || 'Project Assignments', icon: FileCheck },
      ]
    },
    {
      id: 'career',
      title: 'Career & Growth',
      links: [
        { to: '/certificates', label: 'Academic Certificates', icon: Trophy, badge: 'Verified', badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
        { to: '/career-roadmap', label: t('nav.careerRoadmap') || 'Target Career Pathways', icon: Map },
        { to: '/resume-analyzer', label: t('nav.resumeAnalyzer') || 'AI Resume & Gap Analyzer', icon: FileText },
        { to: '/behavior', label: t('nav.behaviorPrediction') || 'Behavior & Retention Insights', icon: Activity },
        { to: '/early-warning', label: t('nav.earlyWarning') || 'Early Warning & Interventions', icon: ShieldAlert },
      ]
    },
    {
      id: 'community',
      title: 'Community & Goals',
      links: [
        { to: '/teacher-dashboard', label: 'Faculty & Cohort Portal', icon: Users, badge: 'Faculty', badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
        { to: '/gamification', label: t('nav.gamification') || 'Badges & Leaderboard', icon: Trophy },
        { to: '/study-groups', label: t('nav.studyGroups') || 'Cohort Study Groups', icon: Users },
        { to: '/study-planner', label: t('nav.studyPlanner') || 'AI Study Schedule', icon: Calendar },
        { to: '/study-plan', label: 'Weekly Study Plan', icon: Target },
      ]
    }
  ], [t]);

  // Track collapsed state per section. Default: all open or active route's section open
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Filtered sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase().trim();
    return sections
      .map(section => ({
        ...section,
        links: section.links.filter(link => 
          link.label.toLowerCase().includes(query) ||
          (link.badge && link.badge.toLowerCase().includes(query))
        )
      }))
      .filter(section => section.links.length > 0);
  }, [sections, searchQuery]);

  // Check if a section contains active route
  const isSectionActive = (section: NavSection) => {
    return section.links.some(link => location.pathname === link.to || (link.to !== '/dashboard' && location.pathname.startsWith(link.to)));
  };

  // Render navigation links list
  const renderNav = (isDrawer = false, onLinkClick?: () => void) => {
    const compactMode = !isDrawer && isCompact;

    return (
      <div className="flex flex-col h-full">
        {/* Search Bar (Only shown in expanded mode or drawer) */}
        {!compactMode && (
          <div className="px-3 pt-3 pb-2 flex-shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find tools & pages..."
                className="w-full bg-white/[0.06] hover:bg-white/[0.09] focus:bg-white/[0.12] text-xs text-white placeholder-slate-400 pl-8 pr-7 py-2 rounded-xl border border-white/10 focus:border-indigo-500 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Links Container */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-3.5 custom-scrollbar">
          {filteredSections.map((section) => {
            const isCollapsed = !searchQuery && collapsedSections[section.id];
            const hasActiveLink = isSectionActive(section);

            if (compactMode) {
              // Compact Rail View: Group icons with thin separator
              return (
                <div key={section.id} className="space-y-1.5 pb-2 border-b border-white/[0.07] last:border-0">
                  {section.links.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        title={item.label}
                        className={({ isActive }) =>
                          `group relative flex items-center justify-center w-10 h-10 mx-auto rounded-xl transition-all ${
                            isActive
                              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                              : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                            {item.badge && (
                              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-400 ring-2 ring-[#0B1020]" />
                            )}
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              );
            }

            // Expanded Full Sidebar View
            return (
              <div key={section.id} className="space-y-1">
                {/* Section Header Toggle */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors group"
                >
                  <div className="flex items-center space-x-1.5 min-w-0">
                    {hasActiveLink && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 ring-2 ring-indigo-400/30 flex-shrink-0" />
                    )}
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 group-hover:text-white truncate">
                      {section.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 flex-shrink-0 text-slate-500 group-hover:text-slate-300">
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/[0.06] text-slate-400 font-semibold">
                      {section.links.length}
                    </span>
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                {/* Section Items */}
                {!isCollapsed && (
                  <div className="space-y-0.5 pt-0.5">
                    {section.links.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={onLinkClick}
                          className={({ isActive }) =>
                            `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 active:scale-[0.99] ${
                              isActive
                                ? 'bg-indigo-600/30 border-l-[3px] border-indigo-400 text-white font-semibold shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <div className="flex items-center space-x-2.5 min-w-0 flex-1 pr-2">
                                <Icon 
                                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                                    isActive ? 'text-indigo-300' : 'text-indigo-400/80 group-hover:text-indigo-300'
                                  }`} 
                                />
                                <span className="truncate leading-relaxed">{item.label}</span>
                              </div>
                              {item.badge && (
                                <span 
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 border transition-colors ${
                                    item.badgeColor || 'bg-white/[0.08] text-indigo-300 border-white/[0.1]'
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
                )}
              </div>
            );
          })}

          {/* Admin Section */}
          {(!searchQuery || 'admin console'.includes(searchQuery.toLowerCase())) && (
            <div className={`pt-2 border-t border-white/[0.08] ${compactMode ? 'flex justify-center' : ''}`}>
              {!compactMode && (
                <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-violet-300/80 mb-1">
                  Administration
                </p>
              )}
              <NavLink
                to="/admin"
                onClick={onLinkClick}
                title={compactMode ? "Admin Console" : undefined}
                className={({ isActive }) =>
                  compactMode
                    ? `flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                        isActive
                          ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                          : 'text-violet-300 hover:text-white hover:bg-violet-500/20'
                      }`
                    : `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-violet-600/30 border-l-[3px] border-violet-400 text-white font-semibold'
                          : 'text-violet-200/90 hover:text-white hover:bg-violet-500/15'
                      }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Shield 
                        className={`w-4 h-4 flex-shrink-0 ${
                          isActive ? 'text-violet-300' : 'text-violet-400 group-hover:text-violet-200'
                        }`} 
                      />
                      {!compactMode && <span className="truncate">Admin Console</span>}
                    </div>
                    {!compactMode && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        Root
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </div>
          )}
        </div>

        {/* Desktop Footer: Expand/Collapse Rail Toggle */}
        {!isDrawer && (
          <div className="p-2 border-t border-white/[0.08] flex items-center justify-between bg-black/20 flex-shrink-0">
            {!compactMode ? (
              <>
                <div className="flex items-center space-x-2 px-2 py-1 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <span className="text-[11px] text-slate-400 truncate">
                    {user?.fullName || 'Online'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleCompact}
                  title="Collapse sidebar to icon rail"
                  aria-label="Collapse sidebar"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={toggleCompact}
                title="Expand sidebar"
                aria-label="Expand sidebar"
                className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* 1. Desktop Persistent Sidebar */}
      <aside 
        style={{ backgroundColor: '#0B1020' }}
        className={`hidden md:flex flex-col h-full border-r border-slate-800/80 flex-shrink-0 transition-all duration-200 select-none z-20 ${
          isCompact ? 'w-20' : 'w-72'
        }`}
      >
        {renderNav()}
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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Slide Drawer Content */}
          <div 
            style={{ backgroundColor: '#0B1020' }}
            className="relative w-80 max-w-[85vw] border-r border-slate-800 flex flex-col h-full z-50 shadow-2xl animate-in slide-in-from-left duration-200 select-none"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
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
            <div className="flex-1 overflow-hidden">
              {renderNav(true, closeDrawer)}
            </div>

            {/* Mobile Footer User Info */}
            {user && (
              <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 bg-black/20 flex-shrink-0">
                <div className="truncate pr-2">
                  <p className="text-white font-semibold truncate">{user.fullName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
                {isAdmin ? (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 font-bold border border-violet-500/30">
                    Admin
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                    Student
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
