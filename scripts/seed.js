import dotenv from 'dotenv';
dotenv.config();

import { mockStore } from '../server/firestore-service.js';
import { isFirebaseConfigured, db } from '../server/firebase-admin.js';

async function runSeed() {
  console.log('--- EcoSmart AI Waste Management System Seeding ---');

  if (isFirebaseConfigured && db) {
    console.log('Uploading default data to live Cloud Firestore...');

    // Seed Settings
    await db.collection('settings').doc('config').set(mockStore.settings, { merge: true });
    
    // Seed Theme
    await db.collection('theme').doc('settings').set(mockStore.theme, { merge: true });

    // Seed Categories
    for (const cat of mockStore.categories) {
      await db.collection('categories').doc(cat.id).set(cat, { merge: true });
    }

    // Seed Items
    for (const item of mockStore.items) {
      await db.collection('items').doc(item.id).set(item, { merge: true });
    }

    // Seed Chatbot Knowledge
    for (const kb of mockStore.chatbotKnowledge) {
      await db.collection('chatbotKnowledge').doc(kb.id).set(kb, { merge: true });
    }

    // Seed Pages
    for (const pg of mockStore.pages) {
      await db.collection('pages').doc(pg.id).set(pg, { merge: true });
    }

    console.log('✅ Cloud Firestore seeding complete!');
  } else {
    console.log('Running in Standalone Fallback Store Mode.');
    console.log('✅ All default seed data is loaded in memory and ready for local development.');
  }

  process.exit(0);
}

runSeed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
