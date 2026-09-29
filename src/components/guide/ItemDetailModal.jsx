import React from 'react';
import { X, Leaf, Cpu, AlertTriangle, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { getCategoryMeta } from '../../utils/formatters';
import { ProgressBar } from '../common/ProgressBar';

export function ItemDetailModal({ item, onClose }) {
  if (!item) return null;

  const catMeta = getCategoryMeta(item.category);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header Image / Pattern */}
        {item.imageUrl ? (
          <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="p-6 border-b border-border flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${catMeta.bg} ${catMeta.text} ${catMeta.border}`}>
              {catMeta.name}
            </span>
            <button onClick={onClose} className="p-2 rounded-xl text-muted hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${catMeta.bg} ${catMeta.text} ${catMeta.border}`}>
              {catMeta.name}
            </span>
            <h2 className="text-2xl font-bold font-heading text-foreground mt-2">{item.name}</h2>
            {item.subcategory && (
              <p className="text-xs text-muted font-medium mt-0.5">Subcategory: {item.subcategory}</p>
            )}
          </div>

          <p className="text-sm text-muted leading-relaxed">{item.description}</p>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
            <div className="p-3 rounded-2xl bg-surface-hover border border-border">
              <span className="text-muted text-[10px] block font-medium">Biodegradable</span>
              <span className={`font-bold ${item.biodegradable ? 'text-emerald-500' : 'text-slate-400'}`}>
                {item.biodegradable ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-hover border border-border">
              <span className="text-muted text-[10px] block font-medium">Recyclable</span>
              <span className={`font-bold ${item.recyclable ? 'text-blue-500' : 'text-slate-400'}`}>
                {item.recyclable ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-hover border border-border">
              <span className="text-muted text-[10px] block font-medium">Compostable</span>
              <span className={`font-bold ${item.compostable ? 'text-emerald-500' : 'text-slate-400'}`}>
                {item.compostable ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-hover border border-border">
              <span className="text-muted text-[10px] block font-medium">Hazardous</span>
              <span className={`font-bold ${item.hazardous || item.biomedical ? 'text-amber-500' : 'text-slate-400'}`}>
                {item.hazardous || item.biomedical ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          {/* Recovery Range Bar */}
          <div className="p-4 rounded-2xl bg-surface-hover border border-border space-y-2">
            <div className="flex justify-between text-xs font-bold text-foreground">
              <span>Estimated Material Recovery Range</span>
              <span className="text-primary">{item.recoveryMin}% - {item.recoveryMax}%</span>
            </div>
            <ProgressBar min={item.recoveryMin} max={item.recoveryMax} isRange={true} />
          </div>

          {/* Recommendations & Safety */}
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-1">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                Segregation & Processing Guidelines
              </h4>
              <p className="text-muted leading-relaxed">{item.recommendations}</p>
            </div>

            {item.warnings && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 space-y-1">
                <h4 className="font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Handling Precautions
                </h4>
                <p className="leading-relaxed">{item.warnings}</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-surface-hover border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs shadow-md"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
