/**
 * Validation utilities for incoming request payloads and Firestore data models
 */

export function validatePercentage(val, name = 'Percentage') {
  const num = Number(val);
  if (isNaN(num) || num < 0 || num > 100) {
    throw new Error(`${name} must be a valid number between 0 and 100.`);
  }
  return num;
}

export function validateMinMax(min, max, label = 'Range') {
  const minNum = validatePercentage(min, `${label} Minimum`);
  const maxNum = validatePercentage(max, `${label} Maximum`);
  if (minNum > maxNum) {
    throw new Error(`${label} Minimum (${minNum}%) cannot exceed Maximum (${maxNum}%).`);
  }
  return { min: minNum, max: maxNum };
}

export function validateHexColor(hex, defaultColor = '#10b981') {
  if (!hex || typeof hex !== 'string') return defaultColor;
  const match = /^#([0-9A-F]{3}){1,2}$/i.test(hex.trim());
  return match ? hex.trim() : defaultColor;
}

export function validateUrl(url) {
  if (!url) return '';
  try {
    new URL(url);
    return url;
  } catch {
    return '';
  }
}

export function sanitizeString(str, maxLength = 1000) {
  if (!str || typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
}

export function validateWasteItemInput(data) {
  if (!data.name || typeof data.name !== 'string') {
    throw new Error('Item name is required.');
  }
  if (!data.category || typeof data.category !== 'string') {
    throw new Error('Item category is required (Wet, Dry, Biomedical, Hazardous, Mixed).');
  }

  const recovery = validateMinMax(data.recoveryMin ?? 0, data.recoveryMax ?? 100, 'Recovery');
  const residual = validateMinMax(data.residualMin ?? 0, data.residualMax ?? 100, 'Residual');

  return {
    name: sanitizeString(data.name, 100),
    category: sanitizeString(data.category, 50),
    subcategory: sanitizeString(data.subcategory || '', 50),
    description: sanitizeString(data.description || '', 1000),
    examples: Array.isArray(data.examples) ? data.examples.map(e => sanitizeString(e, 50)) : [],
    biodegradable: Boolean(data.biodegradable),
    recyclable: Boolean(data.recyclable),
    compostable: Boolean(data.compostable),
    hazardous: Boolean(data.hazardous),
    biomedical: Boolean(data.biomedical),
    recoveryMin: recovery.min,
    recoveryMax: recovery.max,
    residualMin: residual.min,
    residualMax: residual.max,
    processingMethods: Array.isArray(data.processingMethods) ? data.processingMethods.map(m => sanitizeString(m, 100)) : [],
    recommendations: sanitizeString(data.recommendations || '', 1000),
    benefits: sanitizeString(data.benefits || '', 1000),
    warnings: sanitizeString(data.warnings || '', 1000),
    confidenceThreshold: Math.max(10, Math.min(100, Number(data.confidenceThreshold) || 60)),
    imageUrl: validateUrl(data.imageUrl),
    active: data.active !== false,
  };
}
