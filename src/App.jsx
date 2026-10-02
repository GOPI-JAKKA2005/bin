import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { ChatWidget } from './components/chatbot/ChatWidget';
import { MaintenanceOverlay } from './components/layout/MaintenanceOverlay';

import { HomePage } from './pages/HomePage';
import { AnalyzePage } from './pages/AnalyzePage';
import { GuidePage } from './pages/GuidePage';
import { FaqPage } from './pages/FaqPage';
import { CustomPage } from './pages/CustomPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ScanHistoryPage } from './pages/ScanHistoryPage';
import { UserDashboardPage } from './pages/UserDashboardPage';

function AppContent() {
  const location = useLocation();
  const { settings } = useSettings();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      {!isAdminRoute && <Navbar />}

      {!isAdminRoute && <MaintenanceOverlay settings={settings} />}

      <main className="flex-1 pb-28 lg:pb-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/directory" element={<GuidePage />} />
          <Route path="/history" element={<ScanHistoryPage />} />
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/page/:slug" element={<CustomPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {!isAdminRoute && <MobileBottomNav />}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && settings?.chatbotEnabled !== false && <ChatWidget />}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}

export default App;
