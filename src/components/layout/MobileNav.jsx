import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Recycle, 
  HelpCircle, 
  Shield, 
  Sparkles, 
  BookOpen, 
  History, 
  LayoutDashboard,
  User,
  LogOut,
  X 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function MobileNav({ isOpen, onClose, onOpenAuth }) {
  const location = useLocation();
  const { currentUser, logout, isAuthenticated, isAdmin } = useAuth();

  if (!isOpen) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm lg:hidden animate-fadeIn">
      <div className="fixed inset-y-0 right-0 w-80 bg-surface border-l border-amber-500/20 dark:border-emerald-500/20 p-6 shadow-2xl flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="font-bold text-sm text-foreground font-heading flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-emerald-500" />
              Navigation Menu
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted hover:text-foreground hover:bg-surface-hover"
            >
              <X className="w-5 h-5 text-amber-500" />
            </button>
          </div>

          {/* Links */}
          <nav className="space-y-1.5">
            <Link
              to="/"
              onClick={onClose}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all ${
                isActive('/') 
                  ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/30 shadow-xs' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <Recycle className="w-4 h-4 text-amber-500" />
              Home Overview
            </Link>

            <Link
              to="/analyze"
              onClick={onClose}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all ${
                isActive('/analyze') 
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-500 text-slate-950 shadow-md font-black' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              AI Waste Analyzer
            </Link>

            <Link
              to="/guide"
              onClick={onClose}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all ${
                isActive('/guide') || isActive('/directory')
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Waste Directory Guide
            </Link>

            <Link
              to="/history"
              onClick={onClose}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all ${
                isActive('/history') 
                  ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/30 shadow-xs' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <History className="w-4 h-4 text-amber-500" />
              Scan & AI History
            </Link>

            <Link
              to="/dashboard"
              onClick={onClose}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all ${
                isActive('/dashboard') 
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-500" />
              Eco Dashboard
            </Link>

            <Link
              to="/faq"
              onClick={onClose}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 transition-all ${
                isActive('/faq') 
                  ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/30 shadow-xs' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-amber-500" />
              FAQ & System Support
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={onClose}
                className={`w-full px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-3 transition-all ${
                  isActive('/admin') 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Console
              </Link>
            )}
          </nav>
        </div>

        {/* User Auth Footer */}
        <div className="pt-4 border-t border-border">
          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-2xl bg-surface-hover border border-border/60">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow-xs">
                  {currentUser?.displayName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-foreground block truncate">
                    {currentUser?.displayName || 'User'}
                  </span>
                  <span className="text-[10px] text-muted block truncate">
                    {currentUser?.email}
                  </span>
                </div>
              </div>

              <button
                onClick={() => { logout(); onClose(); }}
                className="w-full py-2.5 rounded-2xl border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-500/10 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <User className="w-4 h-4" />
              Sign In / Register Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
