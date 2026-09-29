import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Leaf, 
  Recycle, 
  HelpCircle, 
  Shield, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Sparkles, 
  BookOpen, 
  History, 
  LayoutDashboard,
  User,
  LogOut
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useAuth } from '../../contexts/AuthContext';
import { MobileNav } from './MobileNav';
import { AuthModal } from '../auth/AuthModal';

export function Navbar() {
  const { mode, setMode } = useTheme();
  const { settings } = useSettings();
  const { currentUser, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleThemeMode = () => {
    if (mode === 'light') setMode('dark');
    else if (mode === 'dark') setMode('system');
    else setMode('light');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-border/40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 animate-pulse-slow" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-foreground flex items-center gap-1.5 font-heading">
                {settings.siteName || 'EcoSmart AI'}
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  PRO
                </span>
              </span>
              <p className="text-xs text-muted font-medium hidden sm:block">AI Waste Segregation System</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <Recycle className="w-3.5 h-3.5" />
              Home
            </Link>

            <Link
              to="/analyze"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/analyze') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              AI Analyzer
            </Link>

            <Link
              to="/guide"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/guide') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Directory
            </Link>

            <Link
              to="/history"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/history') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              History
            </Link>

            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/dashboard') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </Link>

            <Link
              to="/faq"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/faq') 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              FAQ
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  isActive('/admin') 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-primary hover:bg-primary/10'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </nav>

          {/* Right Action Icons (Theme, Auth, Mobile Menu) */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleThemeMode}
              className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-surface-hover border border-transparent hover:border-border transition-all"
              title={`Switch theme (currently ${mode})`}
            >
              {mode === 'dark' ? <Moon className="w-4 h-4 text-secondary" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>

            {/* User Profile / Auth Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-1 border-l border-border">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-hover transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold text-xs">
                    {currentUser?.displayName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-bold text-foreground truncate max-w-[110px]">
                    {currentUser?.displayName || 'User'}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-surface-hover lg:hidden"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <MobileNav 
          isOpen={mobileOpen} 
          onClose={() => setMobileOpen(false)}
          onOpenAuth={() => { setMobileOpen(false); setAuthModalOpen(true); }}
        />
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
