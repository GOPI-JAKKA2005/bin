import React from 'react';
import { getCategoryMeta } from '../../utils/formatters';
import { Leaf, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export function WasteItemCard({ item, onClick }) {
  const catMeta = getCategoryMeta(item.category);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-2xl bg-surface border border-border hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      {item.imageUrl && (
        <div className="h-40 w-full overflow-hidden bg-slate-900 relative">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md ${catMeta.bg} ${catMeta.text} ${catMeta.border}`}>
              {catMeta.name}
            </span>
          </div>
        </div>
      )}

      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          {!item.imageUrl && (
            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border mb-2 ${catMeta.bg} ${catMeta.text} ${catMeta.border}`}>
              {catMeta.name}
            </span>
          )}
          <h3 className="font-bold text-base text-foreground font-heading group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-muted line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
          <span className="font-semibold text-primary">
            {item.recoveryMin}% - {item.recoveryMax}% Recovery
          </span>
          <span className="text-muted group-hover:text-foreground flex items-center gap-1 font-medium transition-colors">
            View Rules <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
}
