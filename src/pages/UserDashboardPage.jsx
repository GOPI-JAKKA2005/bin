import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserScans, evaluateBadges } from '../services/scanService';
import { 
  Sparkles, 
  Award, 
  Layers, 
  Recycle, 
  History, 
  Leaf, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export function UserDashboardPage() {
  const { currentUser } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const userScans = await getUserScans(currentUser?.uid || 'anonymous');
        setScans(userScans);
      } catch (err) {
        console.warn('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  // Aggregate user metrics
  const totalScans = scans.length;
  let totalObjects = 0;
  let organicCount = 0;
  let recyclableCount = 0;
  let biomedicalCount = 0;
  let hazardousCount = 0;
  let confidenceSum = 0;

  scans.forEach(s => {
    totalObjects += Number(s.totalObjects || (s.objects || []).length || 0);
    confidenceSum += Number(s.overallConfidence || 92);
    if (s.summary) {
      organicCount += Number(s.summary.wetOrganic || 0);
      recyclableCount += Number(s.summary.dryRecyclable || 0);
      biomedicalCount += Number(s.summary.biomedical || 0);
      hazardousCount += Number(s.summary.hazardous || 0);
    }
  });

  const avgConfidence = totalScans > 0 ? Math.round(confidenceSum / totalScans) : 94;
  const ecoPoints = currentUser?.ecoPoints || (totalScans * 15 + 50);
  const badges = evaluateBadges(totalScans, ecoPoints);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Header Profile Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-surface to-secondary/10 border border-border shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary border border-primary/30">
              COMMUNITY IMPACT LEVEL
            </span>
            <span className="text-xs text-muted font-medium">
              Member ID: {currentUser?.uid ? currentUser.uid.slice(0, 8) : 'Guest-01'}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-foreground">
            Welcome, {currentUser?.displayName || currentUser?.email || 'Eco Champion'}!
          </h1>
          <p className="text-xs text-muted max-w-xl">
            Track your personalized waste diversion impact, AI classification milestones, and unlock sustainability badges.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border shadow-sm flex items-center gap-4 self-start sm:self-auto">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl">
            🌱
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-muted block">Eco Points Earned</span>
            <span className="text-2xl font-black text-primary font-heading">{ecoPoints} PTS</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-surface border border-border shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted text-xs">
            <span>Total Scans</span>
            <History className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground font-heading">
            {totalScans}
          </div>
          <span className="text-[10px] text-muted block">Images analyzed</span>
        </div>

        <div className="p-5 rounded-3xl bg-surface border border-border shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted text-xs">
            <span>Objects Segregated</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-foreground font-heading">
            {totalObjects}
          </div>
          <span className="text-[10px] text-muted block">Items sorted by AI</span>
        </div>

        <div className="p-5 rounded-3xl bg-surface border border-border shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted text-xs">
            <span>Hazardous Isolated</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 font-heading">
            {hazardousCount}
          </div>
          <span className="text-[10px] text-muted block">Batteries & E-Waste safely routed</span>
        </div>

        <div className="p-5 rounded-3xl bg-surface border border-border shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted text-xs">
            <span>Avg AI Confidence</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-500 font-heading">
            {avgConfidence}%
          </div>
          <span className="text-[10px] text-muted block">Vision precision tier</span>
        </div>
      </div>

      {/* Waste Category Breakdown Cards */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-foreground font-heading flex items-center gap-2">
          <Recycle className="w-4 h-4 text-primary" />
          Lifetime Waste Stream Diversion Breakdown
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              🟢 Wet / Organic
            </span>
            <span className="text-2xl font-black text-foreground">{organicCount}</span>
            <span className="text-[10px] text-muted block">Composted for soil</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center space-y-1">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              🔵 Dry / Recyclable
            </span>
            <span className="text-2xl font-black text-foreground">{recyclableCount}</span>
            <span className="text-[10px] text-muted block">Plastics, metals, paper</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-1">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
              🔴 Biomedical
            </span>
            <span className="text-2xl font-black text-foreground">{biomedicalCount}</span>
            <span className="text-[10px] text-muted block">Safely segregated</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              ⚫ Hazardous / E-Waste
            </span>
            <span className="text-2xl font-black text-foreground">{hazardousCount}</span>
            <span className="text-[10px] text-muted block">Special handling dropoff</span>
          </div>
        </div>
      </div>

      {/* Eco Badges & Gamification Showcase */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="text-sm font-bold text-foreground font-heading flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            Sustainability Badges & Achievements
          </h3>
          <span className="text-xs text-muted font-medium">
            {badges.filter(b => b.unlocked).length} of {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all flex items-center gap-3.5 ${
                badge.unlocked
                  ? 'bg-surface-hover border-primary/30 shadow-sm'
                  : 'bg-surface/50 border-border opacity-50 grayscale'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-2xl shadow-sm">
                {badge.icon}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs text-foreground block truncate">
                  {badge.name}
                </span>
                <span className="text-[11px] text-muted block leading-snug">
                  {badge.description}
                </span>
                <span className={`text-[10px] font-bold mt-1 inline-block ${
                  badge.unlocked ? 'text-primary' : 'text-muted'
                }`}>
                  {badge.unlocked ? '✓ Unlocked' : 'Locked'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Scans Quick View */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="text-sm font-bold text-foreground font-heading flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            Recent Scans
          </h3>
          <Link
            to="/history"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            View All Scans <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {scans.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted">
            No scans recorded yet. <Link to="/analyze" className="text-primary font-bold hover:underline">Scan your first item now!</Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {scans.slice(0, 5).map((scan) => (
              <div
                key={scan.scanId}
                className="p-3.5 rounded-2xl bg-surface-hover border border-border flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 overflow-hidden shrink-0 border border-border flex items-center justify-center">
                    {scan.imageUrl ? (
                      <img src={scan.imageUrl} alt="Scan" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-slate-500">Img</span>
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">
                      {scan.objects?.length || 1} Waste Object{(scan.objects?.length || 1) !== 1 ? 's' : ''} Detected
                    </span>
                    <span className="text-[10px] text-muted">
                      {scan.createdAt ? new Date(scan.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-500">
                    {scan.overallConfidence || 92}%
                  </span>
                  <Link
                    to="/history"
                    className="p-1.5 rounded-lg bg-surface border border-border text-muted hover:text-foreground"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
