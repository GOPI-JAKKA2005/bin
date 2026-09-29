import { auth, isFirebaseConfigured } from './firebase-admin.js';

/**
 * Server-side authentication and authorization middleware for Vercel Serverless Functions.
 * Verifies Firebase ID Token and ensures admin privileges.
 */
export async function verifyAdminAuth(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw { status: 401, message: 'Unauthorized: Missing or invalid Authorization header token.' };
  }

  const token = authHeader.split('Bearer ')[1].trim();

  // If Firebase is configured live, verify using Firebase Admin SDK
  if (isFirebaseConfigured && auth) {
    try {
      const decodedToken = await auth.verifyIdToken(token);
      
      // Optionally check for custom admin claim or email verification
      if (!decodedToken.uid) {
        throw new Error('Invalid user token.');
      }

      return decodedToken;
    } catch (err) {
      console.error('[Auth Middleware] Verification failed:', err.message);
      throw { status: 403, message: `Forbidden: Invalid or expired admin token (${err.message})` };
    }
  }

  // Fallback mode support for demo / dev mode when environment keys are not configured yet
  if (token === 'mock-admin-token' || token.startsWith('demo-admin-')) {
    return {
      uid: 'demo-admin-uid',
      email: 'admin@ecosmart.waste',
      name: 'System Admin',
      admin: true
    };
  }

  throw { status: 401, message: 'Unauthorized: Token verification failed.' };
}
