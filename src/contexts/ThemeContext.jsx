import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEME_PRESETS } from '../utils/themePresets';
import { apiClient } from '../services/apiClient';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('system'); // 'light', 'dark', 'system'
  const [preset, setPreset] = useState('Eco Green');
  const [colors, setColors] = useState(THEME_PRESETS['Eco Green'].colors);
  const [isLoading, setIsLoading] = useState(true);

  // Apply colors to document root CSS variables
  const applyColorsToRoot = (colorMap, isDark) => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    Object.entries(colorMap).forEach(([key, val]) => {
      // camelCase -> kebab-case (primaryHover -> --color-primary-hover)
      const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVarName, val);
    });
  };

  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await apiClient.getTheme();
        if (res.theme) {
          if (res.theme.mode) setMode(res.theme.mode);
          if (res.theme.preset && THEME_PRESETS[res.theme.preset]) {
            setPreset(res.theme.preset);
          }
          if (res.theme.colors) {
            setColors(res.theme.colors);
          }
        }
      } catch (err) {
        console.warn('Theme load fallback:', err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadTheme();
  }, []);

  useEffect(() => {
    let isDark = false;
    if (mode === 'dark') {
      isDark = true;
    } else if (mode === 'light') {
      isDark = false;
    } else {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    applyColorsToRoot(colors, isDark);
  }, [mode, colors]);

  const updateColors = (newColors) => {
    setColors(prev => ({ ...prev, ...newColors }));
  };

  const selectPreset = (presetName) => {
    if (THEME_PRESETS[presetName]) {
      setPreset(presetName);
      setColors(THEME_PRESETS[presetName].colors);
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode, preset, selectPreset, colors, updateColors, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
