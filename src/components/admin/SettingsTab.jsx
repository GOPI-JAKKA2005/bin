import React, { useState } from 'react';
import { Settings, ShieldAlert, Save, CheckCircle2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { apiClient } from '../../services/apiClient';
import { useAuth } from '../../contexts/AuthContext';

export function SettingsTab() {
  const { settings, updateSettingsState } = useSettings();
  const { token } = useAuth();
  const [formData, setFormData] = useState({ ...settings });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await apiClient.saveSettings(formData, token);
      if (res.settings) {
        updateSettingsState(res.settings);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-surface border border-border shadow-sm">
        <div>
          <h3 className="font-bold text-lg text-foreground font-heading flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Global Platform Configurations & Toggles
          </h3>
          <p className="text-xs text-muted mt-1">Control system features, limits, and maintenance mode.</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold shadow-md shadow-primary/25 hover:opacity-95 transition-all flex items-center gap-2 self-start"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {success && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Platform settings updated successfully!
        </div>
      )}

      {/* Maintenance Mode Emergency Toggle */}
      <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm font-heading flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            Emergency System Maintenance Mode
          </h4>
          <p className="text-xs mt-1 leading-relaxed max-w-md">
            When enabled, non-admin visitors see the Maintenance screen. Admin dashboard remains fully accessible.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFormData({ ...formData, maintenanceMode: !formData.maintenanceMode })}
          className={`px-4 py-2 rounded-xl font-bold text-xs border transition-all ${
            formData.maintenanceMode
              ? 'bg-amber-500 text-white border-amber-600'
              : 'bg-surface border-border text-foreground'
          }`}
        >
          {formData.maintenanceMode ? 'Maintenance ON' : 'Normal Operation'}
        </button>
      </div>

      {/* Feature Toggles & Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4 text-xs">
          <h4 className="font-bold text-sm text-foreground font-heading">Feature Toggles</h4>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-surface-hover border border-border">
              <span className="font-semibold text-foreground">AI Waste Analyzer Engine</span>
              <input
                type="checkbox"
                checked={formData.aiEnabled}
                onChange={(e) => setFormData({ ...formData, aiEnabled: e.target.checked })}
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-surface-hover border border-border">
              <span className="font-semibold text-foreground">Video Stream Sampling</span>
              <input
                type="checkbox"
                checked={formData.videoAnalysisEnabled}
                onChange={(e) => setFormData({ ...formData, videoAnalysisEnabled: e.target.checked })}
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-surface-hover border border-border">
              <span className="font-semibold text-foreground">EcoBot Floating Chatbot</span>
              <input
                type="checkbox"
                checked={formData.chatbotEnabled}
                onChange={(e) => setFormData({ ...formData, chatbotEnabled: e.target.checked })}
              />
            </label>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4 text-xs">
          <h4 className="font-bold text-sm text-foreground font-heading">Media & Compression Limits</h4>

          <div className="space-y-3">
            <div>
              <label className="block text-muted font-semibold mb-1">Target Client Compression Size (KB)</label>
              <input
                type="number"
                value={formData.compressionTargetKB}
                onChange={(e) => setFormData({ ...formData, compressionTargetKB: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-border text-foreground"
              />
            </div>

            <div>
              <label className="block text-muted font-semibold mb-1">High Accuracy Confidence Threshold (%)</label>
              <input
                type="number"
                value={formData.confidenceThresholdHigh}
                onChange={(e) => setFormData({ ...formData, confidenceThresholdHigh: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-surface-hover border border-border text-foreground"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
