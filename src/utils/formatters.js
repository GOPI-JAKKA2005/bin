export function formatFileSize(kb) {
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export function formatPercent(val) {
  return `${Math.round(val)}%`;
}

export function getConfidenceBadge(confidence) {
  if (confidence >= 80) {
    return {
      label: 'High Confidence',
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      color: '#10b981',
      retakeMessage: null
    };
  } else if (confidence >= 60) {
    return {
      label: 'Medium Confidence',
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      color: '#f59e0b',
      retakeMessage: null
    };
  } else {
    return {
      label: 'Low Confidence',
      badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      color: '#ef4444',
      retakeMessage: 'Uncertain detection. Please capture a clearer photo with good lighting.'
    };
  }
}

export function getCategoryMeta(category) {
  const cat = (category || 'dry').toLowerCase();
  switch (cat) {
    case 'wet':
      return { name: 'Wet / Organic Waste', color: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' };
    case 'dry':
      return { name: 'Dry / Recyclable Waste', color: '#3b82f6', bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20' };
    case 'biomedical':
      return { name: 'Biomedical Waste', color: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/20' };
    case 'hazardous':
      return { name: 'Hazardous Waste', color: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' };
    case 'mixed':
      return { name: 'Mixed Waste Stream', color: '#8b5cf6', bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/20' };
    default:
      return { name: 'General Waste', color: '#64748b', bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/20' };
  }
}
