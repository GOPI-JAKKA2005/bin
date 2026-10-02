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
  X,
  Leaf
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function MobileNav({ isOpen, onClose, onOpenAuth }) {
  const location = useLocation();
  const { currentUser, logout, isAuthenticated, isAdmin } = useAuth();

  if (!isOpen) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-80 max-w-[85vw] h-full bg-surface border-l border-amber-500/30 dark:border-emerald-500/30 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10 transition-transform duration-300">
        
        {/* Top Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-emerald-500 flex items-center justify-center text-slate-950 shadow-sm">
                <Leaf className="w-4 h-4 font-bold" />
              </div>
              <span className="font-extrabold text-sm text-foreground font-heading">
                Navigation
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-surface-hover active:scale-90 transition-transform"
              title="Close Menu"
            >
              <X className="w-5 h-5 text-amber-500" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="space-y-2">
            <Link
              to="/"
              onClick={onClose}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all active:scale-98 ${
                isActive('/') 
                  ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/30 shadow-xs' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <div className="flex items-center gap-3">
                <Recycle className="w-4 h-4 text-amber-500" />
                <span>Home Overview</span>
              </div>
              {isActive('/') && <span className="w-2 h-2 rounded-full bg-amber-500" />}
            </Link>

            <Link
              to="/analyze"
              onClick={onClose}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-black flex items-center justify-between transition-all active:scale-98 ${
                isActive('/analyze') 
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-500 text-slate-950 shadow-md' 
                  : 'text-foreground hover:bg-surface-hover border border-amber-400/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-500 dark:text-emerald-400" />
                <span>AI Waste Analyzer</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-slate-950 text-amber-400">
                AI Live
              </span>
            </Link>

            <Link
              to="/guide"
              onClick={onClose}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all active:scale-98 ${
                isActive('/guide') || isActive('/directory')
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>Waste Directory Guide</span>
              </div>
              {(isActive('/guide') || isActive('/directory')) && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
            </Link>

            <Link
              to="/history"
              onClick={onClose}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all active:scale-98 ${
                isActive('/history') 
                  ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/30 shadow-xs' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <div className="flex items-center gap-3">
                <History className="w-4 h-4 text-amber-500" />
                <span>Scan & AI History</span>
              </div>
              {isActive('/history') && <span className="w-2 h-2 rounded-full bg-amber-500" />}
            </Link>

            <Link
              to="/dashboard"
              onClick={onClose}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all active:scale-98 ${
                isActive('/dashboard') 
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-xs' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                <span>Eco Dashboard</span>
              </div>
              {isActive('/dashboard') && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
            </Link>

            <Link
              to="/faq"
              onClick={onClose}
              className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all active:scale-98 ${
                isActive('/faq') 
                  ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400 border border-amber-400/30 shadow-xs' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>FAQ & Support</span>
              </div>
              {isActive('/faq') && <span className="w-2 h-2 rounded-full bg-amber-500" />}
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={onClose}
                className={`w-full px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between transition-all active:scale-98 ${
                  isActive('/admin') 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span>Admin Portal</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-500">
                  ADMIN
                </span>
              </Link>
            )}
          </nav>
        </div>

        {/* User Auth Footer */}
        <div className="pt-6 border-t border-border/80 space-y-3">
          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-hover border border-border/80">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-xs">
                  {currentUser?.displayName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-extrabold text-foreground block truncate">
                    {currentUser?.displayName || 'User'}
                  </span>
                  <span className="text-[10px] text-muted block truncate">
                    {currentUser?.email}
                  </span>
                </div>
              </div>

              <button
                onClick={() => { logout(); onClose(); }}
                className="w-full py-2.5 rounded-2xl border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-500/10 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
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

