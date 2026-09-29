/**
 * EcoSmart AI Waste Classification & Local Municipal Rules Configuration
 * Separates AI object classification from municipal disposal rules.
 */

export const wasteBinConfig = {
  wet_organic: {
    streamId: 'wet_organic',
    color: 'green',
    hex: '#10b981',
    name: 'Wet / Organic',
    binLabel: 'Green Bin',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    disclaimer: 'Recommended bin/stream — verify local municipal rules.',
    handlingSummary: 'Compostable organic matter. Deposit in the green bin without non-biodegradable plastic packaging.',
    acceptedExamples: ['Food leftovers', 'Fruit peels', 'Vegetable scraps', 'Eggshells', 'Coffee grounds', 'Tea leaves', 'Garden waste'],
    processingMethods: ['Aerobic Composting', 'Vermicomposting', 'Anaerobic Digestion'],
    recoveryOutputs: ['Compost', 'Soil Amendment', 'Biogas / Bio-CNG']
  },
  dry_recyclable: {
    streamId: 'dry_recyclable',
    color: 'blue',
    hex: '#3b82f6',
    name: 'Dry / Recyclable',
    binLabel: 'Blue Bin',
    badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    disclaimer: 'Recommended bin/stream — verify local municipal rules.',
    handlingSummary: 'Recyclable dry packaging and materials. Clean and rinse residues before depositing.',
    acceptedExamples: ['PET bottles', 'HDPE containers', 'Cardboard boxes', 'Newspapers', 'Aluminium cans', 'Steel cans', 'Glass jars'],
    processingMethods: ['Material Sorting', 'Mechanical Recycling', 'Pelletization', 'Smelting'],
    recoveryOutputs: ['Recycled PET Flakes', 'Recycled Cardboard', 'Aluminium Ingots', 'Recycled Glass']
  },
  biomedical: {
    streamId: 'biomedical',
    color: 'red',
    hex: '#ef4444',
    name: 'Biomedical / Sanitary',
    binLabel: 'Red Bin / Clinical Container',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    disclaimer: 'Recommended bin/stream — verify local municipal rules.',
    safetyWarning: 'DO NOT MIX WITH NORMAL HOUSEHOLD WASTE. DO NOT HANDLE UNNECESSARILY.',
    handlingSummary: 'Infectious or sanitary risk material. Wrap securely, isolate, and route through designated clinical collection services.',
    acceptedExamples: ['Used syringes', 'Needles', 'Medical gloves', 'Bandages', 'Clinical dressings', 'Sanitary pads', 'Diapers'],
    processingMethods: ['Autoclaving', 'High-Temperature Incineration', 'Sterilization Disinfection'],
    recoveryOutputs: ['Pathogen-Free Ash', 'Thermal Energy Recovery']
  },
  hazardous: {
    streamId: 'hazardous',
    color: 'black',
    hex: '#1e293b',
    name: 'Hazardous / E-Waste',
    binLabel: 'Black Bin / Special Collection Point',
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    disclaimer: 'Recommended bin/stream — verify local municipal rules.',
    safetyWarning: 'SPECIAL HANDLING REQUIRED. NEVER DISPOSE IN STANDARD HOUSEHOLD WASTE OR WATER DRAINS.',
    handlingSummary: 'Toxic, chemical, or electronic item. Store safely in a dry container and take to an authorized municipal e-waste/hazardous dropoff point.',
    acceptedExamples: ['Lithium batteries', 'Button cells', 'Smartphones', 'Chargers', 'Circuit boards', 'Paint containers', 'Chemical solvents', 'Fluorescent lamps'],
    processingMethods: ['Hydrometallurgical Extraction', 'E-Waste Dismantling', 'Hazardous Neutralization'],
    recoveryOutputs: ['Extracted Precious Metals (Cobalt, Lithium, Copper)', 'Safe Residue Slag']
  },
  general: {
    streamId: 'general',
    color: 'white',
    hex: '#94a3b8',
    name: 'General / Non-Recoverable',
    binLabel: 'Grey/White Residual Bin',
    badgeClass: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    disclaimer: 'Recommended bin/stream — verify local municipal rules.',
    handlingSummary: 'Residual non-recoverable waste. Minimize usage and deposit in general municipal collection.',
    acceptedExamples: ['Heavily contaminated multi-layer sachets', 'Wax-coated wrappers', 'Mixed non-recyclable residue'],
    processingMethods: ['Refuse-Derived Fuel (RDF)', 'Engineered Sanitary Landfill'],
    recoveryOutputs: ['Industrial Process Heat', 'Inert Landfill Stabilized Material']
  }
};

/**
 * Standard municipal rules engine:
 * Resolves bin and handling rules from category/stream.
 */
export function resolveBinRecommendation(stream) {
  const normalized = (stream || 'general').toLowerCase().replace(/[^a-z_]/g, '_');
  
  if (normalized.includes('wet') || normalized.includes('organic')) {
    return wasteBinConfig.wet_organic;
  }
  if (normalized.includes('dry') || normalized.includes('recycl')) {
    return wasteBinConfig.dry_recyclable;
  }
  if (normalized.includes('bio') || normalized.includes('sanit') || normalized.includes('medic')) {
    return wasteBinConfig.biomedical;
  }
  if (normalized.includes('hazard') || normalized.includes('e_waste') || normalized.includes('batter') || normalized.includes('elect')) {
    return wasteBinConfig.hazardous;
  }
  return wasteBinConfig.general;
}

/**
 * Confidence rating helper
 */
export function getConfidenceTier(confidence) {
  const score = Number(confidence || 0);
  if (score >= 90) return { label: 'High Confidence', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
  if (score >= 75) return { label: 'Moderate Confidence', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
  if (score >= 60) return { label: 'Low Confidence', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', warning: 'AI confidence is low. Consider uploading a clearer image.' };
  return { label: 'Uncertain', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', warning: 'AI confidence is very low. Please upload a clearer, well-lit photo.' };
}
