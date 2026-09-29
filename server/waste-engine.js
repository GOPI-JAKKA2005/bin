/**
 * Core Waste Recovery Engine & Rule Processing Algorithm
 */

export function normalizeCompositions(detectedItems) {
  if (!detectedItems || !detectedItems.length) return [];

  // Calculate sum of initial confidence or raw percentages
  const rawSum = detectedItems.reduce((acc, item) => acc + (item.rawPercentage || 100 / detectedItems.length), 0);

  if (rawSum === 0) {
    const equalShare = 100 / detectedItems.length;
    return detectedItems.map(item => ({ ...item, compositionPercent: Math.round(equalShare) }));
  }

  let totalPercentage = 0;
  const normalized = detectedItems.map((item, idx) => {
    const pct = Math.round(((item.rawPercentage || (100 / detectedItems.length)) / rawSum) * 100);
    totalPercentage += pct;
    return { ...item, compositionPercent: pct };
  });

  // Adjust rounding diff on highest percentage item so total equals exactly 100%
  const diff = 100 - totalPercentage;
  if (diff !== 0 && normalized.length > 0) {
    normalized[0].compositionPercent = Math.max(1, normalized[0].compositionPercent + diff);
  }

  return normalized;
}

export function calculateRecoveryAndContamination(items, catalogItems = []) {
  if (!items || items.length === 0) {
    return {
      type: 'single',
      isMixed: false,
      overallConfidence: 0,
      recoveryMin: 0,
      recoveryMax: 0,
      contaminationLevel: 'Low',
      hasHazardous: false,
      hasBiomedical: false,
      safetyPriorityList: []
    };
  }

  const isMixed = items.length > 1;
  let totalMinRecovery = 0;
  let totalMaxRecovery = 0;
  let weightedConfidenceSum = 0;
  let totalCompositionPct = 0;

  let hasHazardous = false;
  let hasBiomedical = false;
  let highContaminationCount = 0;

  const processedItems = items.map(item => {
    // Lookup full catalog metadata if available
    const matchedCatalog = catalogItems.find(c =>
      c.id === item.id ||
      c.name.toLowerCase().includes(item.name.toLowerCase()) ||
      item.name.toLowerCase().includes(c.name.toLowerCase())
    );

    const category = matchedCatalog?.category || item.category || 'dry';
    const recoveryMin = matchedCatalog?.recoveryMin ?? item.recoveryMin ?? 50;
    const recoveryMax = matchedCatalog?.recoveryMax ?? item.recoveryMax ?? 85;
    const isBio = Boolean(matchedCatalog?.biomedical || item.biomedical || category === 'biomedical');
    const isHaz = Boolean(matchedCatalog?.hazardous || item.hazardous || category === 'hazardous');

    if (isBio) hasBiomedical = true;
    if (isHaz) hasHazardous = true;
    if (category === 'biomedical' || category === 'hazardous') highContaminationCount++;

    const compPct = (item.compositionPercent || 100) / 100;
    totalMinRecovery += recoveryMin * compPct;
    totalMaxRecovery += recoveryMax * compPct;
    weightedConfidenceSum += (item.confidence || 80) * compPct;
    totalCompositionPct += item.compositionPercent || 100;

    return {
      ...item,
      category,
      recoveryMin,
      recoveryMax,
      biomedical: isBio,
      hazardous: isHaz,
      matchedCatalog
    };
  });

  // Calculate contamination severity
  let contaminationLevel = 'Low';
  if (hasBiomedical) {
    contaminationLevel = 'Critical (Biohazard)';
  } else if (hasHazardous) {
    contaminationLevel = 'High (Toxic/Hazardous)';
  } else if (isMixed && processedItems.some(i => i.category === 'wet') && processedItems.some(i => i.category === 'dry')) {
    contaminationLevel = 'Moderate (Organic Moisture on Dry Recyclables)';
  }

  // Contamination penalty on recovery potential
  let recoveryPenalty = 0;
  if (hasBiomedical) recoveryPenalty = 30;
  else if (hasHazardous) recoveryPenalty = 15;
  else if (contaminationLevel.includes('Moderate')) recoveryPenalty = 10;

  const finalMinRecovery = Math.max(0, Math.round(totalMinRecovery - recoveryPenalty));
  const finalMaxRecovery = Math.min(100, Math.round(totalMaxRecovery - (recoveryPenalty / 2)));
  const overallConfidence = Math.round(weightedConfidenceSum);

  // Generate strict safety handling order:
  // Hazardous/Biomedical -> Safety handling -> Segregation -> Treatment -> Recovery
  const safetyPriorityList = [];

  if (hasBiomedical) {
    safetyPriorityList.push({
      step: 1,
      type: 'hazard',
      title: 'CRITICAL BIOHAZARD WARNING',
      action: 'Do not handle barehanded. Wear heavy-duty nitrile gloves, fluid-resistant apron, and N95 mask.',
      urgent: true
    });
    safetyPriorityList.push({
      step: 2,
      type: 'isolation',
      title: 'Biomedical Isolation',
      action: 'Isolate item immediately in a yellow biohazard bag or rigid puncture-resistant container.',
      urgent: true
    });
  }

  if (hasHazardous) {
    safetyPriorityList.push({
      step: safetyPriorityList.length + 1,
      type: 'hazard',
      title: 'TOXIC / FLAMMABLE HAZARD ALERT',
      action: 'Keep away from open flames, heat sources, and water. Tape open electrical terminals.',
      urgent: true
    });
    safetyPriorityList.push({
      step: safetyPriorityList.length + 1,
      type: 'handling',
      title: 'Hazardous Waste Containment',
      action: 'Store in a dedicated chemical-resistant bin until transport to a certified e-waste or hazard depot.',
      urgent: false
    });
  }

  safetyPriorityList.push({
    step: safetyPriorityList.length + 1,
    type: 'segregation',
    title: 'Stream Segregation',
    action: isMixed
      ? 'Physical sorting required: Separate wet organic matter from dry recyclables prior to disposal.'
      : 'Place into designated material bin according to local authority color codes.',
    urgent: false
  });

  safetyPriorityList.push({
    step: safetyPriorityList.length + 1,
    type: 'treatment',
    title: 'Recommended Processing & Recovery',
    action: hasBiomedical
      ? 'Autoclaving / High-Temperature Incineration at certified medical waste treatment plant.'
      : (hasHazardous ? 'Hydrometallurgical extraction and heavy metal neutralization.' : 'Standard material recycling or composting process.'),
    urgent: false
  });

  return {
    isMixed,
    overallConfidence,
    recoveryMin: finalMinRecovery,
    recoveryMax: finalMaxRecovery,
    contaminationLevel,
    hasHazardous,
    hasBiomedical,
    items: processedItems,
    safetyPriorityList
  };
}
