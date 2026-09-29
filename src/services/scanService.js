import { 
  db, 
  isLiveFirebase, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  deleteDoc, 
  serverTimestamp,
  updateDoc
} from './firebaseClient';

const LOCAL_SCANS_KEY = 'ecosmart_user_scans';

/**
 * Save completed scan to Firestore
 */
export async function saveScanRecord({ userId, userEmail, imageUrl, scanResult }) {
  const scanId = scanResult.analysisId || `scan_${Date.now()}`;
  const now = new Date().toISOString();

  const record = {
    scanId,
    userId: userId || 'anonymous',
    userEmail: userEmail || 'guest@ecosmart.local',
    imageUrl: imageUrl || scanResult.imageSrc || '',
    createdAt: now,
    totalObjects: scanResult.totalObjects || (scanResult.objects || []).length,
    objects: scanResult.objects || scanResult.items || [],
    summary: scanResult.summary || {},
    overallConfidence: scanResult.overallConfidence || 90,
    recoveryMin: scanResult.recoveryMin || 70,
    recoveryMax: scanResult.recoveryMax || 90,
    contaminationLevel: scanResult.contaminationLevel || 'Low',
    hasHazardous: Boolean(scanResult.hasHazardous),
    hasBiomedical: Boolean(scanResult.hasBiomedical),
    status: 'completed'
  };

  // 1. Save to local storage for instant offline resilience
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_SCANS_KEY) || '[]');
    const filtered = existing.filter(s => s.scanId !== scanId);
    filtered.unshift(record);
    localStorage.setItem(LOCAL_SCANS_KEY, JSON.stringify(filtered.slice(0, 50)));
  } catch (err) {
    console.warn('Local scan cache warning:', err);
  }

  // 2. Persist to Firestore if available
  if (isLiveFirebase && db) {
    try {
      const scanRef = doc(db, 'scans', scanId);
      await setDoc(scanRef, {
        ...record,
        firestoreTimestamp: serverTimestamp()
      });
      console.log('[ScanService] Scan persisted to Firestore:', scanId);

      // Award Eco Points if authenticated
      if (userId && userId !== 'anonymous') {
        await awardScanEcoPoints(userId, record);
      }
    } catch (err) {
      console.warn('[ScanService] Firestore save warning:', err.message);
    }
  }

  return record;
}

/**
 * Award user eco points and evaluate badge unlocks
 */
async function awardScanEcoPoints(userId, scanRecord) {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);

    let earnedPoints = 10; // Standard segregation scan
    if (scanRecord.hasHazardous) earnedPoints += 15; // Hazardous isolation bonus

    if (snap.exists()) {
      const data = snap.data();
      const newPoints = (data.ecoPoints || 0) + earnedPoints;
      const scanCount = (data.totalScans || 0) + 1;
      const updatedBadges = evaluateBadges(scanCount, newPoints, scanRecord);

      await updateDoc(userRef, {
        ecoPoints: newPoints,
        totalScans: scanCount,
        badges: updatedBadges,
        lastScanAt: scanRecord.createdAt
      });
    }
  } catch (err) {
    console.warn('[ScanService] Eco points award error:', err.message);
  }
}

/**
 * Evaluate badge unlocks based on user accomplishments
 */
export function evaluateBadges(scanCount, ecoPoints, latestScan = null) {
  const badges = [
    { id: 'starter', name: 'Green Starter', icon: '🌱', description: 'Completed first waste scan', unlocked: scanCount >= 1 },
    { id: 'recycler', name: 'Recycling Explorer', icon: '♻️', description: 'Classified 5+ waste items', unlocked: scanCount >= 5 },
    { id: 'champion', name: 'Eco Champion', icon: '🌍', description: 'Accumulated 100+ Eco Points', unlocked: ecoPoints >= 100 },
    { id: 'ewaste', name: 'E-Waste Awareness', icon: '🔋', description: 'Identified and safely handled hazardous e-waste', unlocked: Boolean(latestScan?.hasHazardous) || ecoPoints >= 50 },
    { id: 'organic', name: 'Organic Waste Expert', icon: '🥬', description: 'Successfully segregated organic compostables', unlocked: scanCount >= 3 },
    { id: 'zerowaste', name: 'Zero Waste Contributor', icon: '🏆', description: 'Top tier sustainability community contributor', unlocked: ecoPoints >= 250 }
  ];
  return badges;
}

/**
 * Retrieve scans for a user (or local fallback)
 */
export async function getUserScans(userId) {
  let scans = [];

  if (isLiveFirebase && db && userId && userId !== 'anonymous') {
    try {
      const scansRef = collection(db, 'scans');
      const q = query(scansRef, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(50));
      const querySnap = await getDocs(q);
      querySnap.forEach(d => {
        scans.push(d.data());
      });
    } catch (err) {
      console.warn('[ScanService] Firestore fetch error, falling back to local:', err.message);
    }
  }

  // Fallback / merge with local storage
  if (scans.length === 0) {
    try {
      const local = JSON.parse(localStorage.getItem(LOCAL_SCANS_KEY) || '[]');
      if (userId && userId !== 'anonymous') {
        scans = local.filter(s => s.userId === userId || s.userId === 'anonymous');
      } else {
        scans = local;
      }
    } catch {
      scans = [];
    }
  }

  return scans;
}

/**
 * Delete scan by ID
 */
export async function deleteScanRecord(scanId) {
  // Remove from local storage
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_SCANS_KEY) || '[]');
    const filtered = existing.filter(s => s.scanId !== scanId);
    localStorage.setItem(LOCAL_SCANS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Local scan deletion warning:', err);
  }

  // Remove from Firestore
  if (isLiveFirebase && db) {
    try {
      await deleteDoc(doc(db, 'scans', scanId));
      console.log('[ScanService] Deleted scan from Firestore:', scanId);
    } catch (err) {
      console.warn('[ScanService] Firestore deletion error:', err.message);
    }
  }

  return true;
}

/**
 * Get aggregated system statistics for Admin & User Dashboards
 */
export async function getAggregatedStatistics() {
  let totalScans = 0;
  let totalObjects = 0;
  let categoryCounts = {
    wetOrganic: 0,
    dryRecyclable: 0,
    biomedical: 0,
    hazardous: 0,
    general: 0
  };
  let confidenceSum = 0;
  let recentScans = [];

  if (isLiveFirebase && db) {
    try {
      const scansRef = collection(db, 'scans');
      const q = query(scansRef, orderBy('createdAt', 'desc'), limit(100));
      const snap = await getDocs(q);
      snap.forEach(d => {
        const item = d.data();
        totalScans++;
        totalObjects += Number(item.totalObjects || 0);
        confidenceSum += Number(item.overallConfidence || 90);
        recentScans.push(item);

        if (item.summary) {
          categoryCounts.wetOrganic += Number(item.summary.wetOrganic || 0);
          categoryCounts.dryRecyclable += Number(item.summary.dryRecyclable || 0);
          categoryCounts.biomedical += Number(item.summary.biomedical || 0);
          categoryCounts.hazardous += Number(item.summary.hazardous || 0);
          categoryCounts.general += Number(item.summary.general || 0);
        }
      });
    } catch (e) {
      console.warn('[ScanService] Firestore aggregated stats query warning:', e.message);
    }
  }

  // Fallback to local scans if Firestore is empty
  if (totalScans === 0) {
    try {
      const local = JSON.parse(localStorage.getItem(LOCAL_SCANS_KEY) || '[]');
      totalScans = local.length;
      recentScans = local;
      local.forEach(item => {
        totalObjects += Number(item.totalObjects || 0);
        confidenceSum += Number(item.overallConfidence || 90);
        if (item.summary) {
          categoryCounts.wetOrganic += Number(item.summary.wetOrganic || 0);
          categoryCounts.dryRecyclable += Number(item.summary.dryRecyclable || 0);
          categoryCounts.biomedical += Number(item.summary.biomedical || 0);
          categoryCounts.hazardous += Number(item.summary.hazardous || 0);
          categoryCounts.general += Number(item.summary.general || 0);
        }
      });
    } catch {}
  }

  const avgConfidence = totalScans > 0 ? Math.round(confidenceSum / totalScans) : 92;

  return {
    totalScans,
    totalObjects,
    avgConfidence,
    categoryCounts,
    recentScans: recentScans.slice(0, 10)
  };
}
