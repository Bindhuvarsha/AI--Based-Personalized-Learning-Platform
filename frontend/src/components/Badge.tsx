import React from 'react';
import { KnowledgeLevel, DifficultyLevel } from '../types';

export const KnowledgeBadge: React.FC<{ level: KnowledgeLevel; className?: string }> = ({ level, className = '' }) => {
  switch (level) {
    case 'WEAK':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-800 border border-rose-500/20 backdrop-blur-xs ${className}`}>
          Weak (&lt;50%)
        </span>
      );
    case 'DEVELOPING':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-900 border border-amber-500/25 backdrop-blur-xs ${className}`}>
          Developing (50-69%)
        </span>
      );
    case 'PROFICIENT':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-800 border border-indigo-500/20 backdrop-blur-xs ${className}`}>
          Proficient (70-84%)
        </span>
      );
    case 'ADVANCED':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800 border border-emerald-500/25 backdrop-blur-xs ${className}`}>
          Advanced (85-100%)
        </span>
      );
    default:
      return null;
  }
};

export const DifficultyBadge: React.FC<{ difficulty: DifficultyLevel; className?: string }> = ({ difficulty, className = '' }) => {
  switch (difficulty) {
    case 'BEGINNER':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 backdrop-blur-xs ${className}`}>
          Beginner
        </span>
      );
    case 'INTERMEDIATE':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-800 border border-indigo-500/20 backdrop-blur-xs ${className}`}>
          Intermediate
        </span>
      );
    case 'ADVANCED':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-violet-500/10 text-violet-800 border border-violet-500/20 backdrop-blur-xs ${className}`}>
          Advanced
        </span>
      );
    default:
      return null;
  }
};

export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className = '' }) => {
  switch (status) {
    case 'COMPLETED':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-800 border border-emerald-500/25 backdrop-blur-xs ${className}`}>
          Completed
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-800 border border-indigo-500/20 backdrop-blur-xs ${className}`}>
          In Progress
        </span>
      );
    case 'LOCKED':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-700 border border-slate-500/20 backdrop-blur-xs ${className}`}>
          Locked
        </span>
      );
    case 'UNLOCKED':
    case 'NOT_STARTED':
    default:
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-700 border border-slate-500/20 backdrop-blur-xs ${className}`}>
          Available
        </span>
      );
  }
};
