import React, { useState } from 'react';
import { CameraCapture } from '../components/analyzer/CameraCapture';
import { AdvancedDetectionView } from '../components/analyzer/AdvancedDetectionView';
import { ObjectInspectionPanel } from '../components/analyzer/ObjectInspectionPanel';
import { CircularEconomyFlow } from '../components/analyzer/CircularEconomyFlow';
import { WasteAnalysisReportModal } from '../components/analyzer/WasteAnalysisReportModal';
import { ImageCompressorView } from '../components/analyzer/ImageCompressorView';
import { FourBinSystemBanner } from '../components/common/FourBinSystemBanner';
import { useWasteAnalyzer } from '../hooks/useWasteAnalyzer';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { resolveBinRecommendation } from '../config/wasteRules';
import { 
  Sparkles, 
  Cpu, 
  ShieldAlert, 
  Layers, 
  RefreshCw, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  UploadCloud,
  Check,
  Tag
} from 'lucide-react';

export function AnalyzePage() {
  const { settings } = useSettings();
  const { currentUser } = useAuth();
  const { 
    analyzing, 
    compressing, 
    processingState, 
    compressionStats, 
    result, 
    error, 
    processMediaAndAnalyze, 
    resetAnalyzer 
  } = useWasteAnalyzer();

  const [selectedObjIdx, setSelectedObjIdx] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);

  const objects = result?.objects || result?.items || [];
  const currentObject = objects[selectedObjIdx] || objects[0] || null;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      {/* Page Title & Subtitle */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Sparkles className="w-3.5 h-3.5" />
          AI Multi-Object Computer Vision
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground">
          AI Waste Classification & Circular Recovery
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-2xl mx-auto">
          Capture or upload an image containing one or multiple waste objects. Our neural vision engine detects, segments, and assigns local municipal disposal streams to every identifiable item.
        </p>
      </div>

      {/* RESULT VIEW */}
      {result ? (
        <div className="space-y-8 animate-fadeIn">
          
          {/* NON-WASTE CASE */}
          {result.isNonWaste || objects.length === 0 ? (
            <div className="p-8 rounded-3xl bg-surface border border-border shadow-xl text-center space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-2xl">
                ⚠️
              </div>
              <h3 className="text-xl font-bold font-heading text-foreground">
                No Identifiable Waste Objects Detected
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                {result.message || 'The uploaded photograph does not appear to contain recognizable municipal waste items. Please ensure waste objects are clearly visible, well-lit, and unobstructed.'}
              </p>
              <button
                onClick={resetAnalyzer}
                className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/25 hover:bg-primary-hover transition-all flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Upload Another Image
              </button>
            </div>
          ) : (
            <>
              {/* TOP HEADER CONTROLS BANNER */}
              <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      {objects.length} Waste Object{objects.length !== 1 ? 's' : ''} Detected
                    </span>
                    <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      Overall Confidence: {result.overallConfidence}%
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold font-heading text-foreground mt-1">
                    Multi-Object Scan Results
                  </h2>
                </div>

                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-lg shadow-primary/25 hover:bg-primary-hover transition-all flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Audit Report
                  </button>

                  <button
                    onClick={resetAnalyzer}
                    className="px-4 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-muted hover:text-foreground hover:bg-surface-hover transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    New Scan
                  </button>
                </div>
              </div>

              {/* BOUNDING BOX VIEWER HUD */}
              <AdvancedDetectionView
                imageSrc={result.imageSrc}
                items={objects}
                overallConfidence={result.overallConfidence}
                selectedItemIndex={selectedObjIdx}
                onSelectItem={(idx) => setSelectedObjIdx(idx !== null ? idx : 0)}
              />

              {/* OBJECTS LIST & INSPECTION DUAL LAYOUT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Objects List Sidebar (5 cols) */}
                <div className="lg:col-span-5 rounded-3xl bg-surface border border-border shadow-xl p-5 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <h3 className="text-sm font-bold text-foreground font-heading flex items-center gap-2">
                      <Tag className="w-4 h-4 text-primary" />
                      Detected Objects ({objects.length})
                    </h3>
                    <span className="text-[10px] text-muted font-medium">Click to inspect</span>
                  </div>

                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                    {objects.map((item, idx) => {
                      const isSelected = selectedObjIdx === idx;
                      const bin = resolveBinRecommendation(item.stream || item.category);

                      return (
                        <div
                          key={item.id || idx}
                          onClick={() => setSelectedObjIdx(idx)}
                          className={`p-3.5 rounded-2xl cursor-pointer transition-all border text-xs flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-primary/10 border-primary ring-2 ring-primary/30 shadow-md scale-[1.02]'
                              : 'bg-surface-hover border-border hover:border-border/80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-surface border border-border flex items-center justify-center font-mono font-bold text-[10px] text-muted shrink-0">
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <span className="font-bold text-foreground block truncate">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-muted block truncate">
                                {item.material || 'Material'} • <span className="text-primary font-medium">{bin.name}</span>
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[11px] font-extrabold text-emerald-500 block">
                              {item.confidence}%
                            </span>
                            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: bin.hex }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Selected Object Inspection Panel (7 cols) */}
                <div className="lg:col-span-7">
                  {currentObject && (
                    <ObjectInspectionPanel
                      object={currentObject}
                      index={selectedObjIdx}
                      totalCount={objects.length}
                    />
                  )}
                </div>
              </div>

              {/* WASTE COMPOSITION SUMMARY STATS */}
              <div className="p-6 rounded-3xl bg-surface border border-border shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground font-heading flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    Aggregated Waste Composition Summary
                  </h3>
                  <span className="text-xs text-muted">
                    Total Detected: <strong className="text-foreground">{objects.length} Items</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                      🟢 Wet / Organic
                    </span>
                    <span className="text-2xl font-black text-foreground">
                      {result.summary?.wetOrganic || objects.filter(o => o.stream === 'wet_organic').length}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center space-y-1">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                      🔵 Dry / Recyclable
                    </span>
                    <span className="text-2xl font-black text-foreground">
                      {result.summary?.dryRecyclable || objects.filter(o => o.stream === 'dry_recyclable').length}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-1">
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                      🔴 Biomedical
                    </span>
                    <span className="text-2xl font-black text-foreground">
                      {result.summary?.biomedical || objects.filter(o => o.stream === 'biomedical').length}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-1">
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                      ⚫ Hazardous / E-Waste
                    </span>
                    <span className="text-2xl font-black text-foreground">
                      {result.summary?.hazardous || objects.filter(o => o.stream === 'hazardous').length}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-500/10 border border-slate-500/20 text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                      ⚪ General / Residual
                    </span>
                    <span className="text-2xl font-black text-foreground">
                      {result.summary?.general || objects.filter(o => o.stream === 'general').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* DYNAMIC BEFORE -> AFTER CIRCULAR ECONOMY FLOW */}
              <CircularEconomyFlow objects={objects} />

              {/* FOUR-BIN SEGREGATION REFERENCE */}
              <FourBinSystemBanner />

              {/* REPORT MODAL */}
              {showReportModal && (
                <WasteAnalysisReportModal
                  result={result}
                  onClose={() => setShowReportModal(false)}
                  userEmail={currentUser?.email || 'Eco User'}
                />
              )}
            </>
          )}
        </div>
      ) : (
        /* UPLOAD & CAMERA SCANNER VIEW */
        <div className="space-y-6 max-w-2xl mx-auto">
          <CameraCapture
            onCapture={(b64) => processMediaAndAnalyze(b64, false, 'camera_capture.jpg')}
            onUpload={(file, isVideo, fn) => processMediaAndAnalyze(file, isVideo, fn || file?.name || '')}
            disabled={analyzing}
          />

          {/* STEP-BY-STEP PROGRESS BAR / STATE INDICATOR */}
          {analyzing && (
            <div className="p-6 rounded-3xl bg-surface border border-border text-center space-y-4 shadow-xl animate-fadeIn">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center mx-auto animate-bounce shadow-lg shadow-primary/25">
                <Sparkles className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-base text-foreground font-heading">
                  {processingState === 'compressing' && 'Optimizing Media for Vision Processing...'}
                  {processingState === 'uploading' && 'Uploading Image to Secure Cloud Storage...'}
                  {processingState === 'analyzing' && 'Detecting Multiple Waste Objects & Bounding Boxes...'}
                  {processingState === 'complete' && 'Finalizing Municipal Bin Recommendations...'}
                </h4>
                <p className="text-xs text-muted">
                  {processingState === 'compressing' && 'Compressing canvas payload to conserve bandwidth.'}
                  {processingState === 'uploading' && 'Hosting high-resolution media on ImgBB proxy.'}
                  {processingState === 'analyzing' && 'Inspecting foreground, background, and materials.'}
                  {processingState === 'complete' && 'Computing circular recovery outputs.'}
                </p>
              </div>

              {/* Progress Stepper Dots */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {['compressing', 'uploading', 'analyzing', 'complete'].map((st, i) => {
                  const statesOrder = ['compressing', 'uploading', 'analyzing', 'complete'];
                  const currentIndex = statesOrder.indexOf(processingState);
                  const isDone = currentIndex > i;
                  const isCurrent = currentIndex === i;

                  return (
                    <div key={st} className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-full transition-all ${
                        isDone ? 'bg-primary' : isCurrent ? 'bg-primary ring-4 ring-primary/20 animate-pulse' : 'bg-border'
                      }`} />
                      {i < 3 && <div className={`w-6 h-0.5 ${isDone ? 'bg-primary' : 'bg-border'}`} />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {compressionStats && <ImageCompressorView stats={compressionStats} />}

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium text-center space-y-2">
              <p>⚠️ {error}</p>
              <button
                onClick={resetAnalyzer}
                className="px-4 py-1.5 rounded-xl bg-surface border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-surface-hover text-xs font-bold"
              >
                Retry Scan
              </button>
            </div>
          )}

          {/* FOUR-BIN SEGREGATION REFERENCE BANNER */}
          <FourBinSystemBanner className="mt-8" />
        </div>
      )}
    </div>
  );
}
