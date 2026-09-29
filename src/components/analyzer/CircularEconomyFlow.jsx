import React from 'react';
import { RefreshCw, ArrowRight, Sparkles, Layers, Cpu, CheckCircle2 } from 'lucide-react';

export function CircularEconomyFlow({ objects = [] }) {
  if (!objects || objects.length === 0) return null;

  return (
    <div className="w-full rounded-3xl bg-surface border border-border shadow-xl p-6 space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-base font-bold font-heading text-foreground">
              Dynamic Circular Economy Pipeline
            </h3>
            <p className="text-xs text-muted">
              Visual Before → Processing → Recovered Material lifecycle for detected waste items.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Closed-Loop Recovery
        </span>
      </div>

      <div className="space-y-4">
        {objects.map((item, idx) => {
          const rawInput = item.name;
          const processing = Array.isArray(item.processing) ? item.processing[0] : (item.processing || 'Material Segregation & Recycling');
          const outputResource = Array.isArray(item.recovery) ? item.recovery.join(' / ') : (item.recovery || 'Secondary Raw Material');

          return (
            <div 
              key={item.id || idx}
              className="p-4 rounded-2xl bg-surface-hover border border-border space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 font-heading">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  Stream Item #{idx + 1}: <strong className="text-primary">{item.name}</strong>
                </span>
                <span className="text-[10px] text-muted font-medium">
                  {item.material || 'Material'}
                </span>
              </div>

              {/* 3-Step Flow: Before -> Processing -> After */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                {/* Step 1: Before */}
                <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted">
                    <span>1. Before</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20">
                      Raw Waste
                    </span>
                  </div>
                  <p className="text-xs font-bold text-foreground truncate" title={rawInput}>
                    {rawInput}
                  </p>
                  <p className="text-[11px] text-muted truncate">
                    Condition: {item.condition || 'Unprocessed'}
                  </p>
                </div>

                {/* Step 2: Processing */}
                <div className="p-3 rounded-xl bg-surface border border-border space-y-1 relative">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted">
                    <span>2. Processing</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      Conversion
                    </span>
                  </div>
                  <p className="text-xs font-bold text-foreground truncate" title={processing}>
                    {processing}
                  </p>
                  <p className="text-[11px] text-muted truncate">
                    Method: {item.processingMethods?.[0] || 'Engineered Lifecycle'}
                  </p>
                </div>

                {/* Step 3: After */}
                <div className="p-3 rounded-xl bg-surface border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    <span>3. After</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Resource
                    </span>
                  </div>
                  <p className="text-xs font-bold text-foreground truncate" title={outputResource}>
                    {outputResource}
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate">
                    ✓ Closed-loop circular recovery
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
