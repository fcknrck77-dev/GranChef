'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const adminUser = process.env.NEXT_PUBLIC_ADMIN_USER || '';
  const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || '';

  useEffect(() => {
    const savedSession = localStorage.getItem('gc_admin_session');
    if (savedSession === 'active') {
      setIsAdmin(true);
    }
  }, []);

  const login = (username: string, password: string) => {
    // Credenciales personalizadas del Propietario
    if (adminUser && adminPass && username === adminUser && password === adminPass) {
      setIsAdmin(true);
      localStorage.setItem('gc_admin_session', 'active');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('gc_admin_session');
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
