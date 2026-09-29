import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Recycle, Palette, MessageSquare, FileText, Settings, BarChart2, LogOut, Shield, Menu, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';

export function AdminLayout({ activeTab, setActiveTab, children }) {
  const { adminUser, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'waste', label: 'Waste Management', icon: Recycle },
    { id: 'theme', label: 'Theme Settings', icon: Palette },
    { id: 'chatbot', label: 'Chatbot Control', icon: MessageSquare },
    { id: 'pages', label: 'Page Manager', icon: FileText },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-foreground transition-colors duration-200">
      
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border p-5 justify-between shrink-0 sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Logo & Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base font-heading text-foreground">Admin Portal</h2>
              <p className="text-[11px] text-muted">{settings.siteName || 'EcoSmart AI'}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    active
                      ? 'bg-primary text-white shadow-md shadow-primary/20 font-semibold'
                      : 'text-muted hover:text-foreground hover:bg-surface-hover'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-border space-y-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-muted hover:text-foreground transition-colors px-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Main Site
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold text-xs hover:bg-rose-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="p-4 bg-surface border-b border-border flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-xl border border-border text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg font-heading text-foreground capitalize">
              {activeTab} Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted hidden sm:inline font-medium">
              Signed in as: <strong className="text-foreground">{adminUser?.email}</strong>
            </span>
            <Link
              to="/"
              className="px-3.5 py-1.5 rounded-xl border border-border bg-surface text-xs font-semibold text-muted hover:text-foreground"
            >
              Live Site
            </Link>
          </div>
        </header>

        {/* Tab Content */}
        <main className="p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden flex">
          <div className="w-64 bg-surface border-r border-border p-5 flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="font-bold text-foreground">Admin Menu</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1 text-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                        active
                          ? 'bg-primary text-white font-semibold'
                          : 'text-muted hover:text-foreground hover:bg-surface-hover'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 text-rose-600 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" /> Sign Out Admin
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
