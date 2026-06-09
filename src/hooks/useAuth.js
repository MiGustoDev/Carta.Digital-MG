// src/hooks/useAuth.js
import { useState, useCallback } from 'react';

const AUTH_KEY = 'admin_auth_code';
const AUTH_VALUE = '1419';

const getLoggedInUser = () => {
  const code = localStorage.getItem(AUTH_KEY);
  if (code === AUTH_VALUE) {
    return {
      uid: 'admin-bypass',
      email: 'admin@migusto.com',
      displayName: 'Administrador',
    };
  }
  return null;
};

export const useAuth = () => {
  const [user, setUser] = useState(getLoggedInUser);
  const [loading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (code) => {
    if (String(code).trim() === AUTH_VALUE) {
      localStorage.setItem(AUTH_KEY, AUTH_VALUE);
      setUser({
        uid: 'admin-bypass',
        email: 'admin@migusto.com',
        displayName: 'Administrador',
      });
      setError(null);
      return true;
    }
    setError('Clave incorrecta. Intente nuevamente.');
    return false;
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  return { user, loading, error, login, logout, clearError: () => setError(null) };
};
