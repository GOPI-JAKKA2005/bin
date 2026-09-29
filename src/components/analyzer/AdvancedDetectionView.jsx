import React, { useState } from 'react';
import { 
  Eye, 
  Layers, 
  Flame, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Crosshair, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Tag, 
  Cpu, 
  Sparkles 
} from 'lucide-react';
import { wasteBinConfig, resolveBinRecommendation } from '../../config/wasteRules';

export function AdvancedDetectionView({ 
  imageSrc, 
  items = [], 
  overallConfidence = 95, 
  selectedItemIndex = null, 
  onSelectItem = () => {} 
}) {
  const [viewMode, setViewMode] = useState('hud'); // 'hud' | 'heatmap' | 'clean'
  const [showBoxes, setShowBoxes] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showConfidence, setShowConfidence] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!imageSrc && items.length === 0) return null;

  // Normalize bounding boxes to [ymin, xmin, ymax, xmax] percentage format (0-100)
  const itemsWithBoxes = items.map((item, idx) => {
    let box = item.box_2d;

    if (!box && item.boundingBox) {
      const bb = item.boundingBox;
      box = [
        Math.round((bb.yMin != null ? bb.yMin : 0.15) * 100),
        Math.round((bb.xMin != null ? bb.xMin : 0.10) * 100),
        Math.round((bb.yMax != null ? bb.yMax : 0.85) * 100),
        Math.round((bb.xMax != null ? bb.xMax : 0.90) * 100)
      ];
    }

    if (!box || !Array.isArray(box) || box.length !== 4) {
      if (items.length === 1) {
        box = [12, 10, 88, 90];
      } else if (items.length === 2) {
        box = idx === 0 ? [15, 10, 85, 48] : [15, 52, 85, 90];
      } else if (items.length === 3) {
        if (idx === 0) box = [15, 8, 55, 48];
        else if (idx === 1) box = [18, 54, 54, 90];
        else box = [58, 15, 92, 85];
      } else {
        if (idx === 0) box = [15, 8, 52, 44];
        else if (idx === 1) box = [12, 52, 56, 90];
        else if (idx === 2) box = [58, 10, 92, 46];
        else box = [60, 55, 92, 88];
      }
    }

    return { ...item, box_2d: box };
  });

  const activeIdx = hoveredIdx !== null ? hoveredIdx : selectedItemIndex;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 1));
  const handleResetZoom = () => setZoomLevel(1);

  // Stream-based color theme
  const getStreamTheme = (item) => {
    const stream = (item.stream || item.category || '').toLowerCase();
    if (stream.includes('wet') || stream.includes('organic')) {
      return { border: 'border-emerald-400', bg: 'bg-emerald-500/15', text: 'bg-emerald-500 text-slate-950', dot: '#10b981', glow: 'shadow-emerald-500/40' };
    }
    if (stream.includes('dry') || stream.includes('recycl')) {
      return { border: 'border-blue-400', bg: 'bg-blue-500/15', text: 'bg-blue-500 text-white', dot: '#3b82f6', glow: 'shadow-blue-500/40' };
    }
    if (stream.includes('bio') || stream.includes('sanit') || stream.includes('medic')) {
      return { border: 'border-rose-500', bg: 'bg-rose-500/20', text: 'bg-rose-600 text-white', dot: '#ef4444', glow: 'shadow-rose-500/50' };
    }
    if (stream.includes('hazard') || stream.includes('e_waste') || stream.includes('batter')) {
      return { border: 'border-amber-400', bg: 'bg-amber-500/20', text: 'bg-amber-500 text-slate-950', dot: '#f59e0b', glow: 'shadow-amber-500/50' };
    }
    return { border: 'border-slate-400', bg: 'bg-slate-500/15', text: 'bg-slate-500 text-white', dot: '#94a3b8', glow: 'shadow-slate-500/40' };
  };

  return (
    <div className="w-full rounded-3xl bg-surface border border-border overflow-hidden shadow-2xl space-y-0">
      {/* Header Toolbar */}
      <div className="p-4 bg-surface/90 backdrop-blur-md border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center font-bold">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-heading text-foreground flex items-center gap-1.5">
              AI Multi-Object Vision Detection
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20">
                {items.length} Object{items.length !== 1 ? 's' : ''} Detected
              </span>
            </h3>
            <p className="text-[11px] text-muted font-medium">Interactive Bounding Box Inspection HUD</p>
          </div>
        </div>

        {/* View Mode Switchers */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface-hover border border-border">
          <button
            onClick={() => setViewMode('hud')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'hud'
                ? 'bg-primary text-white shadow-md'
                : 'text-muted hover:text-foreground'
            }`}
            title="HUD Bounding Box Overlay"
          >
            <Crosshair className="w-3.5 h-3.5" />
            HUD Boxes
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'heatmap'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-muted hover:text-foreground'
            }`}
            title="Thermal / Attention Density Map"
          >
            <Flame className="w-3.5 h-3.5" />
            Heatmap
          </button>
          <button
            onClick={() => setViewMode('clean')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'clean'
                ? 'bg-slate-700 text-white shadow-md dark:bg-slate-300 dark:text-slate-900'
                : 'text-muted hover:text-foreground'
            }`}
            title="Clean Raw Image View"
          >
            <Eye className="w-3.5 h-3.5" />
            Clean View
          </button>
        </div>

        {/* Zoom & Toggle Controls */}
        <div className="flex items-center gap-2">
          {viewMode === 'hud' && (
            <div className="hidden sm:flex items-center gap-1 border-r border-border pr-2">
              <button
                onClick={() => setShowBoxes(!showBoxes)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                  showBoxes 
                    ? 'bg-primary/10 border-primary/30 text-primary' 
                    : 'bg-surface border-border text-muted opacity-60'
                }`}
              >
                Boxes
              </button>
              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                  showLabels 
                    ? 'bg-primary/10 border-primary/30 text-primary' 
                    : 'bg-surface border-border text-muted opacity-60'
                }`}
              >
                Labels
              </button>
              <button
                onClick={() => setShowConfidence(!showConfidence)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                  showConfidence 
                    ? 'bg-primary/10 border-primary/30 text-primary' 
                    : 'bg-surface border-border text-muted opacity-60'
                }`}
              >
                Score %
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 bg-surface-hover border border-border p-1 rounded-xl">
            <button
              onClick={handleZoomIn}
              className="p-1 rounded-lg hover:bg-surface text-muted hover:text-foreground transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 rounded-lg hover:bg-surface text-muted hover:text-foreground transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            {zoomLevel > 1 && (
              <button
                onClick={handleResetZoom}
                className="p-1 rounded-lg hover:bg-surface text-muted hover:text-foreground transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Image Canvas Viewport */}
      <div className="relative w-full bg-slate-950 overflow-hidden flex items-center justify-center min-h-[340px] max-h-[520px] select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div 
          className="relative max-w-full max-h-[520px] transition-transform duration-200 ease-out flex items-center justify-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Scanned Waste"
              className="max-h-[520px] w-auto object-contain block mx-auto"
            />
          ) : (
            <div className="w-96 h-64 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500 text-xs font-medium">
              No Image Preview Available
            </div>
          )}

          {/* OVERLAY MODE 1: HUD Bounding Boxes */}
          {viewMode === 'hud' && showBoxes && (
            <div className="absolute inset-0 pointer-events-none">
              {itemsWithBoxes.map((item, idx) => {
                const [ymin, xmin, ymax, xmax] = item.box_2d;
                const isActive = activeIdx === idx;
                const theme = getStreamTheme(item);

                const topPct = `${ymin}%`;
                const leftPct = `${xmin}%`;
                const widthPct = `${Math.max(10, xmax - xmin)}%`;
                const heightPct = `${Math.max(10, ymax - ymin)}%`;

                return (
                  <div
                    key={item.id || idx}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    onClick={() => onSelectItem(idx)}
                    className={`absolute pointer-events-auto cursor-pointer border-2 transition-all duration-200 group ${
                      theme.border
                    } ${theme.bg} ${
                      isActive ? `scale-[1.01] z-30 shadow-2xl ${theme.glow} ring-2 ring-white/50` : 'z-10 opacity-90 hover:opacity-100'
                    }`}
                    style={{
                      top: topPct,
                      left: leftPct,
                      width: widthPct,
                      height: heightPct
                    }}
                  >
                    {/* Futuristic Corner Brackets */}
                    <div className={`absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 ${theme.border}`} />
                    <div className={`absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 ${theme.border}`} />
                    <div className={`absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 ${theme.border}`} />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 ${theme.border}`} />

                    {/* Center Crosshair for Active Object */}
                    {isActive && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-70 pointer-events-none">
                        <Crosshair className="w-8 h-8 text-white animate-spin-slow" />
                      </div>
                    )}

                    {/* Top Label & Confidence Badge */}
                    {showLabels && (
                      <div className="absolute -top-7 left-0 flex items-center gap-1 z-40 pointer-events-none">
                        <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-t-md shadow-md ${theme.text}`}>
                          #{idx + 1} {item.name}
                        </span>
                        {showConfidence && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-900/90 text-white rounded-t-md border-t border-r border-slate-700 shadow-md">
                            {item.confidence || overallConfidence}%
                          </span>
                        )}
                      </div>
                    )}

                    {/* Hover Card Floating Tooltip */}
                    {isActive && (
                      <div className="absolute top-full left-0 mt-2 z-50 p-3 rounded-2xl bg-slate-900/95 text-white border border-slate-700 shadow-2xl backdrop-blur-md w-64 space-y-1.5 text-xs pointer-events-none animate-fadeIn">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                          <span className="font-bold text-emerald-400 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ID: #{idx + 1}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-300 leading-snug">
                          {item.reasoning || item.description || 'AI detected waste object features.'}
                        </div>
                        <div className="flex items-center justify-between text-[10px] pt-1 text-slate-400 border-t border-slate-800/80">
                          <span>Material: <strong className="text-white">{item.material || 'Standard'}</strong></span>
                          <span>Bin: <strong className="text-primary capitalize">{item.bin?.color || 'Blue'}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* OVERLAY MODE 2: Attention Heatmap Simulation */}
          {viewMode === 'heatmap' && (
            <div className="absolute inset-0 pointer-events-none">
              {itemsWithBoxes.map((item, idx) => {
                const [ymin, xmin, ymax, xmax] = item.box_2d;
                return (
                  <div
                    key={idx}
                    className="absolute rounded-full blur-xl opacity-75 mix-blend-screen transition-all duration-300"
                    style={{
                      top: `${ymin}%`,
                      left: `${xmin}%`,
                      width: `${Math.max(10, xmax - xmin)}%`,
                      height: `${Math.max(10, ymax - ymin)}%`,
                      background: 'radial-gradient(circle, rgba(239,68,68,0.85) 0%, rgba(245,158,11,0.65) 45%, rgba(16,185,129,0.3) 75%, transparent 100%)'
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Technical Status Bar */}
        <div className="absolute bottom-2 left-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI VISION PIPELINE: <strong className="text-white">MULTI-OBJECT ACTIVE</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span>Detected: <strong className="text-emerald-400">{items.length} items</strong></span>
            <span>Avg Confidence: <strong className="text-emerald-400">{overallConfidence}%</strong></span>
          </div>
        </div>
      </div>

      {/* Object Selector Pills */}
      <div className="p-3 bg-surface-hover/50 border-t border-border flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-bold text-muted uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Tag className="w-3 h-3 text-primary" />
          Detected:
        </span>

        <button
          onClick={() => onSelectItem(null)}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedItemIndex === null
              ? 'bg-primary text-white shadow-md'
              : 'bg-surface border border-border text-muted hover:text-foreground'
          }`}
        >
          All Stream ({items.length})
        </button>

        {itemsWithBoxes.map((item, idx) => {
          const theme = getStreamTheme(item);
          const isSelected = selectedItemIndex === idx || hoveredIdx === idx;

          return (
            <button
              key={item.id || idx}
              onClick={() => onSelectItem(idx)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 border ${
                isSelected
                  ? 'bg-primary/10 border-primary text-primary ring-2 ring-primary/40 shadow-sm scale-105'
                  : 'bg-surface border-border text-muted hover:text-foreground'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.dot }} />
              <span>#{idx + 1} {item.name}</span>
              <span className="text-[10px] opacity-75 font-normal">({item.confidence}%)</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
