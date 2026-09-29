import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  Leaf, 
  Layers, 
  AlertTriangle,
  Info,
  Apple,
  Recycle,
  HeartPulse,
  AlertOctagon
} from 'lucide-react';
import { resolveBinRecommendation } from '../../config/wasteRules';

export function WasteAnalysisReportModal({ result, onClose, userEmail = 'User' }) {
  const reportRef = useRef();

  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  const objects = result.objects || result.items || [];
  const scanDate = result.timestamp ? new Date(result.timestamp).toLocaleString() : new Date().toLocaleString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-3xl bg-surface border border-border shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Sticky Action Toolbar */}
        <div className="p-4 bg-surface border-b border-border flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground font-heading">
                Waste Audit & Classification Report
              </h3>
              <p className="text-[11px] text-muted">Scan ID: {result.analysisId || 'SCAN-001'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-hover transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div ref={reportRef} className="p-6 sm:p-8 space-y-6 overflow-y-auto print:p-0 print:m-0 text-foreground">
          
          {/* Document Header */}
          <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary block">
                ECOSMART AI PLATFORM • INDUSTRIAL AUDIT
              </span>
              <h1 className="text-2xl font-black font-heading text-foreground mt-0.5">
                AI Waste Analysis Audit Report
              </h1>
              <p className="text-xs text-muted mt-1">
                Multi-Object Computer Vision Detection & Four-Bin Circular Segregation Protocol
              </p>
            </div>

            <div className="text-right text-xs text-muted space-y-0.5">
              <div>Date: <strong className="text-foreground">{scanDate}</strong></div>
              <div>User: <strong className="text-foreground">{userEmail}</strong></div>
              <div>Detected Objects: <strong className="text-primary font-bold">{objects.length}</strong></div>
              <div>Confidence: <strong className="text-emerald-500 font-bold">{result.overallConfidence}%</strong></div>
            </div>
          </div>

          {/* Scanned Image Preview if Available */}
          {result.imageSrc && (
            <div className="rounded-2xl border border-border bg-slate-950 overflow-hidden max-h-56 flex items-center justify-center">
              <img
                src={result.imageSrc}
                alt="Audit Scan"
                className="max-h-56 w-auto object-contain mx-auto"
              />
            </div>
          )}

          {/* HIGHLIGHTED FOUR-BIN SEGREGATION REFERENCE IN REPORT */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-rose-500/5 border-2 border-primary/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2 font-heading">
                <Layers className="w-4 h-4 text-primary" />
                Four-Bin Segregation System Standard
              </h4>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                Official Protocol
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Green Bin */}
              <div className="p-3 rounded-xl bg-surface border border-emerald-500/30 space-y-1">
                <span className="inline-flex items-center gap-1 font-black text-[11px] text-emerald-600 dark:text-emerald-400">
                  🟢 Green Bin (Wet Waste)
                </span>
                <p className="text-[11px] text-muted leading-tight">
                  Biodegradable organic matter: food leftovers, kitchen scraps, and fruit or vegetable peels.
                </p>
              </div>

              {/* Blue Bin */}
              <div className="p-3 rounded-xl bg-surface border border-blue-500/30 space-y-1">
                <span className="inline-flex items-center gap-1 font-black text-[11px] text-blue-600 dark:text-blue-400">
                  🔵 Blue Bin (Dry Waste)
                </span>
                <p className="text-[11px] text-muted leading-tight">
                  Recyclable items: clean paper, plastics, glass, and metals.
                </p>
              </div>

              {/* Red Bin */}
              <div className="p-3 rounded-xl bg-surface border border-rose-500/30 space-y-1">
                <span className="inline-flex items-center gap-1 font-black text-[11px] text-rose-600 dark:text-rose-400">
                  🔴 Red Bin (Sanitary Waste)
                </span>
                <p className="text-[11px] text-muted leading-tight">
                  Hygiene & medical products: used diapers, sanitary napkins, and tampons.
                </p>
              </div>

              {/* Black Bin */}
              <div className="p-3 rounded-xl bg-surface border border-amber-500/30 space-y-1">
                <span className="inline-flex items-center gap-1 font-black text-[11px] text-amber-600 dark:text-amber-400">
                  ⚫ Black Bin (Hazardous Waste)
                </span>
                <p className="text-[11px] text-muted leading-tight">
                  Special care & toxic items: expired medicines, e-waste, burnt-out bulbs, and paint cans.
                </p>
              </div>
            </div>
          </div>

          {/* CRITICAL AUDIT & DISPOSAL HIGHLIGHTED NOTE */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-xs space-y-2 text-foreground">
            <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-xs font-heading">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
              IMPORTANT AUDIT NOTE & DISPOSAL DIRECTIVE
            </div>
            <div className="space-y-1.5 text-xs text-foreground/90 leading-relaxed font-medium">
              <p>
                <strong>1. Segregation at Source:</strong> Always deposit wet organic matter directly into the <strong>🟢 Green Bin</strong> free of plastic wrap, polythene liners, or non-biodegradable packaging.
              </p>
              <p>
                <strong>2. Recyclable Cleanliness:</strong> Rinse food and liquid residues from <strong>🔵 Blue Bin</strong> plastic bottles, aluminium cans, and food containers prior to disposal to prevent cross-stream contamination.
              </p>
              <p>
                <strong>3. Biohazard & Sanitary Isolation:</strong> <strong>🔴 Red Bin</strong> sanitary napkins, used diapers, and medical materials must <em>NEVER</em> be mixed with household dry recyclables. Wrap securely and dispose in dedicated clinical containers.
              </p>
              <p>
                <strong>4. Hazardous & E-Waste Safeguard:</strong> <strong>⚫ Black Bin</strong> items (batteries, fluorescent bulbs, electronic devices, chemical solvents) must be taken to authorized municipal drop-off kiosks to prevent soil and groundwater toxicity.
              </p>
              <p className="text-[11px] text-muted pt-1 border-t border-amber-500/20 italic">
                * Note: Disposal streams and bin colors are recommended based on standard municipal guidelines. Always verify local jurisdictional bylaws.
              </p>
            </div>
          </div>

          {/* Waste Composition Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
            {Object.entries(result.summary || {}).map(([key, val]) => (
              <div key={key} className="p-3 rounded-xl bg-surface-hover border border-border">
                <span className="text-[10px] uppercase font-bold text-muted block capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="text-lg font-black text-foreground">{val}</span>
              </div>
            ))}
          </div>

          {/* Itemized Detected Objects Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 font-heading">
              <Layers className="w-4 h-4 text-primary" />
              Itemized Object Analysis & Bin Recommendations
            </h4>

            <div className="space-y-3">
              {objects.map((item, idx) => {
                const bin = resolveBinRecommendation(item.stream || item.category);

                return (
                  <div 
                    key={item.id || idx}
                    className="p-4 rounded-2xl bg-surface-hover border border-border space-y-2 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/60">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-mono font-bold bg-primary/10 text-primary">
                          #{idx + 1}
                        </span>
                        <span className="font-extrabold text-sm text-foreground">{item.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${bin.badgeClass}`}>
                          {bin.name}
                        </span>
                      </div>
                      <div className="text-right text-[11px] text-muted">
                        Confidence: <strong className="text-emerald-500 font-bold">{item.confidence}%</strong> • Material: <strong className="text-foreground">{item.material || 'Standard'}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                      <div>
                        <span className="text-muted block font-semibold">Recommended Bin</span>
                        <strong className="text-primary">{bin.binLabel}</strong>
                      </div>
                      <div>
                        <span className="text-muted block font-semibold">Recommended Processing</span>
                        <span className="text-foreground font-medium">
                          {Array.isArray(item.processing) ? item.processing.join(', ') : item.processing}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted block font-semibold">Potential Recovery</span>
                        <span className="text-foreground font-medium">
                          {Array.isArray(item.recovery) ? item.recovery.join(', ') : item.recovery}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-muted pt-1">
                      <strong>Instruction:</strong> {item.disposalInstruction || bin.handlingSummary}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legal / Municipal Disclaimer Footer */}
          <div className="pt-4 border-t border-border text-[10px] text-muted text-center space-y-1">
            <p>
              * This report was generated automatically by EcoSmart AI Multi-Object Computer Vision.
            </p>
            <p>
              Recommended bin and disposal streams should always be verified against local municipal solid waste management guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
