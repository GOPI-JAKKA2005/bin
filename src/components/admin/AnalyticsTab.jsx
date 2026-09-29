import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart2, PieChart as PieChartIcon, ShieldAlert, Sparkles } from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { useAuth } from '../../contexts/AuthContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export function AnalyticsTab() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await apiClient.getAnalytics(token);
        if (res.analytics) setData(res.analytics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, [token]);

  if (loading) {
    return (
      <div className="p-8 text-center text-muted text-xs">
        <Sparkles className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
        Aggregating Analytics Metrics...
      </div>
    );
  }

  const trends = data?.monthlyTrends || [
    { month: 'Jan', wet: 120, dry: 140, biomedical: 20, hazardous: 30, recovery: 74 },
    { month: 'Feb', wet: 150, dry: 160, biomedical: 25, hazardous: 35, recovery: 78 },
    { month: 'Mar', wet: 180, dry: 190, biomedical: 30, hazardous: 40, recovery: 82 },
    { month: 'Apr', wet: 210, dry: 220, biomedical: 35, hazardous: 45, recovery: 80 }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
          <span className="text-muted uppercase font-semibold text-[10px]">Mixed Waste Frequency</span>
          <h3 className="text-2xl font-bold font-heading text-purple-500 mt-1">{data?.mixedWasteFrequency || 18}%</h3>
          <p className="text-muted mt-1">Multi-object stream ratio</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
          <span className="text-muted uppercase font-semibold text-[10px]">Low-Confidence Scans</span>
          <h3 className="text-2xl font-bold font-heading text-rose-500 mt-1">{data?.lowConfidenceRate || 4}%</h3>
          <p className="text-muted mt-1">Triggered "Retake" prompt</p>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
          <span className="text-muted uppercase font-semibold text-[10px]">Avg Recovery Potential</span>
          <h3 className="text-2xl font-bold font-heading text-emerald-500 mt-1">{data?.avgRecoveryPotential || 78}%</h3>
          <p className="text-muted mt-1">Overall resource diversion</p>
        </div>
      </div>

      {/* Monthly Category Trends Recharts Bar Chart */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-4">
        <h3 className="font-bold text-base text-foreground font-heading flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-primary" />
          Monthly Waste Volume by Stream Category
        </h3>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted)" fontSize={12} />
              <YAxis stroke="var(--color-muted)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '12px' }} />
              <Legend />
              <Bar dataKey="wet" name="Wet Organic" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="dry" name="Dry Recyclable" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="biomedical" name="Biomedical" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="hazardous" name="Hazardous" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
