import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share2 } from 'lucide-react';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIosPrompt, setIsIosPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already in standalone PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    // Check if user dismissed earlier in this session
    if (sessionStorage.getItem('pwa_banner_dismissed') === 'true') {
      setIsDismissed(true);
      return;
    }

    // Android / Chrome / Edge beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detect iOS Safari mobile
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|fxios/.test(userAgent);
    if (isIos && isSafari && !isStandalone) {
      setIsIosPrompt(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (isDismissed) return null;

  // Render for Chrome/Android/Desktop
  if (deferredPrompt) {
    return (
      <div className="fixed top-16 left-0 right-0 z-40 px-3 py-2 bg-gradient-to-r from-indigo-900/95 via-indigo-800/95 to-violet-900/95 text-white backdrop-blur-md border-b border-indigo-500/30 shadow-lg flex items-center justify-between animate-fadeIn">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-4 h-4 text-indigo-300" />
          </div>
          <div className="text-xs truncate">
            <p className="font-semibold text-white truncate">Install LearnPath AI App</p>
            <p className="text-[10px] text-indigo-200 truncate">Add to your home screen for quick offline access</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1 bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-bold rounded-lg shadow-sm transition-all flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="p-1 text-indigo-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Render for iOS Safari
  if (isIosPrompt) {
    return (
      <div className="fixed top-16 left-0 right-0 z-40 px-3 py-2 bg-slate-900/95 text-white backdrop-blur-md border-b border-slate-700 shadow-lg flex items-center justify-between">
        <div className="flex items-center space-x-2 min-w-0 text-xs text-slate-200">
          <Share2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span className="text-[11px] truncate">
            Tap <strong className="text-indigo-300">Share</strong> then <strong className="text-indigo-300">Add to Home Screen</strong> to install app
          </span>
        </div>
        <button onClick={handleDismiss} className="p-1 text-slate-400 hover:text-white ml-2 flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return null;
};
