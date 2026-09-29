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
      <div className="fixed inset-y-0 right-0 w-72 bg-surface border-l border-border p-6 shadow-2xl flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="font-bold text-sm text-foreground font-heading">
              Menu Navigation
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-muted hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="space-y-1">
            <Link
              to="/"
              onClick={onClose}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
                isActive('/') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <Recycle className="w-4 h-4" />
              Home
            </Link>

            <Link
              to="/analyze"
              onClick={onClose}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
                isActive('/analyze') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              AI Analyzer
            </Link>

            <Link
              to="/guide"
              onClick={onClose}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
                isActive('/guide') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Waste Directory
            </Link>

            <Link
              to="/history"
              onClick={onClose}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
                isActive('/history') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <History className="w-4 h-4" />
              Scan History
            </Link>

            <Link
              to="/dashboard"
              onClick={onClose}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
                isActive('/dashboard') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Eco Dashboard
            </Link>

            <Link
              to="/faq"
              onClick={onClose}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
                isActive('/faq') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={onClose}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
                  isActive('/admin') 
                    ? 'bg-primary text-white' 
                    : 'text-primary hover:bg-primary/10'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* User Auth Footer */}
        <div className="pt-4 border-t border-border">
          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-xs">
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
                className="w-full py-2 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-500/10 flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
