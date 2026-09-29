import React from 'react';
import { Leaf, Recycle, Activity, AlertTriangle, Cpu, ArrowRight } from 'lucide-react';
import { getCategoryMeta } from '../../utils/formatters';

export function WasteCategoryCard({ category, isSelected, onClick }) {
  const meta = getCategoryMeta(category.id || category.name);

  const getIcon = (id) => {
    switch (id?.toLowerCase()) {
      case 'wet': return Leaf;
      case 'dry': return Recycle;
      case 'biomedical': return Activity;
      case 'hazardous': return AlertTriangle;
      default: return Cpu;
    }
  };

  const Icon = getIcon(category.id);

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between space-y-4 ${
        isSelected
          ? 'bg-primary text-white border-primary shadow-xl shadow-primary/25 scale-[1.02]'
          : 'bg-surface border-border hover:border-primary/40 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
          isSelected ? 'bg-white/20 text-white' : `${meta.bg} ${meta.text}`
        }`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
          isSelected ? 'bg-white/20 border-white/30 text-white' : `${meta.bg} ${meta.text} ${meta.border}`
        }`}>
          Priority #{category.handlingPriority || 3}
        </span>
      </div>

      <div>
        <h3 className={`text-lg font-bold font-heading ${isSelected ? 'text-white' : 'text-foreground'}`}>
          {category.name}
        </h3>
        <p className={`text-xs mt-1 leading-relaxed line-clamp-2 ${isSelected ? 'text-white/80' : 'text-muted'}`}>
          {category.description}
        </p>
      </div>

      <div className={`pt-3 border-t flex items-center justify-between text-xs font-semibold ${
        isSelected ? 'border-white/20 text-white' : 'border-border text-primary'
      }`}>
        <span>{category.recoveryMin}% - {category.recoveryMax}% Recovery</span>
        <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
      </div>
    </div>
  );
}
