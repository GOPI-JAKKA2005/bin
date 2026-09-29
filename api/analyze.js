import { analyzeWasteImage } from '../server/ai-vision-service.js';
import { calculateRecoveryAndContamination, normalizeCompositions } from '../server/waste-engine.js';
import { getCollection, addDocument } from '../server/firestore-service.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { image, video, fileName = '', mediaType = 'image/jpeg', visualAnalysis = null } = req.body || {};

    if (!image && !video) {
      return res.status(400).json({ error: 'Missing required payload: "image" or "video" base64 field is required.' });
    }

    const payload = image || video;

    // 1. Execute AI Vision Multi-Object Detection Engine
    const aiResult = await analyzeWasteImage(payload, mediaType, fileName, visualAnalysis);

    if (aiResult.isNonWaste) {
      return res.status(200).json({
        success: true,
        isNonWaste: true,
        message: aiResult.message || 'No identifiable waste objects were detected.',
        imageQuality: aiResult.imageQuality,
        totalObjects: 0,
        objects: [],
        items: [],
        summary: aiResult.summary || { wetOrganic: 0, dryRecyclable: 0, biomedical: 0, hazardous: 0, general: 0 }
      });
    }

    const detectedObjects = aiResult.objects || [];

    // 2. Normalize compositions so total equals ~100%
    const normalizedItems = normalizeCompositions(detectedObjects);

    // 3. Fetch current catalog items from Firestore for enrichment if available
    let catalogItems = [];
    try {
      catalogItems = await getCollection('items');
    } catch {
      catalogItems = [];
    }

    // 4. Run Waste Recovery Engine rules
    const engineResult = calculateRecoveryAndContamination(normalizedItems, catalogItems);

    // Calculate aggregated overall confidence
    const totalConf = detectedObjects.reduce((acc, curr) => acc + (curr.confidence || 90), 0);
    const overallConfidence = detectedObjects.length > 0 ? Math.round(totalConf / detectedObjects.length) : 90;

    const hasHazardous = detectedObjects.some(o => o.stream === 'hazardous' || o.category === 'hazardous');
    const hasBiomedical = detectedObjects.some(o => o.stream === 'biomedical' || o.category === 'biomedical');

    const finalResponse = {
      success: true,
      analysisId: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      isNonWaste: false,
      imageQuality: aiResult.imageQuality || { acceptable: true, reason: '' },
      totalObjects: detectedObjects.length,
      objects: normalizedItems,
      items: normalizedItems, // backward compatibility
      overallConfidence,
      recoveryMin: engineResult.recoveryMin || 75,
      recoveryMax: engineResult.recoveryMax || 92,
      contaminationLevel: engineResult.contaminationLevel || 'Low Cross-Contamination Risk',
      hasHazardous,
      hasBiomedical,
      safetyPriorityList: engineResult.safetyPriorityList || [],
      summary: aiResult.summary || {
        wetOrganic: detectedObjects.filter(o => o.stream === 'wet_organic').length,
        dryRecyclable: detectedObjects.filter(o => o.stream === 'dry_recyclable').length,
        biomedical: detectedObjects.filter(o => o.stream === 'biomedical').length,
        hazardous: detectedObjects.filter(o => o.stream === 'hazardous').length,
        general: detectedObjects.filter(o => o.stream === 'general').length
      }
    };

    // 5. Async log to Firestore analyses
    try {
      await addDocument('analyses', {
        timestamp: finalResponse.timestamp,
        analysisId: finalResponse.analysisId,
        totalObjects: finalResponse.totalObjects,
        confidence: finalResponse.overallConfidence,
        hasHazardous,
        hasBiomedical,
        summary: finalResponse.summary
      });
    } catch (e) {
      console.warn('Analytics logging warning:', e.message);
    }

    return res.status(200).json(finalResponse);
  } catch (err) {
    console.error('[API /api/analyze Error]:', err);
    return res.status(500).json({ error: err.message || 'Internal Waste Analysis Server Error' });
  }
}
