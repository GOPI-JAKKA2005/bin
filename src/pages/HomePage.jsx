import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Leaf, Recycle, Activity, AlertTriangle, ShieldCheck, ArrowRight, CheckCircle2, Globe, Cpu } from 'lucide-react';
import { CameraCapture } from '../components/analyzer/CameraCapture';
import { useWasteAnalyzer } from '../hooks/useWasteAnalyzer';
import { SingleResultCard } from '../components/analyzer/SingleResultCard';
import { MixedResultCard } from '../components/analyzer/MixedResultCard';
import { ImageCompressorView } from '../components/analyzer/ImageCompressorView';
import { useSettings } from '../contexts/SettingsContext';

export function HomePage() {
  const { settings } = useSettings();
  const { analyzing, compressing, compressionStats, result, error, processMediaAndAnalyze, resetAnalyzer } = useWasteAnalyzer();

  const categories = [
    { name: 'Wet / Organic Waste', color: 'from-emerald-500 via-emerald-600 to-green-700', icon: Leaf, desc: 'Banana peels, grapes, fruit & food scraps, coffee grounds, garden trim.', range: '70%–95% Recovery' },
    { name: 'Dry / Recyclable Waste', color: 'from-amber-400 via-yellow-500 to-emerald-500', icon: Recycle, desc: 'PET plastic bottles, paper, cardboard, glass containers, metal cans.', range: '60%–90% Recovery' },
    { name: 'Biomedical Waste', color: 'from-amber-500 via-red-500 to-rose-600', icon: Activity, desc: 'Syringes, needles, clinical gloves, bandages, expired drugs.', range: 'Strict Biohazard' },
    { name: 'Hazardous Waste', color: 'from-yellow-400 via-amber-500 to-emerald-600', icon: AlertTriangle, desc: 'Lithium batteries, paints, solvents, e-waste, mercury bulbs.', range: 'Toxic Handling' },
  ];

  return (
    <div className="space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-emerald-500/20 border border-amber-400/40 text-amber-600 dark:text-amber-400 font-extrabold text-xs shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
          AI Waste Segregation Engine v2.0
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black tracking-tight font-heading text-foreground max-w-4xl mx-auto leading-tight"
        >
          Identify, Segregate & Recover Waste with <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-500 bg-clip-text text-transparent">AI Vision & Eco Intelligence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed"
        >
          Upload or capture any waste item (e.g. Bananas, Grapes, Bottles, Cans, Batteries). Our AI identifies items instantly and guides you on Wet Organic, Dry Recyclable, Biomedical, and Hazardous segregation!
        </motion.p>
      </section>

      {/* Main Analyzer Scanner Container */}
      <section className="max-w-3xl mx-auto">
        {result ? (
          <div>
            {result.isMixed ? (
              <MixedResultCard result={result} onRetake={resetAnalyzer} />
            ) : (
              <SingleResultCard result={result} onRetake={resetAnalyzer} />
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <CameraCapture
              onCapture={(b64) => processMediaAndAnalyze(b64, false)}
              onUpload={(file, isVideo, fn) => processMediaAndAnalyze(file, isVideo, fn)}
              disabled={analyzing}
            />

            {compressing && (
              <div className="p-6 rounded-3xl bg-surface border border-amber-500/30 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-500 flex items-center justify-center mx-auto animate-spin">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-foreground">Compressing & Preparing Media...</h4>
                <p className="text-xs text-muted">Optimizing payload to ~{settings.compressionTargetKB || 500}KB before sending to serverless AI endpoint.</p>
              </div>
            )}

            {compressionStats && <ImageCompressorView stats={compressionStats} />}

            {analyzing && !compressing && (
              <div className="p-8 rounded-3xl bg-surface border border-emerald-500/30 text-center space-y-3 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-400 to-emerald-500 text-slate-950 flex items-center justify-center mx-auto animate-bounce">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-foreground font-heading">AI Vision Model Analyzing Objects...</h4>
                <p className="text-xs text-muted">Identifying item contents (Banana, Grapes, Bottles, Cans), stream categories, and recovery ranges.</p>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium text-center">
                ⚠️ {error}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Waste Category Grid Overview */}
      <section className="space-y-8 pt-8 border-t border-border">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold font-heading text-foreground">Supported Waste Classification Streams</h2>
          <p className="text-xs text-muted max-w-xl mx-auto">
            Our AI engine categorizes waste into 5 standardized streams to optimize resource recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-surface border border-border hover:border-amber-400/50 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all space-y-4 group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground font-heading">{cat.name}</h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{cat.desc}</p>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <span>{cat.range}</span>
                  <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link
            to="/guide"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400/10 via-yellow-400/10 to-emerald-500/10 border border-amber-400/30 text-foreground font-bold text-xs hover:border-emerald-500 hover:scale-102 transition-all shadow-sm"
          >
            Explore Complete Waste Directory Guide <ArrowRight className="w-4 h-4 text-amber-500" />
          </Link>
        </div>
      </section>
    </div>
  );
}
