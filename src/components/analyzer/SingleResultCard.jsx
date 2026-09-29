import React, { useState } from 'react';
import { GaugeMeter } from '../common/GaugeMeter';
import { ProgressBar } from '../common/ProgressBar';
import { SafetyNoticeBanner } from '../common/SafetyNoticeBanner';
import { AdvancedDetectionView } from './AdvancedDetectionView';
import { getCategoryMeta } from '../../utils/formatters';
import { Sparkles, CheckCircle2, AlertCircle, Leaf, Shield, Cpu, RefreshCw, Info } from 'lucide-react';

export function SingleResultCard({ result, onRetake }) {
  const [selectedIdx, setSelectedIdx] = useState(null);

  if (!result || !result.items || result.items.length === 0) return null;

  const activeItemIndex = selectedIdx !== null ? selectedIdx : 0;
  const item = result.items[activeItemIndex] || result.items[0];
  const catMeta = getCategoryMeta(item.category);

  return (
    <div className="w-full space-y-6">
      {/* ADVANCED OBJECT DETECTION VIEW CANVAS */}
      <AdvancedDetectionView
        imageSrc={result.imageSrc}
        items={result.items}
        overallConfidence={result.overallConfidence}
        selectedItemIndex={activeItemIndex}
        onSelectItem={(idx) => setSelectedIdx(idx)}
      />

      {/* Top Banner Card */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${catMeta.bg} ${catMeta.text} ${catMeta.border}`}>
                <Leaf className="w-3.5 h-3.5" />
                {catMeta.name}
              </span>
              <span className="text-xs text-muted font-medium">• Single Item Stream</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground mt-2">
              {item.name}
            </h2>
            {item.subcategory && (
              <p className="text-xs text-muted font-semibold mt-1">Subcategory: {item.subcategory}</p>
            )}
          </div>

          <button
            onClick={onRetake}
            className="px-4 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-muted hover:text-foreground hover:bg-surface-hover transition-colors flex items-center gap-1.5 self-start"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Scan Another Image
          </button>
        </div>

        {/* Clear Classification Summary Box */}
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
          <h4 className="font-bold text-sm text-foreground flex items-center gap-2 font-heading">
            <Info className="w-4 h-4 text-primary" />
            AI Identification & Waste Stream Result
          </h4>
          <p className="text-xs text-foreground leading-relaxed font-medium">
            <strong>Identified Object:</strong> {item.name}<br />
            <strong>Assigned Stream:</strong> <span className={`font-extrabold underline ${catMeta.text}`}>{catMeta.name}</span><br />
            <strong>Reasoning:</strong> {item.description}
          </p>
        </div>

        {/* Safety Warning Banner if Hazardous/Biomedical */}
        <SafetyNoticeBanner
          hasBiomedical={result.hasBiomedical || item.biomedical}
          hasHazardous={result.hasHazardous || item.hazardous}
          safetyPriorityList={result.safetyPriorityList}
        />

        {/* Main Grid: Gauge & Recovery Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Gauge Meter */}
          <div className="md:col-span-1">
            <GaugeMeter confidence={result.overallConfidence || item.confidence} label="Detection Accuracy" />
          </div>

          {/* Recovery Range & Composition */}
          <div className="md:col-span-2 space-y-5 flex flex-col justify-between">
            <div className="p-4 rounded-2xl bg-surface-hover border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider font-heading">
                  Estimated Recovery Potential
                </span>
                <span className="text-xs font-semibold text-primary">
                  {result.recoveryMin}% – {result.recoveryMax}%
                </span>
              </div>

              <ProgressBar
                min={result.recoveryMin}
                max={result.recoveryMax}
                isRange={true}
              />

              <p className="text-[11px] text-muted italic">
                * Note: Recovery values are estimated ranges based on material purity, contamination index, and local sorting facility technology.
              </p>
            </div>

            {/* Composition & Material Traits */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-surface border border-border">
                <span className="text-muted text-[10px] block font-medium">Composition</span>
                <span className="font-bold text-foreground">100% Single</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface border border-border">
                <span className="text-muted text-[10px] block font-medium">Biodegradable</span>
                <span className={`font-bold ${item.biodegradable ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {item.biodegradable ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface border border-border">
                <span className="text-muted text-[10px] block font-medium">Recyclable</span>
                <span className={`font-bold ${item.recyclable ? 'text-blue-500' : 'text-slate-400'}`}>
                  {item.recyclable ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface border border-border">
                <span className="text-muted text-[10px] block font-medium">Compostable</span>
                <span className={`font-bold ${item.compostable ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {item.compostable ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Handling & Environmental Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
          {/* Recommended Processing */}
          <div className="p-4 rounded-2xl bg-surface-hover border border-border space-y-2">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2 font-heading">
              <Cpu className="w-4 h-4 text-primary" />
              Recommended Processing & Methods
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              {item.recommendations || 'Deposit into designated waste stream bin.'}
            </p>
            {item.processingMethods && item.processingMethods.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {item.processingMethods.map((m, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-surface border border-border text-[11px] font-medium text-foreground">
                    {m}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Environmental Output & Benefits */}
          <div className="p-4 rounded-2xl bg-surface-hover border border-border space-y-2">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2 font-heading">
              <Leaf className="w-4 h-4 text-emerald-500" />
              Environmental Impact & Output
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              {item.benefits || 'Diverts secondary raw materials from municipal landfills, conserving virgin energy resources.'}
            </p>
            {item.warnings && (
              <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 pt-1">
                ⚠️ {item.warnings}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

