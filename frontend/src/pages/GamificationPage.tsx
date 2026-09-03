import React, { useState, useEffect } from 'react';
import { gamificationApi } from '../services/api';
import { GamificationProfile, LeaderboardData } from '../types';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import {
  Award, Flame, Trophy, Star, ShieldCheck, Zap,
  CheckCircle2, Clock, Users, ArrowUpRight
} from 'lucide-react';

export const GamificationPage: React.FC = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);

  useEffect(() => {
    loadGamification();
  }, []);

  const loadGamification = async () => {
    try {
      setLoading(true);
      const [profRes, leadRes] = await Promise.all([
        gamificationApi.getProfile(),
        gamificationApi.getLeaderboard()
      ]);
      setProfile(profRes.data);
      setLeaderboard(leadRes.data);
    } catch (err: any) {
      showToast('Failed to load gamification profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Synchronizing student achievements and leaderboard..." />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Level & Streak Hero Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-900 rounded-2xl text-white p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
              <span>Level {profile?.currentLevel} • {profile?.title}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Student Achievements & Ranking</h1>
            <p className="text-xs sm:text-sm text-orange-100/90 max-w-xl">
              Earn XP through adaptive quizzes, code challenge solutions, and continuous study streaks.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-white/10 border border-white/20 px-4 py-2.5 rounded-2xl backdrop-blur-md text-center">
              <div className="flex items-center justify-center space-x-1 text-amber-300">
                <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-xl font-extrabold">{profile?.currentStreakDays}</span>
              </div>
              <p className="text-[10px] text-white/80 font-bold uppercase mt-0.5">Day Streak</p>
            </div>

            <div className="bg-white/10 border border-white/20 px-4 py-2.5 rounded-2xl backdrop-blur-md text-center">
              <span className="text-xl font-extrabold text-white">{profile?.currentXp}</span>
              <p className="text-[10px] text-white/80 font-bold uppercase mt-0.5">Total XP</p>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/15 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-orange-100 font-semibold">
            <span>Progress to Level {(profile?.currentLevel || 1) + 1}</span>
            <span>{profile?.currentXp} / {profile?.nextLevelXpRequired} XP ({profile?.levelProgressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-300 to-yellow-200 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, profile?.levelProgressPercent || 0)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">Achievement Badges</h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {profile?.badges.filter(b => b.isUnlocked).length} of {profile?.badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {profile?.badges.map((b) => (
            <div
              key={b.code}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                b.isUnlocked
                  ? 'border-amber-200 bg-amber-50/40'
                  : 'border-slate-200 bg-slate-50 opacity-60'
              }`}
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-500">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{b.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{b.description}</p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[11px]">
                <span className="font-bold text-amber-700">+{b.xpBonus} XP</span>
                <span className={`font-semibold ${b.isUnlocked ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {b.isUnlocked ? 'Earned' : 'Locked'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900">Student Leaderboard</h2>
          </div>
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
            All-Time Global Standings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaderboard?.entries.map((entry) => (
                <tr
                  key={entry.userId}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    entry.isCurrentUser ? 'bg-brand-50/50 font-bold' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-extrabold text-slate-700">
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                  </td>
                  <td className="py-3 px-4 text-slate-900">
                    {entry.studentName} {entry.isCurrentUser && <span className="text-brand-600">(You)</span>}
                  </td>
                  <td className="py-3 px-4 text-slate-600">Level {entry.level}</td>
                  <td className="py-3 px-4 text-right font-extrabold text-amber-600">{entry.totalXp} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
