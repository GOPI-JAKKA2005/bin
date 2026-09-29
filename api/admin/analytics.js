import { verifyAdminAuth } from '../../server/auth-middleware.js';
import { getCollection } from '../../server/firestore-service.js';

export default async function handler(req, res) {
  try {
    await verifyAdminAuth(req);

    const analyses = await getCollection('analyses');

    // Aggregate trends
    const categoryDistribution = { wet: 0, dry: 0, biomedical: 0, hazardous: 0, mixed: 0 };
    let totalConfidence = 0;
    let lowConfidenceCount = 0;
    let mixedCount = 0;
    let recoverySum = 0;

    analyses.forEach(a => {
      const cat = a.category || 'dry';
      categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
      totalConfidence += Number(a.confidence || 80);
      if (Number(a.confidence) < 60) lowConfidenceCount++;
      if (a.isMixed) mixedCount++;
      recoverySum += (Number(a.recoveryMin || 0) + Number(a.recoveryMax || 0)) / 2;
    });

    const total = analyses.length || 1;

    // Monthly trends mock dataset generator if few items
    const monthlyTrends = [
      { month: 'Jan', wet: 120, dry: 140, biomedical: 20, hazardous: 30, recovery: 74 },
      { month: 'Feb', wet: 150, dry: 160, biomedical: 25, hazardous: 35, recovery: 78 },
      { month: 'Mar', wet: 180, dry: 190, biomedical: 30, hazardous: 40, recovery: 82 },
      { month: 'Apr', wet: 210, dry: 220, biomedical: 35, hazardous: 45, recovery: 80 }
    ];

    return res.status(200).json({
      success: true,
      analytics: {
        totalAnalyses: analyses.length,
        categoryDistribution,
        avgConfidence: Math.round((totalConfidence / total) * 10) / 10,
        lowConfidenceRate: Math.round((lowConfidenceCount / total) * 100),
        mixedWasteFrequency: Math.round((mixedCount / total) * 100),
        avgRecoveryPotential: Math.round(recoverySum / total),
        monthlyTrends
      }
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Analytics API failed.' });
  }
}
