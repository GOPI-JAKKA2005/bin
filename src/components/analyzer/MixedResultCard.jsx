import React, { useState } from 'react';
import { GaugeMeter } from '../common/GaugeMeter';
import { ProgressBar } from '../common/ProgressBar';
import { SafetyNoticeBanner } from '../common/SafetyNoticeBanner';
import { AdvancedDetectionView } from './AdvancedDetectionView';
import { getCategoryMeta } from '../../utils/formatters';
import { Layers, RefreshCw, AlertTriangle, ShieldCheck, ArrowRight, ListOrdered } from 'lucide-react';

export function MixedResultCard({ result, onRetake }) {
  const [selectedIdx, setSelectedIdx] = useState(null);

  if (!result || !result.items) return null;

  return (
    <div className="w-full space-y-6">
      {/* ADVANCED OBJECT DETECTION VIEW CANVAS */}
      <AdvancedDetectionView
        imageSrc={result.imageSrc}
        items={result.items}
        overallConfidence={result.overallConfidence}
        selectedItemIndex={selectedIdx}
        onSelectItem={(idx) => setSelectedIdx(idx)}
      />

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
              <Layers className="w-3.5 h-3.5" />
              Mixed Waste Stream ({result.items.length} Objects Detected)
            </span>
            <h2 className="text-2xl font-bold font-heading text-foreground mt-2">Multi-Object Waste Stream</h2>
            <p className="text-xs text-muted font-medium mt-0.5">
              Contamination Level: <strong className="text-foreground">{result.contaminationLevel}</strong>
            </p>
          </div>

          <button
            onClick={onRetake}
            className="px-4 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-muted hover:text-foreground hover:bg-surface-hover transition-colors flex items-center gap-1.5 self-start"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Scan New Stream
          </button>
        </div>

        {/* Safety Priority Order */}
        <SafetyNoticeBanner
          hasBiomedical={result.hasBiomedical}
          hasHazardous={result.hasHazardous}
          safetyPriorityList={result.safetyPriorityList}
        />

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="md:col-span-1">
            <GaugeMeter confidence={result.overallConfidence} label="Overall Stream Detection" />
          </div>

          <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
            <div className="p-4 rounded-2xl bg-surface-hover border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider font-heading">
                  Aggregated Stream Recovery
                </span>
                <span className="text-xs font-semibold text-primary">
                  {result.recoveryMin}% – {result.recoveryMax}%
                </span>
              </div>
              <ProgressBar min={result.recoveryMin} max={result.recoveryMax} isRange={true} />
              <p className="text-[11px] text-muted italic">
                * Percentages normalized to total exactly 100%. Sorting wet organics from dry recyclables increases total output by ~25%.
              </p>
            </div>

            {/* Contamination Alert Badge */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>
                <strong>Cross-Contamination Alert:</strong> {result.contaminationLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Itemized Detected Objects Breakdown Table */}
        <div className="pt-4 border-t border-border space-y-3">
          <h4 className="font-bold text-sm text-foreground flex items-center gap-2 font-heading">
            <Layers className="w-4 h-4 text-primary" />
            Detected Waste Composition Breakdown (~100%)
          </h4>

          <div className="space-y-3">
            {result.items.map((item, idx) => {
              const meta = getCategoryMeta(item.category);
              const isSelected = selectedIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedIdx(isSelected ? null : idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    isSelected 
                      ? 'bg-primary/10 border-primary shadow-lg ring-2 ring-primary/30' 
                      : 'bg-surface-hover border-border hover:border-primary/50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${meta.bg} ${meta.text} ${meta.border}`}>
                        {meta.name}
                      </span>
                      <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                        {item.name}
                        {isSelected && <span className="text-[10px] text-primary font-bold font-mono">SELECTED ON HUD</span>}
                      </span>
                    </div>
                    <p className="text-muted leading-relaxed">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-4 sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                    <div className="text-right">
                      <span className="text-[10px] text-muted block uppercase font-semibold">Composition</span>
                      <span className="font-extrabold text-sm text-primary">{item.compositionPercent}%</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-muted block uppercase font-semibold">Est. Recovery</span>
                      <span className="font-bold text-foreground">{item.recoveryMin}% - {item.recoveryMax}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
