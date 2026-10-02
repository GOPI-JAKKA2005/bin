import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Sparkles, 
  BookOpen, 
  History, 
  LayoutDashboard 
} from 'lucide-react';

export function MobileBottomNav() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-3 left-3 right-3 z-40 lg:hidden">
      <nav className="glass-floating-nav rounded-3xl px-3 py-2 shadow-2xl backdrop-blur-2xl border border-blue-500/30 dark:border-emerald-500/30">
        <div className="flex items-center justify-between max-w-md mx-auto relative px-1">
          
          {/* Home */}
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 active:scale-95 ${
              isActive('/')
                ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 font-extrabold shadow-xs'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <Home className={`w-5 h-5 ${isActive('/') ? 'text-blue-500 animate-bounce' : ''}`} />
            <span className="text-[10px] font-bold tracking-tight">Home</span>
          </Link>

          {/* Directory */}
          <Link
            to="/guide"
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 active:scale-95 ${
              isActive('/guide') || isActive('/directory')
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold shadow-xs'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <BookOpen className={`w-5 h-5 ${(isActive('/guide') || isActive('/directory')) ? 'text-emerald-500' : ''}`} />
            <span className="text-[10px] font-bold tracking-tight">Guide</span>
          </Link>

          {/* AI Analyzer Center Prominent Floating Action Button */}
          <Link
            to="/analyze"
            className="relative -top-5 flex flex-col items-center group active:scale-95 transition-transform"
          >
            <div className="relative">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 opacity-80 blur-sm group-hover:opacity-100 transition-opacity animate-pulse-glow" />
              
              <div className={`relative w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 via-teal-500 to-emerald-500 text-white flex items-center justify-center shadow-xl border-4 border-background transition-all ${
                isActive('/analyze') ? 'ring-4 ring-blue-500/50 scale-105' : 'group-hover:scale-105'
              }`}>
                <Sparkles className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>
            <span className={`text-[10px] font-black mt-0.5 tracking-wider uppercase ${
              isActive('/analyze') 
                ? 'text-blue-600 dark:text-blue-400 font-extrabold' 
                : 'text-muted'
            }`}>
              AI Scan
            </span>
          </Link>

          {/* Scan History */}
          <Link
            to="/history"
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 active:scale-95 ${
              isActive('/history')
                ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 font-extrabold shadow-xs'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <History className={`w-5 h-5 ${isActive('/history') ? 'text-blue-500' : ''}`} />
            <span className="text-[10px] font-bold tracking-tight">History</span>
          </Link>

          {/* Eco Dashboard */}
          <Link
            to="/dashboard"
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 active:scale-95 ${
              isActive('/dashboard')
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold shadow-xs'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${isActive('/dashboard') ? 'text-emerald-500' : ''}`} />
            <span className="text-[10px] font-bold tracking-tight">Dashboard</span>
          </Link>

        </div>
      </nav>
    </div>
  );
}

