import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db,
  isLiveFirebase, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  firebaseSignOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  doc,
  getDoc,
  setDoc
} from '../services/firebaseClient';
import { evaluateBadges } from '../services/scanService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user profile from Firestore or local storage
  const syncUserProfile = async (firebaseUser) => {
    if (!firebaseUser) {
      setCurrentUser(null);
      setToken(null);
      return;
    }

    try {
      const userToken = await firebaseUser.getIdToken();
      setToken(userToken);

      let profileData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        role: firebaseUser.email.toLowerCase().includes('admin') ? 'admin' : 'user',
        ecoPoints: 50,
        totalScans: 0,
        badges: evaluateBadges(0, 50)
      };

      if (isLiveFirebase && db) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          profileData = { ...profileData, ...snap.data() };
        } else {
          // Create initial user doc
          await setDoc(userRef, {
            ...profileData,
            createdAt: new Date().toISOString()
          });
        }
      }

      setCurrentUser(profileData);
    } catch (err) {
      console.warn('Profile sync warning:', err.message);
      setCurrentUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || 'Eco Warrior',
        role: 'user',
        ecoPoints: 50,
        badges: evaluateBadges(0, 50)
      });
    }
  };

  useEffect(() => {
    if (isLiveFirebase && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          await syncUserProfile(user);
        } else {
          // Check local stored session
          const stored = localStorage.getItem('ecosmart_user_session');
          if (stored) {
            try {
              setCurrentUser(JSON.parse(stored));
            } catch {}
          } else {
            setCurrentUser(null);
          }
          setToken(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Local fallback mode
      const stored = localStorage.getItem('ecosmart_user_session');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          setCurrentUser(user);
          setToken('mock-session-token');
        } catch {}
      }
      setLoading(false);
    }
  }, []);

  const signup = async (email, password, displayName) => {
    if (isLiveFirebase && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
      await syncUserProfile(cred.user);
      return cred.user;
    } else {
      const demoUser = {
        uid: `user_${Date.now()}`,
        email,
        displayName: displayName || email.split('@')[0],
        role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
        ecoPoints: 50,
        totalScans: 0,
        badges: evaluateBadges(0, 50)
      };
      localStorage.setItem('ecosmart_user_session', JSON.stringify(demoUser));
      setCurrentUser(demoUser);
      setToken('mock-session-token');
      return demoUser;
    }
  };

  const login = async (email, password) => {
    if (isLiveFirebase && auth) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await syncUserProfile(cred.user);
      return cred.user;
    } else {
      const demoUser = {
        uid: 'user_demo_101',
        email,
        displayName: email.split('@')[0] || 'Eco User',
        role: email.toLowerCase().includes('admin') ? 'admin' : 'user',
        ecoPoints: 75,
        totalScans: 3,
        badges: evaluateBadges(3, 75)
      };
      localStorage.setItem('ecosmart_user_session', JSON.stringify(demoUser));
      setCurrentUser(demoUser);
      setToken('mock-session-token');
      return demoUser;
    }
  };

  const resetPassword = async (email) => {
    if (isLiveFirebase && auth) {
      return await sendPasswordResetEmail(auth, email);
    }
    return true;
  };

  const logout = async () => {
    if (isLiveFirebase && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn('Logout error:', e);
      }
    }
    localStorage.removeItem('ecosmart_user_session');
    localStorage.removeItem('eco_admin_token');
    setCurrentUser(null);
    setToken(null);
  };

  const isAdmin = currentUser?.role === 'admin' || currentUser?.email?.toLowerCase().includes('admin');

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      adminUser: isAdmin ? currentUser : null,
      isAdmin, 
      token, 
      signup,
      login, 
      logout, 
      resetPassword,
      loading, 
      isAuthenticated: Boolean(currentUser) 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
