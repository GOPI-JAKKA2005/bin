import React from 'react';
import { AlertTriangle, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function SafetyNoticeBanner({ hasBiomedical, hasHazardous, safetyPriorityList = [] }) {
  if (!hasBiomedical && !hasHazardous && safetyPriorityList.length === 0) return null;

  return (
    <div className="w-full space-y-4 my-4">
      {/* Biohazard Alert Box */}
      {hasBiomedical && (
        <div className="p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/30 text-red-600 dark:text-red-400 space-y-2 animate-pulse-slow">
          <div className="flex items-center gap-2.5 font-bold text-base font-heading">
            <Activity className="w-6 h-6 text-red-500 animate-bounce" />
            CRITICAL BIOHAZARD ALERT
          </div>
          <p className="text-xs leading-relaxed font-medium">
            Biomedical / Clinical items detected! Never handle barehanded or dispose in domestic waste bins. Place in puncture-resistant biohazard containers for specialized autoclaving.
          </p>
        </div>
      )}

      {/* Hazardous Material Alert Box */}
      {hasHazardous && !hasBiomedical && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-600 dark:text-amber-400 space-y-2">
          <div className="flex items-center gap-2.5 font-bold text-base font-heading">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            TOXIC / HAZARDOUS WASTE WARNING
          </div>
          <p className="text-xs leading-relaxed font-medium">
            Toxic, flammable, or heavy metal waste detected! Store separately and deliver to certified municipal e-waste or hazard centers.
          </p>
        </div>
      )}

      {/* Ordered Handling Steps */}
      {safetyPriorityList.length > 0 && (
        <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm space-y-3">
          <h4 className="font-bold text-sm text-foreground flex items-center gap-2 font-heading">
            <ShieldAlert className="w-4 h-4 text-primary" />
            Mandatory Handling & Safety Sequence
          </h4>

          <div className="space-y-2.5">
            {safetyPriorityList.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl flex items-start gap-3 text-xs border ${
                  item.urgent
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                    : 'bg-surface-hover border-border text-foreground'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                  item.urgent ? 'bg-rose-500 text-white' : 'bg-primary/20 text-primary'
                }`}>
                  {item.step}
                </span>
                <div>
                  <span className="font-semibold block text-sm">{item.title}</span>
                  <p className="text-muted mt-0.5 leading-relaxed">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
