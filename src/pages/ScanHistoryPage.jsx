import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserScans, deleteScanRecord } from '../services/scanService';
import { WasteAnalysisReportModal } from '../components/analyzer/WasteAnalysisReportModal';
import { resolveBinRecommendation } from '../config/wasteRules';
import { 
  History, 
  Trash2, 
  Eye, 
  Calendar, 
  Layers, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowRight,
  AlertCircle,
  FileText
} from 'lucide-react';

export function ScanHistoryPage() {
  const { currentUser } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    loadScans();
  }, [currentUser]);

  const loadScans = async () => {
    setLoading(true);
    try {
      const data = await getUserScans(currentUser?.uid || 'anonymous');
      setScans(data);
    } catch (err) {
      console.warn('Failed to load user scans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scanId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this scan record?')) {
      await deleteScanRecord(scanId);
      setScans(prev => prev.filter(s => s.scanId !== scanId));
    }
  };

  // Filter scans by category and timeframe
  const filteredScans = scans.filter(scan => {
    // 1. Text Search
    const searchMatch = !search || 
      scan.scanId.toLowerCase().includes(search.toLowerCase()) ||
      (scan.objects || []).some(o => o.name?.toLowerCase().includes(search.toLowerCase()));

    // 2. Category Filter
    let catMatch = categoryFilter === 'all';
    if (!catMatch) {
      if (categoryFilter === 'wet_organic') catMatch = (scan.summary?.wetOrganic > 0) || (scan.objects || []).some(o => o.stream === 'wet_organic');
      if (categoryFilter === 'dry_recyclable') catMatch = (scan.summary?.dryRecyclable > 0) || (scan.objects || []).some(o => o.stream === 'dry_recyclable');
      if (categoryFilter === 'biomedical') catMatch = (scan.summary?.biomedical > 0) || (scan.objects || []).some(o => o.stream === 'biomedical');
      if (categoryFilter === 'hazardous') catMatch = (scan.summary?.hazardous > 0) || (scan.objects || []).some(o => o.stream === 'hazardous');
      if (categoryFilter === 'general') catMatch = (scan.summary?.general > 0) || (scan.objects || []).some(o => o.stream === 'general');
    }

    // 3. Time Filter
    let timeMatch = true;
    if (timeFilter !== 'all' && scan.createdAt) {
      const scanDate = new Date(scan.createdAt);
      const now = new Date();
      const diffDays = (now - scanDate) / (1000 * 60 * 60 * 24);

      if (timeFilter === 'today') timeMatch = diffDays <= 1;
      else if (timeFilter === 'week') timeMatch = diffDays <= 7;
      else if (timeFilter === 'month') timeMatch = diffDays <= 30;
    }

    return searchMatch && catMatch && timeMatch;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <History className="w-3.5 h-3.5" />
            Cloud Scan Logs
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-foreground mt-1">
            My Scan History
          </h1>
          <p className="text-xs text-muted">
            All AI waste analyses, detected objects, and disposal recommendations saved in Firestore.
          </p>
        </div>

        <Link
          to="/analyze"
          className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/25 hover:bg-primary-hover transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          Scan New Waste Image
        </Link>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-3xl bg-surface border border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items, materials, scan IDs..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-hover border border-border text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-hover border border-border text-xs text-foreground focus:outline-none focus:border-primary"
          >
            <option value="all">All Categories</option>
            <option value="wet_organic">🟢 Wet / Organic</option>
            <option value="dry_recyclable">🔵 Dry / Recyclable</option>
            <option value="biomedical">🔴 Biomedical</option>
            <option value="hazardous">⚫ Hazardous / E-Waste</option>
            <option value="general">⚪ General</option>
          </select>

          {/* Timeframe Filter */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-hover border border-border text-xs text-foreground focus:outline-none focus:border-primary"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Scan History Records Grid */}
      {loading ? (
        <div className="p-12 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted">Retrieving scans from Firestore...</p>
        </div>
      ) : filteredScans.length === 0 ? (
        /* Empty State */
        <div className="p-12 rounded-3xl bg-surface border border-border text-center space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-2xl">
            🌱
          </div>
          <h3 className="text-xl font-bold font-heading text-foreground">
            You haven't analyzed any waste yet
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            Upload or capture your first waste image to detect objects, get bin segregation advice, and build your scan history.
          </p>
          <Link
            to="/analyze"
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/25 hover:bg-primary-hover transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Analyze Your First Waste Image
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScans.map((scan) => {
            const scanDate = scan.createdAt ? new Date(scan.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }) : 'Recent';

            const objects = scan.objects || [];

            return (
              <div
                key={scan.scanId}
                onClick={() => setSelectedScan(scan)}
                className="group rounded-3xl bg-surface border border-border shadow-sm hover:shadow-xl hover:border-primary/40 transition-all p-5 space-y-4 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Thumbnail & Image */}
                  <div className="relative w-full h-44 rounded-2xl bg-slate-950 overflow-hidden border border-border flex items-center justify-center">
                    {scan.imageUrl ? (
                      <img
                        src={scan.imageUrl}
                        alt="Scan preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-xs text-slate-500">Image Preview</span>
                    )}

                    <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/90 text-white backdrop-blur-md border border-slate-700">
                      {objects.length} Object{objects.length !== 1 ? 's' : ''}
                    </span>

                    <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/90 text-slate-950 backdrop-blur-md">
                      {scan.overallConfidence || 92}%
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {scanDate}
                    </span>
                    <span className="font-mono text-[10px] text-muted">
                      {scan.scanId.slice(0, 12)}...
                    </span>
                  </div>

                  {/* Detected Items Tag Pills */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted block">Detected Objects:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {objects.slice(0, 4).map((obj, i) => {
                        const bin = resolveBinRecommendation(obj.stream || obj.category);
                        return (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${bin.badgeClass}`}
                          >
                            {obj.name}
                          </span>
                        );
                      })}
                      {objects.length > 4 && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-surface-hover text-muted">
                          +{objects.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedScan(scan); }}
                    className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Analysis
                  </button>

                  <button
                    onClick={(e) => handleDelete(scan.scanId, e)}
                    className="p-1.5 rounded-lg text-muted hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete Scan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULL ANALYSIS REPORT MODAL */}
      {selectedScan && (
        <WasteAnalysisReportModal
          result={{
            ...selectedScan,
            imageSrc: selectedScan.imageUrl
          }}
          onClose={() => setSelectedScan(null)}
          userEmail={selectedScan.userEmail || currentUser?.email || 'User'}
        />
      )}
    </div>
  );
}
