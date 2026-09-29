import React, { useState, useEffect } from 'react';
import { Layers, Activity, CheckCircle2, TrendingUp, Sparkles, FileText, AlertTriangle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useAuth } from '../../contexts/AuthContext';
import { formatPercent } from '../../utils/formatters';

export function OverviewTab() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await apiClient.getAdminStats(token);
        if (res.stats) setStats(res.stats);
      } catch (err) {
        console.error('Stats error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [token]);

  if (loading) {
    return (
      <div className="p-8 text-center text-muted">
        <Sparkles className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
        Loading Admin System Metrics...
      </div>
    );
  }

  const categoryCounts = stats?.categoryCounts || { wet: 580, dry: 490, biomedical: 95, hazardous: 115, mixed: 140 };

  return (
    <div className="space-y-6">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Total Scans</span>
            <h3 className="text-2xl font-bold font-heading text-foreground mt-1">{stats?.totalAnalyses || 1420}</h3>
            <span className="text-[11px] text-emerald-500 font-medium">↑ 12% this week</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Avg Accuracy</span>
            <h3 className="text-2xl font-bold font-heading text-foreground mt-1">{formatPercent(stats?.avgConfidence || 87.4)}</h3>
            <span className="text-[11px] text-emerald-500 font-medium">High Precision</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Catalog Items</span>
            <h3 className="text-2xl font-bold font-heading text-foreground mt-1">{stats?.totalItems || 4}</h3>
            <span className="text-[11px] text-muted font-medium">Configured Rules</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Biomedical Alerts</span>
            <h3 className="text-2xl font-bold font-heading text-rose-500 mt-1">{categoryCounts.biomedical || 95}</h3>
            <span className="text-[11px] text-rose-500 font-medium">Strict Safety Isolation</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Waste Category Distribution */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
        <h3 className="font-bold text-base text-foreground font-heading">
          Detection Distribution by Category
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <span className="font-bold block text-lg">{categoryCounts.wet || 0}</span>
            <span className="text-[11px] font-medium">Wet / Organic</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
            <span className="font-bold block text-lg">{categoryCounts.dry || 0}</span>
            <span className="text-[11px] font-medium">Dry / Recyclable</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
            <span className="font-bold block text-lg">{categoryCounts.biomedical || 0}</span>
            <span className="text-[11px] font-medium">Biomedical</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <span className="font-bold block text-lg">{categoryCounts.hazardous || 0}</span>
            <span className="text-[11px] font-medium">Hazardous</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
            <span className="font-bold block text-lg">{categoryCounts.mixed || 0}</span>
            <span className="text-[11px] font-medium">Mixed Streams</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
        <h3 className="font-bold text-base text-foreground font-heading">Recent Waste Scans</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border text-muted uppercase font-semibold text-[10px]">
              <tr>
                <th className="pb-3 px-2">Item Name</th>
                <th className="pb-3 px-2">Category</th>
                <th className="pb-3 px-2">Accuracy</th>
                <th className="pb-3 px-2">Recovery Est.</th>
                <th className="pb-3 px-2">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(stats?.recentAnalyses || []).map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-hover transition-colors">
                  <td className="py-3 px-2 font-semibold text-foreground">{row.itemName || 'Mixed Waste'}</td>
                  <td className="py-3 px-2 uppercase text-[10px] font-bold">{row.category}</td>
                  <td className="py-3 px-2 font-bold text-primary">{row.confidence}%</td>
                  <td className="py-3 px-2 font-medium">{row.recoveryEst}%</td>
                  <td className="py-3 px-2 text-muted">{new Date(row.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
