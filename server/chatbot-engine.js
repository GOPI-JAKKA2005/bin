import { getCollection } from './firestore-service.js';

/**
 * Intelligent Chatbot Engine with Firestore Knowledge Base Search and Biohazard Safety Guardrails
 */
export async function processChatQuery(userQuery) {
  const queryLower = (userQuery || '').toLowerCase().trim();

  if (!queryLower) {
    return {
      answer: "Hello! I am EcoBot, your AI Waste Management Assistant. Ask me anything about waste classification, composting, recycling, or hazardous waste safety!",
      category: 'General',
      safetyAlert: null,
      suggestedQuestions: [
        'How do I segregate wet and dry waste at home?',
        'Where should I dispose of used batteries?',
        'Can I compost cooked food leftovers?'
      ]
    };
  }

  // 1. SAFETY GUARDRAIL CHECK FOR HAZARDOUS & BIOMEDICAL PHRASES
  const dangerousPhrases = ['burn', 'burning', 'incinerate at home', 'flush down drain', 'dump in river', 'throw in trash', 'recycle syringe'];
  const containsDangerousAction = dangerousPhrases.some(p => queryLower.includes(p));

  const isMedicalQuery = ['syringe', 'needle', 'bandage', 'blood', 'medicine', 'drug', 'hospital', 'biomedical', 'sharps'].some(k => queryLower.includes(k));
  const isHazardousQuery = ['battery', 'acid', 'chemical', 'paint', 'pesticide', 'flammable', 'solvent', 'e-waste', 'mercury', 'fluorescent'].some(k => queryLower.includes(k));

  if (containsDangerousAction && (isMedicalQuery || isHazardousQuery)) {
    return {
      answer: "🚨 **SAFETY ALERT**: Burning, flushing, or dumping hazardous or biomedical waste is extremely illegal and poses severe toxicity and environmental health hazards! Medical sharps and chemicals must ONLY be handled by authorized biohazard disposal agencies.",
      category: 'Safety Warning',
      safetyAlert: {
        type: 'critical',
        title: 'UNSAFE DISPOSAL WARNING',
        message: 'Never attempt open burning, domestic flushing, or standard trash disposal of hazardous or medical items.'
      },
      suggestedQuestions: [
        'How do I dispose of medical needles safely?',
        'Where is the nearest battery e-waste dropoff?',
        'What goes into the Red / Hazardous Bin?'
      ]
    };
  }

  // 2. FETCH ADMIN-MANAGED CHATBOT KNOWLEDGE FROM FIRESTORE
  const knowledgeEntries = await getCollection('chatbotKnowledge');
  const activeEntries = (knowledgeEntries || []).filter(e => e.active !== false);

  // Score matches based on keyword presence and priority
  let bestMatch = null;
  let highestScore = -1;

  for (const entry of activeEntries) {
    let score = 0;
    const keywords = Array.isArray(entry.keywords) ? entry.keywords : (entry.keywords || '').split(',').map(k => k.trim());
    
    keywords.forEach(kw => {
      if (kw && queryLower.includes(kw.toLowerCase())) {
        score += 10;
      }
    });

    if (entry.question && queryLower.includes(entry.question.toLowerCase())) {
      score += 25;
    }

    // Weight by admin priority setting
    score += Number(entry.priority || 0);

    if (score > highestScore && score > 5) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch) {
    let safetyAlert = null;
    if (bestMatch.category === 'Biomedical Safety' || isMedicalQuery) {
      safetyAlert = {
        type: 'warning',
        title: 'Biomedical Handling Notice',
        message: 'Always use puncture-resistant yellow containers for biomedical sharps. Do not mix with household garbage.'
      };
    } else if (bestMatch.category === 'Hazardous' || isHazardousQuery) {
      safetyAlert = {
        type: 'warning',
        title: 'Hazardous Material Notice',
        message: 'Tape electrical contacts on batteries and deliver to an authorized e-waste collection center.'
      };
    }

    return {
      answer: bestMatch.answer,
      category: bestMatch.category || 'Knowledge Base',
      safetyAlert,
      suggestedQuestions: [
        'What materials are biodegradable?',
        'How does AI measure waste recovery potential?',
        'How do I contact the municipal waste helpline?'
      ]
    };
  }

  // 3. GENERAL FALLBACK AI ANSWER SYSTEM
  let fallbackAnswer = "To dispose of waste responsibly, segregate into Wet Organic (Green), Dry Recyclable (Blue), and Hazardous/Biomedical (Red/Yellow) bins. If unsure about an item, scan it using our AI Waste Analyzer!";
  
  if (isMedicalQuery) {
    fallbackAnswer = "Medical waste (syringes, gloves, expired drugs) is classified as Biomedical Waste. Store sharps in a puncture-proof container and take them to a designated hospital biohazard disposal site.";
  } else if (isHazardousQuery) {
    fallbackAnswer = "Chemicals, paints, fluorescent bulbs, and lithium batteries contain toxic elements. Keep them dry in a separate box and deliver them to your local municipal hazardous e-waste collection point.";
  } else if (queryLower.includes('compost')) {
    fallbackAnswer = "Composting converts organic wet waste (fruit peels, leaves, coffee grounds) into fertile soil. Maintain a balance of green nitrogen-rich material and brown carbon-rich matter like dry leaves or cardboard.";
  } else if (queryLower.includes('recycle') || queryLower.includes('recycling')) {
    fallbackAnswer = "Recyclable materials include PET plastic bottles, clean paper, cardboard, glass containers, and metal cans. Rinse liquid residues clean before placing them in your dry recycling bin.";
  }

  return {
    answer: fallbackAnswer,
    category: isMedicalQuery ? 'Biomedical' : (isHazardousQuery ? 'Hazardous' : 'General Guidance'),
    safetyAlert: (isMedicalQuery || isHazardousQuery) ? {
      type: 'warning',
      title: 'Disposal Safety Notice',
      message: 'Always follow authorized safety guidelines for medical and hazardous items.'
    } : null,
    suggestedQuestions: [
      'How does the AI Waste Analyzer work?',
      'What happens to mixed waste?',
      'How can I edit themes as an Admin?'
    ]
  };
}
