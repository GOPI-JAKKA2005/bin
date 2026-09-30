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
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass-panel border-t border-amber-500/20 dark:border-emerald-500/20 px-3 py-2 shadow-2xl pb-safe backdrop-blur-xl">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
            isActive('/')
              ? 'text-amber-600 dark:text-amber-400 font-bold scale-105'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <Home className={`w-5 h-5 ${isActive('/') ? 'text-amber-500' : ''}`} />
          <span className="text-[10px] font-medium tracking-tight">Home</span>
          {isActive('/') && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm" />
          )}
        </Link>

        {/* Directory */}
        <Link
          to="/guide"
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
            isActive('/guide') || isActive('/directory')
              ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight">Guide</span>
          {(isActive('/guide') || isActive('/directory')) && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
          )}
        </Link>

        {/* AI Analyzer Center Prominent Floating Action Button */}
        <Link
          to="/analyze"
          className="relative -top-4 flex flex-col items-center group"
        >
          <div className={`w-13 h-13 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-400 to-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 border-4 border-background transition-transform active:scale-95 group-hover:scale-110 ${
            isActive('/analyze') ? 'ring-4 ring-emerald-500/40 glow-yellow-green' : ''
          }`}>
            <Sparkles className="w-6 h-6 text-slate-950 animate-pulse" />
          </div>
          <span className={`text-[10px] font-bold mt-0.5 ${
            isActive('/analyze') 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : 'text-muted'
          }`}>
            AI Scan
          </span>
        </Link>

        {/* Scan History */}
        <Link
          to="/history"
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
            isActive('/history')
              ? 'text-amber-600 dark:text-amber-400 font-bold scale-105'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight">History</span>
          {isActive('/history') && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm" />
          )}
        </Link>

        {/* Eco Dashboard */}
        <Link
          to="/dashboard"
          className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
            isActive('/dashboard')
              ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight">Dashboard</span>
          {isActive('/dashboard') && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
          )}
        </Link>

      </div>
    </nav>
  );
}
