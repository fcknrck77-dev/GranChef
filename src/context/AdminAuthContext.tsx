'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IS_STATIC_EXPORT } from '@/lib/deployTarget';

interface AdminAuthContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (IS_STATIC_EXPORT) {
          setIsAdmin(localStorage.getItem('gc_is_admin') === '1');
          return;
        }
        const res = await fetch('/api/admin/session/me', { cache: 'no-store' });
        const data = await res.json().catch(() => ({}));
        setIsAdmin(Boolean((data as any)?.isAdmin));
      } catch {
        setIsAdmin(false);
      }
    })();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      if (IS_STATIC_EXPORT) {
        const expectedUser = process.env.NEXT_PUBLIC_ADMIN_USER || '';
        const expectedPass = process.env.NEXT_PUBLIC_ADMIN_PASS || '';
        const allow = Boolean(expectedUser && expectedPass) && username === expectedUser && password === expectedPass;
        if (!allow) return false;
        localStorage.setItem('gc_is_admin', '1');
        setIsAdmin(true);
        return true;
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch('/api/admin/session/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) return false;
      setIsAdmin(true);
      return true;
    } catch (err: any) {
      console.warn('[AdminAuth] Login failed or timed out:', err.message);
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    if (IS_STATIC_EXPORT) {
      localStorage.removeItem('gc_is_admin');
      return;
    }
    fetch('/api/admin/session/logout', { method: 'POST' }).catch(() => {});
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
