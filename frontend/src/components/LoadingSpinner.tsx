import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading LearnPath AI...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] p-8 space-y-4">
    <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
    <p className="text-sm font-medium text-slate-600">{message}</p>
  </div>
);
