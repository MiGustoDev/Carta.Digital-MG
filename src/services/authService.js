// src/services/authService.js
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';

export const loginWithEmail = async (email, password) => {
  if (!isFirebaseConfigured) {
    return { user: null, error: 'Firebase no está configurado.' };
  }
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    const message = getAuthErrorMessage(error.code);
    return { user: null, error: message };
  }
};

export const logout = async () => {
  if (!isFirebaseConfigured) {
    return { error: null };
  }
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: 'Error al cerrar sesión. Intente de nuevo.' };
  }
};

export const subscribeToAuthChanges = (callback) => {
  if (!isFirebaseConfigured) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

export const getCurrentUser = () => {
  if (!isFirebaseConfigured) return null;
  return auth.currentUser;
};

const getAuthErrorMessage = (code) => {
  const errorMessages = {
    'auth/invalid-email': 'El email ingresado no es válido.',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
    'auth/user-not-found': 'No existe una cuenta con este email.',
    'auth/wrong-password': 'La contraseña es incorrecta.',
    'auth/invalid-credential': 'Email o contraseña incorrectos.',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Intente más tarde.',
    'auth/network-request-failed': 'Error de red. Verifique su conexión.',
    'auth/operation-not-allowed': 'Operación no permitida.',
  };
  return errorMessages[code] || 'Error de autenticación. Intente de nuevo.';
};
