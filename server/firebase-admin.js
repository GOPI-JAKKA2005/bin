import admin from 'firebase-admin';

let isFirebaseConfigured = false;
let db = null;
let auth = null;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    // Standardize newline formatting in private key
    privateKey = privateKey.replace(/\\n/g, '\n');

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
    db = admin.firestore();
    auth = admin.auth();
    isFirebaseConfigured = true;
    console.log('[Firebase Admin] Connected successfully.');
  } else {
    console.warn('[Firebase Admin] Credentials missing. Running in Fallback Data Mode.');
  }
} catch (err) {
  console.error('[Firebase Admin Initialization Error]:', err.message);
}

export { admin, db, auth, isFirebaseConfigured };
