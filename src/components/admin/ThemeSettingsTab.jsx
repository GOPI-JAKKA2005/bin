import React, { useState } from 'react';
import { Palette, Sun, Moon, Monitor, CheckCircle2, Save, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { THEME_PRESETS } from '../../utils/themePresets';
import { apiClient } from '../../services/apiClient';
import { useAuth } from '../../contexts/AuthContext';

export function ThemeSettingsTab() {
  const { mode, setMode, preset, selectPreset, colors, updateColors } = useTheme();
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const colorFields = [
    { key: 'primary', label: 'Primary Brand' },
    { key: 'secondary', label: 'Secondary Accent' },
    { key: 'accent', label: 'Highlight Accent' },
    { key: 'background', label: 'App Background' },
    { key: 'surface', label: 'Card Surface' },
    { key: 'foreground', label: 'Text Foreground' },
    { key: 'muted', label: 'Muted Text' },
    { key: 'border', label: 'Border Lines' },
    { key: 'success', label: 'Success State' },
    { key: 'warning', label: 'Warning State' },
    { key: 'danger', label: 'Danger State' }
  ];

  const handleSaveTheme = async () => {
    try {
      setSaving(true);
      await apiClient.saveTheme(
        {
          mode,
          preset,
          colors
        },
        token
      );
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Save theme failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Presets */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-foreground font-heading flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Dynamic CSS Theme & Preset System
            </h3>
            <p className="text-xs text-muted mt-1">
              Changes update instant CSS variables across all components live in real time.
            </p>
          </div>

          <button
            onClick={handleSaveTheme}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-md shadow-primary/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 self-start"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving Theme...' : 'Persist Theme to Database'}
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Theme settings saved successfully!
          </div>
        )}

        {/* Mode Selector */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider block font-heading">
            Color Scheme Mode
          </label>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setMode('light')}
              className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold transition-all ${
                mode === 'light' ? 'bg-primary text-white border-primary' : 'bg-surface-hover border-border text-muted'
              }`}
            >
              <Sun className="w-4 h-4" /> Light Mode
            </button>
            <button
              onClick={() => setMode('dark')}
              className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold transition-all ${
                mode === 'dark' ? 'bg-primary text-white border-primary' : 'bg-surface-hover border-border text-muted'
              }`}
            >
              <Moon className="w-4 h-4" /> Dark Mode
            </button>
            <button
              onClick={() => setMode('system')}
              className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-semibold transition-all ${
                mode === 'system' ? 'bg-primary text-white border-primary' : 'bg-surface-hover border-border text-muted'
              }`}
            >
              <Monitor className="w-4 h-4" /> System Preference
            </button>
          </div>
        </div>

        {/* Preset Selector Chips */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider block font-heading">
            Curated Theme Presets
          </label>
          <div className="flex flex-wrap gap-2.5">
            {Object.keys(THEME_PRESETS).map((pName) => (
              <button
                key={pName}
                onClick={() => selectPreset(pName)}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 ${
                  preset === pName
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-surface border-border text-foreground hover:border-primary/40'
                }`}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full border border-white/40"
                  style={{ backgroundColor: THEME_PRESETS[pName].colors.primary }}
                />
                {pName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editable Color Grid & Live Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Color Slot Pickers */}
        <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-foreground font-heading">
            Editable CSS Color Slots
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {colorFields.map((field) => (
              <div key={field.key} className="p-3 rounded-2xl bg-surface-hover border border-border flex items-center justify-between">
                <div>
                  <span className="font-semibold text-foreground block">{field.label}</span>
                  <span className="text-[10px] text-muted uppercase">{colors[field.key]}</span>
                </div>
                <input
                  type="color"
                  value={colors[field.key] || '#10b981'}
                  onChange={(e) => updateColors({ [field.key]: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-border bg-transparent p-0"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Live Theme Preview Component */}
        <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
          <h4 className="font-bold text-sm text-foreground font-heading">
            Live Component Visual Preview
          </h4>

          <div className="p-5 rounded-2xl bg-background border border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Sample Card Surface</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary text-white">
                Active Theme
              </span>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              This card demonstrates your customized background, text foreground, primary brand gradient, and border contrast variables.
            </p>

            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-sm">
                Primary Button
              </button>
              <button className="px-4 py-2 rounded-xl bg-surface border border-border text-foreground text-xs font-semibold">
                Secondary Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
