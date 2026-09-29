import React from 'react';
import { getConfidenceBadge } from '../../utils/formatters';

export function GaugeMeter({ confidence = 85, label = 'AI Detection Confidence' }) {
  const meta = getConfidenceBadge(confidence);

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface border border-border">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* SVG Circular Progress Gauge */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            className="stroke-border"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={meta.color}
            strokeWidth="8"
            strokeDasharray={251.2}
            strokeDashoffset={251.2 - (251.2 * confidence) / 100}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold font-heading text-foreground">{confidence}%</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">Accuracy</span>
        </div>
      </div>

      <span className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold border ${meta.badgeClass}`}>
        {meta.label}
      </span>
      <p className="text-xs text-muted mt-1 font-medium">{label}</p>

      {meta.retakeMessage && (
        <div className="mt-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs text-center font-medium">
          ⚠️ {meta.retakeMessage}
        </div>
      )}
    </div>
  );
}
