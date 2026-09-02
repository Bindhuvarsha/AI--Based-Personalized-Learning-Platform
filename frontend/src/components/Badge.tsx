import React from 'react';
import { KnowledgeLevel, DifficultyLevel } from '../types';

interface BadgeProps {
  level?: KnowledgeLevel | DifficultyLevel | string;
  className?: string;
  children?: React.ReactNode;
}

export const KnowledgeBadge: React.FC<{ level: KnowledgeLevel; className?: string }> = ({ level, className = '' }) => {
  switch (level) {
    case 'WEAK':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200 ${className}`}>
          Weak (&lt;50%)
        </span>
      );
    case 'DEVELOPING':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 ${className}`}>
          Developing (50-69%)
        </span>
      );
    case 'PROFICIENT':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 ${className}`}>
          Proficient (70-84%)
        </span>
      );
    case 'ADVANCED':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 ${className}`}>
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
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
          Beginner
        </span>
      );
    case 'INTERMEDIATE':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 ${className}`}>
          Intermediate
        </span>
      );
    case 'ADVANCED':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 ${className}`}>
          Advanced
        </span>
      );
    default:
      return null;
  }
};
