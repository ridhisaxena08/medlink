import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onSessionExpired, tokenStore } from '../lib/apiClient';
import { auth as authApi, users } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStore.user);
  const [booting, setBooting] = useState(Boolean(tokenStore.access));

  /** A stored token may be revoked or expired - confirm it before trusting it. */
  useEffect(() => {
    if (!tokenStore.access) {
      setBooting(false);
      return;
    }
    let cancelled = false;
    users
      .me()
      .then((fresh) => {
        if (cancelled) return;
        tokenStore.save({ user: fresh });
        setUser(fresh);
      })
      .catch(() => {
        if (!cancelled) {
          tokenStore.clear();
          setUser(null);
        }
      })
      .finally(() => !cancelled && setBooting(false));
    return () => {
      cancelled = true;
    };
  }, []);

  /** The client signals here when a refresh attempt fails mid-session. */
  useEffect(() => onSessionExpired(() => setUser(null)), []);

  const login = useCallback(async (credentials) => {
    const result = await authApi.login(credentials);
    tokenStore.save(result);
    setUser(result.user);
    return result.user;
  }, []);

  const register = useCallback(async (body) => {
    const result = await authApi.register(body);
    tokenStore.save(result);
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout(tokenStore.refresh);
    } catch {
      /* the local session is dropped either way */
    }
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, booting, isAuthenticated: Boolean(user), login, register, logout, setUser }),
    [user, booting, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
