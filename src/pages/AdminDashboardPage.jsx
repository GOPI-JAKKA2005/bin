import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminLayout } from '../components/layout/AdminLayout';
import { OverviewTab } from '../components/admin/OverviewTab';
import { WasteManagementTab } from '../components/admin/WasteManagementTab';
import { ThemeSettingsTab } from '../components/admin/ThemeSettingsTab';
import { ChatbotControlTab } from '../components/admin/ChatbotControlTab';
import { PageManagerTab } from '../components/admin/PageManagerTab';
import { SettingsTab } from '../components/admin/SettingsTab';
import { AnalyticsTab } from '../components/admin/AnalyticsTab';
import { Sparkles } from 'lucide-react';

export function AdminDashboardPage() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center text-muted text-xs">
        <Sparkles className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
        Verifying Security Credentials...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'waste': return <WasteManagementTab />;
      case 'theme': return <ThemeSettingsTab />;
      case 'chatbot': return <ChatbotControlTab />;
      case 'pages': return <PageManagerTab />;
      case 'settings': return <SettingsTab />;
      case 'analytics': return <AnalyticsTab />;
      default: return <OverviewTab />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderActiveTab()}
    </AdminLayout>
  );
}
