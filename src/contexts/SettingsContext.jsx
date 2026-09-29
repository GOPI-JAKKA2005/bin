import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  siteName: 'EcoSmart AI Waste System',
  logoUrl: '/logo.svg',
  bannerText: 'AI-Powered Sustainable Waste Classification, Segregation & Recovery System',
  defaultTheme: 'Eco Green',
  maintenanceMode: false,
  aiEnabled: true,
  videoAnalysisEnabled: true,
  chatbotEnabled: true,
  maxImageSizeMB: 10,
  maxVideoSizeMB: 25,
  compressionTargetKB: 500,
  confidenceThresholdHigh: 80,
  confidenceThresholdMedium: 60,
  contactEmail: 'support@ecosmartwaste.ai',
  contactPhone: '+1 (800) 555-ECO-1',
  footerText: '© 2026 EcoSmart AI Smart Waste Management System. Empowering global recycling & zero waste goals.'
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const res = await apiClient.getSettings();
      if (res.settings) {
        setSettings(prev => ({ ...prev, ...res.settings }));
      }
    } catch (err) {
      console.warn('Settings load fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettingsState: setSettings, refreshSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}
