import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Recycle, 
  Layers, 
  Leaf, 
  Cpu, 
  Info,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { resolveBinRecommendation, getConfidenceTier } from '../../config/wasteRules';

export function ObjectInspectionPanel({ object, index, totalCount }) {
  if (!object) return null;

  const binInfo = resolveBinRecommendation(object.stream || object.category);
  const confidenceTier = getConfidenceTier(object.confidence);

  return (
    <div className="w-full rounded-3xl bg-surface border border-border shadow-xl p-6 space-y-6 animate-fadeIn">
      {/* Header with Object ID, Name, and Confidence */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
              OBJECT #{index + 1} OF {totalCount}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${binInfo.badgeClass}`}>
              {binInfo.name}
            </span>
          </div>
          <h3 className="text-2xl font-bold font-heading text-foreground mt-1">
            {object.name}
          </h3>
        </div>

        {/* Confidence Tier Badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-muted block">Detection Confidence</span>
            <span className={`text-xl font-extrabold ${confidenceTier.color}`}>
              {object.confidence}%
            </span>
          </div>
          <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${confidenceTier.bg} ${confidenceTier.color} ${confidenceTier.border}`}>
            {confidenceTier.label}
          </span>
        </div>
      </div>

      {/* Safety Warning Banner if Biomedical or Hazardous */}
      {(object.stream === 'biomedical' || object.stream === 'hazardous' || object.category === 'biomedical' || object.category === 'hazardous') && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 space-y-2">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Critical Handling Alert
          </div>
          <p className="text-xs font-semibold leading-relaxed">
            {binInfo.safetyWarning || 'DO NOT MIX WITH NORMAL HOUSEHOLD WASTE. SPECIAL HANDLING REQUIRED.'}
          </p>
        </div>
      )}

      {/* Low Confidence Notice */}
      {confidenceTier.warning && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{confidenceTier.warning}</span>
        </div>
      )}

      {/* Key Attribute Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-surface-hover border border-border space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted block">Material</span>
          <span className="text-xs font-bold text-foreground block truncate" title={object.material}>
            {object.material || 'Standard'}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface-hover border border-border space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted block">Condition</span>
          <span className="text-xs font-bold text-foreground block truncate" title={object.condition}>
            {object.condition || 'Identified'}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface-hover border border-border space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted block">Recyclable</span>
          <span className={`text-xs font-bold flex items-center gap-1 ${object.recyclable ? 'text-blue-500' : 'text-slate-400'}`}>
            {object.recyclable ? <CheckCircle2 className="w-3.5 h-3.5" /> : '—'}
            {object.recyclable ? 'YES' : 'NO'}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface-hover border border-border space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted block">Compostable</span>
          <span className={`text-xs font-bold flex items-center gap-1 ${object.compostable ? 'text-emerald-500' : 'text-slate-400'}`}>
            {object.compostable ? <CheckCircle2 className="w-3.5 h-3.5" /> : '—'}
            {object.compostable ? 'YES' : 'NO'}
          </span>
        </div>
      </div>

      {/* Recommended Bin Guidance Box */}
      <div className="p-4 rounded-2xl bg-surface-hover border border-border space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 font-heading">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: binInfo.hex }} />
            Recommended Bin: <strong className="text-primary">{binInfo.binLabel}</strong>
          </span>
          <span className="text-[10px] text-muted italic">
            {binInfo.disclaimer}
          </span>
        </div>
        <p className="text-xs text-foreground leading-relaxed">
          {object.disposalInstruction || binInfo.handlingSummary}
        </p>
      </div>

      {/* Processing & Recovery Outputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Processing Method */}
        <div className="p-4 rounded-2xl bg-surface-hover border border-border space-y-2">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 font-heading">
            <Cpu className="w-3.5 h-3.5 text-primary" />
            Recommended Processing
          </h4>
          <ul className="space-y-1 text-xs text-muted">
            {(Array.isArray(object.processing) ? object.processing : [object.processing || 'Mechanical sorting & processing']).map((proc, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-foreground font-medium">{proc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Potential Recovered Resources */}
        <div className="p-4 rounded-2xl bg-surface-hover border border-border space-y-2">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5 font-heading">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Potential Recovered Resources
          </h4>
          <ul className="space-y-1 text-xs text-muted">
            {(Array.isArray(object.recovery) ? object.recovery : [object.recovery || 'Secondary raw materials']).map((rec, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span className="text-foreground font-medium">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Environmental Impact Note */}
      {object.environmentalImpact && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
          <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5" />
            Qualitative Environmental Impact
          </span>
          <p className="text-foreground font-medium leading-relaxed">
            {object.environmentalImpact}
          </p>
        </div>
      )}
    </div>
  );
}
