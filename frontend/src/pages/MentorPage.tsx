import React, { useState, useEffect, useRef } from 'react';
import { mentorApi } from '../services/api';
import { MentorProfile, MentorChatResponse, DailyAdviceResponse, WeeklyReviewResponse, MentorRecommendationItem } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Brain, Send, Sparkles, CheckCircle2, ChevronRight, Award,
  Flame, Calendar, FileText, Compass, AlertCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  evidence?: string[];
  recommendations?: MentorRecommendationItem[];
  timestamp: string;
}

export const MentorPage: React.FC = () => {
  const { showToast } = useToast();
  const { language, t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [dailyAdvice, setDailyAdvice] = useState<DailyAdviceResponse | null>(null);
  const [weeklyReview, setWeeklyReview] = useState<WeeklyReviewResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMentorData();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMentorData = async () => {
    try {
      setLoading(true);
      const [profRes, adviceRes, reviewRes] = await Promise.all([
        mentorApi.getProfile(),
        mentorApi.getDailyAdvice(),
        mentorApi.getWeeklyReview()
      ]);
      setProfile(profRes.data);
      setDailyAdvice(adviceRes.data);
      setWeeklyReview(reviewRes.data);

      // Initial greeting message
      setMessages([
        {
          id: '1',
          sender: 'mentor',
          text: `Welcome back! I am your AI Mentor tuned for **${profRes.data.targetCareer || 'Software Engineering'}**.\n\n${adviceRes.data.greeting} Today's primary focus is: **${adviceRes.data.dailyGoal}**`,
          evidence: adviceRes.data.priorityTopics.map(t => `Topic Priority: ${t}`),
          recommendations: adviceRes.data.recommendations,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to initialize AI mentor', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setSending(true);

    try {
      const res = await mentorApi.chat(userText, language);
      const data: MentorChatResponse = res.data;
      const mentorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'mentor',
        text: data.reply,
        evidence: data.evidenceCited,
        recommendations: data.recommendations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, mentorMsg]);
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Mentor is temporarily unavailable', 'error');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Synchronizing with your AI Personal Mentor..." />;
  }

  return (
    <div className="space-y-6">
      {/* Mentor Header Card */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-purple-900 rounded-2xl text-white p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/15">
              <Brain className="w-3.5 h-3.5 text-brand-300" />
              <span>{profile?.persona || 'Technical Architect & Coach'}</span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-300">Active • {language}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('mentor.title')}
            </h1>
            <p className="text-sm text-blue-100/80 max-w-2xl">
              Target Role: <strong className="text-white">{profile?.targetCareer}</strong> • Weekly Goal:{' '}
              <strong className="text-white">{profile?.weeklyStudyTargetHours}h / week</strong>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowWeeklyModal(true)}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-md transition-colors"
            >
              <Calendar className="w-4 h-4 mr-2 text-brand-300" />
              {t('mentor.weeklyReview')}
            </button>
            <div className="flex items-center space-x-1.5 bg-amber-500/20 border border-amber-400/30 px-3 py-2 rounded-xl text-xs font-bold text-amber-300">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{dailyAdvice?.streakDays || 5} {t('common.streak')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Guidance Banner */}
      {dailyAdvice && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700 flex-shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">{t('mentor.dailyAdvice')}</span>
                <span className="text-amber-500 text-xs">•</span>
                <span className="text-xs text-amber-800/80">{dailyAdvice.date}</span>
              </div>
              <h2 className="text-sm font-bold text-slate-900 mt-0.5">{dailyAdvice.dailyGoal}</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">{dailyAdvice.rationale}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {dailyAdvice.priorityTopics.map((topic, i) => (
              <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-amber-200 text-amber-900 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 mr-1.5" />
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Chat & Advice Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Conversation Stream */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[620px]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-2 mb-1 px-1">
                  <span className="text-[11px] font-bold text-slate-500">
                    {msg.sender === 'user' ? 'You' : 'AI Personal Mentor'}
                  </span>
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>

                <div
                  className={`p-4 rounded-2xl max-w-[88%] text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-slate-100/90 text-slate-800 rounded-tl-none border border-slate-200/70'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Evidence Cited Pill */}
                  {msg.evidence && msg.evidence.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1">
                      <div className="flex items-center space-x-1.5 text-[11px] font-bold text-indigo-700">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{t('mentor.evidenceTitle')}:</span>
                      </div>
                      <div className="space-y-0.5">
                        {msg.evidence.map((ev, idx) => (
                          <div key={idx} className="text-[11px] text-slate-600 pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-indigo-500">
                            {ev}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendation Actions Inside Message */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                        Action Items:
                      </span>
                      {msg.recommendations.map(rec => (
                        <div
                          key={rec.id}
                          className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between shadow-sm"
                        >
                          <div>
                            <p className="font-bold text-slate-900">{rec.title}</p>
                            <p className="text-[11px] text-slate-500">{rec.reason}</p>
                          </div>
                          <span className="inline-flex items-center text-brand-600 font-bold hover:underline cursor-pointer ml-2 flex-shrink-0">
                            Start <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex items-center space-x-2 text-xs text-slate-500 p-2">
                <div className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-brand-600 animate-pulse delay-100" />
                <div className="w-2 h-2 rounded-full bg-brand-600 animate-pulse delay-200" />
                <span>Mentor is reviewing your learning telemetry...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3.5 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={t('mentor.askPlaceholder')}
                className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-900"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || sending}
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-colors flex items-center shadow-md shadow-brand-500/20"
              >
                <Send className="w-4 h-4 mr-1.5" />
                {t('common.submit')}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Active Recommendations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900">Recommended Next</h3>
              </div>
              <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                AI Prioritized
              </span>
            </div>

            <div className="space-y-3">
              {dailyAdvice?.recommendations && dailyAdvice.recommendations.length > 0 ? (
                dailyAdvice.recommendations.map((rec) => (
                  <div key={rec.id} className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-brand-300 transition-all group">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {rec.title}
                      </h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 flex-shrink-0">
                        P{rec.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{rec.reason}</p>
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono text-[10px]">{rec.actionType}</span>
                      <button className="font-bold text-brand-600 hover:text-brand-700 flex items-center">
                        Launch <ChevronRight className="w-3 h-3 ml-0.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">
                  All priority recommendations completed! Great job.
                </div>
              )}
            </div>
          </div>

          {/* Motivational Thought */}
          {dailyAdvice?.motivationalQuote && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4.5 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-800 text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>Mentor Insight</span>
              </div>
              <p className="text-xs text-indigo-950/80 italic leading-relaxed">
                "{dailyAdvice.motivationalQuote}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Review Modal */}
      {showWeeklyModal && weeklyReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-5 h-5 text-brand-600" />
                <h3 className="text-base font-bold text-slate-900">Weekly Performance Synthesis</h3>
              </div>
              <button
                onClick={() => setShowWeeklyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xl font-extrabold text-slate-900">{weeklyReview.totalStudyHours}h</span>
                <p className="text-[11px] text-slate-500 font-medium">Study Logged</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-xl font-extrabold text-emerald-700">{weeklyReview.conceptsMastered}</span>
                <p className="text-[11px] text-emerald-600 font-medium">Concepts Mastered</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                <span className="text-xl font-extrabold text-indigo-700">{weeklyReview.quizAverage}%</span>
                <p className="text-[11px] text-indigo-600 font-medium">Quiz Average</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Areas to Review</h4>
              <div className="flex flex-wrap gap-2">
                {weeklyReview.areasToReview.map((a, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-800">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Next Week's Focus</h4>
              <div className="flex flex-wrap gap-2">
                {weeklyReview.nextWeekFocus.map((f, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 border border-brand-200 text-brand-800">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowWeeklyModal(false)}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs transition-colors"
            >
              Continue Learning
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
