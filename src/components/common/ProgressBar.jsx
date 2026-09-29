import React from 'react';

export function ProgressBar({ min = 0, max = 100, val = 50, isRange = false, label, color = 'var(--color-primary)' }) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-muted">{label}</span>
          <span className="text-foreground">
            {isRange ? `${min}% – ${max}%` : `${val}%`}
          </span>
        </div>
      )}

      <div className="relative w-full h-3.5 rounded-full bg-border/50 overflow-hidden p-0.5">
        {isRange ? (
          <div
            className="absolute top-0.5 bottom-0.5 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 shadow-sm"
            style={{
              left: `${min}%`,
              width: `${Math.max(5, max - min)}%`
            }}
          />
        ) : (
          <div
            className="h-full rounded-full bg-primary transition-all duration-700 shadow-sm"
            style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
          />
        )}
      </div>

      {isRange && (
        <div className="flex justify-between text-[10px] text-muted font-medium px-0.5">
          <span>Min Est. ({min}%)</span>
          <span>Max Recovery ({max}%)</span>
        </div>
      )}
    </div>
  );
}
