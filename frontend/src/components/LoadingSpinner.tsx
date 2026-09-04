import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, text }) => {
  const displayMessage = text || message || 'Loading LearnPath AI...';
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 space-y-4">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-slate-600">{displayMessage}</p>
    </div>
  );
};
