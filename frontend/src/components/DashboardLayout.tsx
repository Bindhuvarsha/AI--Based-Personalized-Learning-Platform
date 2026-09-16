import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { PwaInstallBanner } from './PwaInstallBanner';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-slate-50">
      <Navbar />
      <PwaInstallBanner />
      <div className="flex flex-1 relative">
        <Sidebar />
        <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-24 md:pb-8 overflow-y-auto relative z-10 w-full max-w-full">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
};
