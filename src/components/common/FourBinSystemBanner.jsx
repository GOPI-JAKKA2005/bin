import React from 'react';
import { Apple, Recycle, HeartPulse, AlertOctagon, CheckCircle2 } from 'lucide-react';

export function FourBinSystemBanner({ className = '' }) {
  const bins = [
    {
      colorName: 'Green Bin',
      title: 'Wet Waste',
      colorBg: 'bg-emerald-500/10',
      colorBorder: 'border-emerald-500/30',
      colorText: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-500 text-slate-950',
      icon: Apple,
      iconEmoji: '🟢',
      summary: 'Biodegradable organic matter',
      examples: 'Food leftovers, kitchen scraps, fruit & vegetable peels, coffee grounds, eggshells',
      recovery: 'Aerobic Composting → Organic Humus / Biogas'
    },
    {
      colorName: 'Blue Bin',
      title: 'Dry Waste',
      colorBg: 'bg-blue-500/10',
      colorBorder: 'border-blue-500/30',
      colorText: 'text-blue-600 dark:text-blue-400',
      badgeBg: 'bg-blue-500 text-white',
      icon: Recycle,
      iconEmoji: '🔵',
      summary: 'Recyclable dry materials',
      examples: 'Clean paper, cardboard, PET & HDPE plastics, glass bottles, aluminium & steel cans',
      recovery: 'Mechanical Sorting → rPET Flakes & Metal Ingots'
    },
    {
      colorName: 'Red Bin',
      title: 'Sanitary Waste',
      colorBg: 'bg-rose-500/10',
      colorBorder: 'border-rose-500/30',
      colorText: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-600 text-white',
      icon: HeartPulse,
      iconEmoji: '🔴',
      summary: 'Hygiene & medical products',
      examples: 'Used diapers, sanitary napkins, tampons, bandages, medical dressings, gloves, sharps',
      recovery: 'Autoclaving & Thermal Incineration → Pathogen-Free Ash'
    },
    {
      colorName: 'Black Bin',
      title: 'Hazardous Waste',
      colorBg: 'bg-slate-900/10 dark:bg-slate-800/40',
      colorBorder: 'border-amber-500/30',
      colorText: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-slate-900 text-amber-400 border border-amber-500/40',
      icon: AlertOctagon,
      iconEmoji: '⚫',
      summary: 'Special care & toxic items',
      examples: 'Expired medicines, e-waste, lithium batteries, burnt-out bulbs, solvents, paint cans',
      recovery: 'Hydrometallurgy & Neutralization → Cobalt & Lithium Recovery'
    }
  ];

  return (
    <div className={`w-full rounded-3xl bg-surface border border-border shadow-xl p-6 sm:p-8 space-y-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary block">
            MUNICIPAL STANDARD COMPLIANCE
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-foreground mt-0.5">
            Four-Bin Segregation System
          </h2>
          <p className="text-xs text-muted mt-1">
            EcoSmart AI automatically detects and maps every identified object to these four standardized streams.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 self-start sm:self-auto">
          AI Auto-Routing
        </span>
      </div>

      {/* Grid of the 4 Bins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {bins.map((bin) => {
          const IconComp = bin.icon;
          return (
            <div
              key={bin.colorName}
              className={`p-5 rounded-2xl border ${bin.colorBorder} ${bin.colorBg} flex flex-col justify-between space-y-4 transition-all hover:scale-[1.02] shadow-sm`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${bin.badgeBg}`}>
                    {bin.iconEmoji} {bin.colorName}
                  </span>
                  <IconComp className={`w-5 h-5 ${bin.colorText}`} />
                </div>

                <div>
                  <h3 className={`text-base font-bold font-heading ${bin.colorText}`}>
                    {bin.title}
                  </h3>
                  <p className="text-xs font-semibold text-foreground mt-0.5">
                    {bin.summary}
                  </p>
                </div>

                <div className="text-[11px] text-muted leading-relaxed">
                  <strong className="text-foreground block mb-0.5">Includes:</strong>
                  {bin.examples}
                </div>
              </div>

              <div className="pt-3 border-t border-border/40 text-[10px] text-muted">
                <strong className="text-primary block mb-0.5">Circular Output:</strong>
                {bin.recovery}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
