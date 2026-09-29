import { db, isFirebaseConfigured } from './firebase-admin.js';

// In-memory mock fallback store for offline / dev demo execution
const mockStore = {
  settings: {
    siteName: 'EcoSmart AI Waste System',
    logoUrl: '/logo.svg',
    bannerText: 'AI-Powered Sustainable Waste Classification, Segregation & Recovery System',
    defaultTheme: 'Eco Green',
    maintenanceMode: false,
    aiEnabled: true,
    videoAnalysisEnabled: true,
    chatbotEnabled: true,
    maxImageSizeMB: 10,
    maxVideoSizeMB: 25,
    compressionTargetKB: 500,
    confidenceThresholdHigh: 80,
    confidenceThresholdMedium: 60,
    contactEmail: 'support@ecosmartwaste.ai',
    contactPhone: '+1 (800) 555-ECO-1',
    footerText: '© 2026 EcoSmart AI Smart Waste Management System. Empowering global recycling & zero waste goals.',
    updatedAt: new Date().toISOString()
  },
  theme: {
    mode: 'system',
    preset: 'Eco Green',
    colors: {
      primary: '#10b981',
      primaryHover: '#059669',
      primaryLight: '#d1fae5',
      primaryDark: '#047857',
      secondary: '#06b6d4',
      secondaryHover: '#0891b2',
      accent: '#8b5cf6',
      accentHover: '#7c3aed',
      background: '#f8fafc',
      surface: '#ffffff',
      surfaceHover: '#f1f5f9',
      foreground: '#0f172a',
      muted: '#64748b',
      mutedForeground: '#94a3b8',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444'
    },
    darkColors: {
      primary: '#10b981',
      primaryHover: '#34d399',
      primaryLight: '#064e3b',
      primaryDark: '#047857',
      secondary: '#22d3ee',
      secondaryHover: '#06b6d4',
      accent: '#a78bfa',
      accentHover: '#8b5cf6',
      background: '#0f172a',
      surface: '#1e293b',
      surfaceHover: '#334155',
      foreground: '#f8fafc',
      muted: '#94a3b8',
      mutedForeground: '#64748b',
      border: '#334155',
      success: '#10b981',
      warning: '#fbbf24',
      danger: '#f87171'
    }
  },
  categories: [
    {
      id: 'wet',
      name: 'Wet / Organic Waste',
      color: '#10b981',
      icon: 'Leaf',
      description: 'Biodegradable organic matter suitable for composting, anaerobic digestion, and bio-gas generation.',
      examples: ['Food scraps', 'Fruit peels', 'Coffee grounds', 'Yard trim', 'Tea leaves', 'Cooked meals'],
      recoveryMin: 70,
      recoveryMax: 95,
      handlingPriority: 3
    },
    {
      id: 'dry',
      name: 'Dry / Recyclable Waste',
      color: '#3b82f6',
      icon: 'Recycle',
      description: 'Clean recyclable inorganic materials such as paper, cardboard, plastic containers, metals, and glass.',
      examples: ['PET bottles', 'Cardboard boxes', 'Aluminum cans', 'Glass jars', 'Newspapers', 'HDPE containers'],
      recoveryMin: 60,
      recoveryMax: 90,
      handlingPriority: 4
    },
    {
      id: 'biomedical',
      name: 'Biomedical Waste',
      color: '#ef4444',
      icon: 'Activity',
      description: 'Infectious or biohazardous medical materials requiring high-temperature sterilization or autoclaving.',
      examples: ['Used syringes', 'Bandages', 'Surgical gloves', 'Expired medication', 'Swabs', 'IV bags'],
      recoveryMin: 0,
      recoveryMax: 15,
      handlingPriority: 1
    },
    {
      id: 'hazardous',
      name: 'Hazardous Waste',
      color: '#f59e0b',
      icon: 'AlertTriangle',
      description: 'Toxic, flammable, corrosive, or heavy-metal containing waste that poses acute environmental risks.',
      examples: ['Lithium batteries', 'Paint cans', 'Chemical solvents', 'Fluorescent tubes', 'Pesticide bottles', 'Motor oil'],
      recoveryMin: 10,
      recoveryMax: 40,
      handlingPriority: 2
    },
    {
      id: 'mixed',
      name: 'Mixed / E-Waste',
      color: '#8b5cf6',
      icon: 'Cpu',
      description: 'Multi-material composite waste, electronic equipment, and unsorted municipal waste streams.',
      examples: ['Circuit boards', 'Broken laptops', 'Composite packaging', 'Smartphones', 'Cable wires'],
      recoveryMin: 40,
      recoveryMax: 75,
      handlingPriority: 3
    }
  ],
  items: [
    {
      id: 'item-1',
      name: 'Plastic Water Bottle (PET)',
      category: 'dry',
      subcategory: 'Plastics',
      description: 'Polyethylene Terephthalate (PET) beverage container.',
      examples: ['Soda bottles', 'Mineral water bottles'],
      biodegradable: false,
      recyclable: true,
      compostable: false,
      hazardous: false,
      biomedical: false,
      recoveryMin: 75,
      recoveryMax: 95,
      residualMin: 5,
      residualMax: 25,
      processingMethods: ['Mechanical shredding', 'Pelletization', 'Polyester fiber spinning'],
      recommendations: 'Rinse with clean water, crush flat to conserve space, and place into dry recyclable bin.',
      benefits: 'Reduces crude oil consumption and prevents plastic pollution in oceans and landfills.',
      warnings: 'Ensure cap is removed if made from non-matching plastic grade.',
      confidenceThreshold: 70,
      active: true,
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'item-2',
      name: 'Banana Peel & Fruit Scraps',
      category: 'wet',
      subcategory: 'Food Waste',
      description: 'Organic raw vegetable and fruit residues rich in potassium and nitrogen.',
      examples: ['Banana peels', 'Apple cores', 'Citrus rinds'],
      biodegradable: true,
      recyclable: false,
      compostable: true,
      hazardous: false,
      biomedical: false,
      recoveryMin: 85,
      recoveryMax: 98,
      residualMin: 2,
      residualMax: 15,
      processingMethods: ['Aerobic composting', 'Vermicomposting', 'Anaerobic bio-digestion'],
      recommendations: 'Chop into smaller pieces for faster decomposition and mix with brown yard dry matter.',
      benefits: 'Creates nutrient-rich soil humus and sequesters carbon in agricultural soil.',
      warnings: 'Avoid mixing with non-biodegradable plastic stickers attached to fruits.',
      confidenceThreshold: 75,
      active: true,
      imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'item-3',
      name: 'Used Hypodermic Syringe',
      category: 'biomedical',
      subcategory: 'Sharps',
      description: 'Medical needle and syringe assembly presenting potential biohazard needle-stick risk.',
      examples: ['Insulin syringes', 'Clinical blood sampling needles'],
      biodegradable: false,
      recyclable: false,
      compostable: false,
      hazardous: true,
      biomedical: true,
      recoveryMin: 0,
      recoveryMax: 10,
      residualMin: 90,
      residualMax: 100,
      processingMethods: ['Needle cutter sterilization', 'Autoclaving', 'High-temp incineration'],
      recommendations: 'Never recap needle. Deposit immediately into puncture-proof yellow medical sharps container.',
      benefits: 'Protects sanitation workers from bloodborne pathogen infections and hepatitis transmission.',
      warnings: 'CRITICAL: Biohazardous item! Do not place in household dry or wet bins under any circumstances.',
      confidenceThreshold: 85,
      active: true,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'item-4',
      name: 'Rechargeable Lithium-Ion Battery',
      category: 'hazardous',
      subcategory: 'E-Waste / Batteries',
      description: 'Energy storage cell containing lithium, cobalt, nickel, and volatile electrolyte liquid.',
      examples: ['Phone batteries', 'Vape batteries', 'Power tool batteries'],
      biodegradable: false,
      recyclable: true,
      compostable: false,
      hazardous: true,
      biomedical: false,
      recoveryMin: 45,
      recoveryMax: 70,
      residualMin: 30,
      residualMax: 55,
      processingMethods: ['Hydrometallurgical extraction', 'Pyrometallurgical smelting'],
      recommendations: 'Tape battery terminals with electrical tape and drop off at certified electronic waste collection hubs.',
      benefits: 'Recovers valuable critical metals (Cobalt, Lithium, Nickel) and prevents thermal runaway landfill fires.',
      warnings: 'DANGER: Damaged or punctured batteries can explode or ignite spontaneously!',
      confidenceThreshold: 80,
      active: true,
      imageUrl: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=600&q=80',
      updatedAt: new Date().toISOString()
    }
  ],
  chatbotKnowledge: [
    {
      id: 'kb-1',
      question: 'How do I segregate waste properly at home?',
      answer: 'Separate waste into 3 primary bins: 1) Green Bin for Wet/Organic (food scraps, yard trim), 2) Blue Bin for Dry/Recyclable (paper, plastic, metal, glass), and 3) Red/Yellow Box for Domestic Hazardous (batteries, chemicals, bulbs). Ensure recyclables are rinsed and dry.',
      category: 'Segregation',
      keywords: ['segregate', 'separate', 'bins', 'home', 'sorting'],
      priority: 10,
      active: true
    },
    {
      id: 'kb-2',
      question: 'What should I do with medical syringes or expired medicine?',
      answer: 'Biomedical materials like used syringes, bandages, and expired drugs must NEVER go into regular municipal bins. Store sharps in a sealed puncture-proof container and take them to authorized healthcare drop-off points or certified bio-hazard collection facilities.',
      category: 'Biomedical Safety',
      keywords: ['syringe', 'medicine', 'needle', 'medical', 'biomedical', 'pharmaceutical'],
      priority: 20,
      active: true
    },
    {
      id: 'kb-3',
      question: 'Can I compost cooked food or oily leftovers?',
      answer: 'Cooked food without heavy oil, meat, or dairy decomposes well in home composting. However, large amounts of oil, grease, or meat can attract pests and slow down aerobic composting. Consider Bokashi fermentation or municipal green bins for heavy oily waste.',
      category: 'Composting',
      keywords: ['compost', 'cooked food', 'oil', 'grease', 'meat'],
      priority: 8,
      active: true
    }
  ],
  pages: [
    {
      id: 'about',
      slug: 'about',
      title: 'About EcoSmart AI Waste Management',
      heroImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
      content: `## Transforming Waste Into Sustainable Resources

EcoSmart AI is a state-of-the-art waste intelligence platform engineered to revolutionize global waste segregation, resource recovery, and environmental management.

### Our Mission
We bridge cutting-edge Computer Vision artificial intelligence with circular economy practices to divert waste from landfills, minimize contamination rates, and optimize secondary material recovery.

### Key Capabilities
- **Multi-Object Waste Detection**: Real-time AI classification of wet, dry, biomedical, hazardous, and electronic waste streams.
- **Dynamic Composition Analysis**: Instant percentage composition and contamination risk scoring.
- **Safety First Architecture**: Strict safety hierarchy prioritizing immediate biohazard and toxicity warnings.
- **Admin Content & Rules Engine**: Complete control over recovery rules, material categories, chatbot knowledge, and visual themes.`,
      seoTitle: 'About Us - EcoSmart AI Waste System',
      seoDescription: 'Learn about EcoSmart AI smart waste classification, segregation technology, and sustainable recovery solutions.',
      published: true,
      order: 1,
      updatedAt: new Date().toISOString()
    }
  ],
  analytics: {
    totalAnalyses: 1420,
    categoryCounts: { wet: 580, dry: 490, biomedical: 95, hazardous: 115, mixed: 140 },
    avgConfidence: 87.4,
    recentAnalyses: [
      { id: 'an-1', timestamp: new Date().toISOString(), type: 'single', category: 'dry', itemName: 'PET Water Bottle', confidence: 94, recoveryEst: 85 },
      { id: 'an-2', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'mixed', category: 'mixed', itemCount: 3, confidence: 82, recoveryEst: 64 },
      { id: 'an-3', timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'single', category: 'wet', itemName: 'Banana Peel', confidence: 96, recoveryEst: 92 },
      { id: 'an-4', timestamp: new Date(Date.now() - 10800000).toISOString(), type: 'single', category: 'hazardous', itemName: 'Lithium Battery', confidence: 88, recoveryEst: 55 }
    ]
  }
};

/**
 * Generic Helper functions for Firestore / Mock Store CRUD
 */
export async function getDocument(collectionName, docId) {
  if (isFirebaseConfigured && db) {
    try {
      const doc = await db.collection(collectionName).doc(docId).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    } catch (err) {
      console.error(`Firestore getDocument (${collectionName}/${docId}) error:`, err);
    }
  }
  return mockStore[collectionName] ? (mockStore[collectionName][docId] || mockStore[collectionName]) : null;
}

export async function setDocument(collectionName, docId, data) {
  const updatedData = { ...data, updatedAt: new Date().toISOString() };
  if (isFirebaseConfigured && db) {
    try {
      await db.collection(collectionName).doc(docId).set(updatedData, { merge: true });
      return updatedData;
    } catch (err) {
      console.error(`Firestore setDocument (${collectionName}/${docId}) error:`, err);
    }
  }
  if (!mockStore[collectionName]) mockStore[collectionName] = {};
  if (docId) {
    if (typeof mockStore[collectionName] === 'object' && !Array.isArray(mockStore[collectionName])) {
      mockStore[collectionName][docId] = { ...mockStore[collectionName][docId], ...updatedData };
    }
  } else {
    mockStore[collectionName] = updatedData;
  }
  return updatedData;
}

export async function getCollection(collectionName) {
  if (isFirebaseConfigured && db) {
    try {
      const snapshot = await db.collection(collectionName).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error(`Firestore getCollection (${collectionName}) error:`, err);
    }
  }
  const data = mockStore[collectionName];
  if (Array.isArray(data)) return data;
  if (typeof data === 'object' && data !== null) {
    return Object.keys(data).map(key => ({ id: key, ...data[key] }));
  }
  return [];
}

export async function addDocument(collectionName, data) {
  const newId = `doc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const fullData = { id: newId, ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

  if (isFirebaseConfigured && db) {
    try {
      const ref = await db.collection(collectionName).add(fullData);
      return { id: ref.id, ...fullData };
    } catch (err) {
      console.error(`Firestore addDocument (${collectionName}) error:`, err);
    }
  }

  if (!mockStore[collectionName]) mockStore[collectionName] = [];
  if (Array.isArray(mockStore[collectionName])) {
    mockStore[collectionName].push(fullData);
  }
  return fullData;
}

export async function deleteDocument(collectionName, docId) {
  if (isFirebaseConfigured && db) {
    try {
      await db.collection(collectionName).doc(docId).delete();
      return true;
    } catch (err) {
      console.error(`Firestore deleteDocument (${collectionName}/${docId}) error:`, err);
    }
  }
  if (Array.isArray(mockStore[collectionName])) {
    mockStore[collectionName] = mockStore[collectionName].filter(item => item.id !== docId);
  } else if (mockStore[collectionName] && mockStore[collectionName][docId]) {
    delete mockStore[collectionName][docId];
  }
  return true;
}

export { mockStore };
