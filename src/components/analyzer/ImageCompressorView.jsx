import React from 'react';
import { Cpu, CheckCircle2, ArrowRight, Zap } from 'lucide-react';
import { formatFileSize } from '../../utils/formatters';

export function ImageCompressorView({ stats, isLoading }) {
  if (!stats) return null;

  return (
    <div className="w-full p-4 rounded-2xl bg-surface border border-border shadow-sm my-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground font-heading">
          <Zap className="w-4 h-4 text-amber-500" />
          Client Media Compression Pipeline
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
          Target ~{stats.targetKB}KB
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
        <div className="p-2.5 rounded-xl bg-surface-hover border border-border">
          <span className="text-muted text-[10px] block font-medium">Original</span>
          <span className="font-bold text-foreground">{formatFileSize(stats.initialSizeKB)}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
          <span className="text-[10px] block font-semibold">Compressed</span>
          <span className="font-bold">{formatFileSize(stats.finalSizeKB)}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <span className="text-[10px] block font-semibold">Reduction</span>
          <span className="font-bold">{stats.reductionPercent}%</span>
        </div>
      </div>

      <p className="text-[11px] text-muted text-center font-medium">
        {stats.message}
      </p>
    </div>
  );
}
