import React from 'react';
import { ShieldAlert, RefreshCw, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MaintenanceOverlay({ settings }) {
  if (!settings?.maintenanceMode) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-warning/30 shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
          <ShieldAlert className="w-8 h-8 animate-bounce" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold font-heading text-foreground">System Maintenance</h2>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            The AI Waste Classification System is currently undergoing scheduled platform upgrades and AI model fine-tuning.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border text-xs text-muted space-y-1">
          <p className="font-semibold text-foreground">Expected Uptime</p>
          <p>We will be back online shortly. Thank you for your patience!</p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Check System Status
          </button>
          
          <Link
            to="/admin/login"
            className="text-xs text-muted hover:text-foreground transition-colors flex items-center justify-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            Administrator Access Login
          </Link>
        </div>
      </div>
    </div>
  );
}
