import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navbar />
      <div className="flex flex-1 relative">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
