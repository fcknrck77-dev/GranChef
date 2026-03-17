'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AccessLevel } from '@/data/access';
import { useAdminAuth } from './AdminAuthContext';

export interface UserProfile {
  firstName: string;
  lastName: string;
  province: string;
  city: string;
  email: string;
  professionalSector?: string;
}

export interface AuthState {
  isRegistered: boolean;
  profile: UserProfile | null;
  level: AccessLevel;
  registrationDate: string; // ISO date string
  vipCode?: string;
  activationDate?: string; // ISO date string
}

interface UserAuthContextType {
  authState: AuthState;
  registerUser: (profile: UserProfile, specialCode?: string) => void;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  daysRemaining: number | null;
  accountAgeInDays: number;
  getEffectiveLevel: () => AccessLevel;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  requireAuth: (next?: () => void) => boolean;
}

const UserAuthContext = createContext<UserAuthContextType>({
  authState: { isRegistered: false, profile: null, level: 'FREE', registrationDate: new Date().toISOString() },
  registerUser: () => {},
  login: async () => false,
  logout: () => {},
  daysRemaining: null,
  accountAgeInDays: 0,
  getEffectiveLevel: () => 'FREE',
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  requireAuth: () => false,
});

const VIP_PRO_CODES = ['DABIZXOPRO01', 'DABIZXOPRO02', 'DABIZXO03'];
const VIP_PRE_CODES = ['ADRIAPRE001', 'ADRIAPRE02'];

export const UserAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, login: adminLogin, logout: adminLogout } = useAdminAuth();
  const [authState, setAuthState] = useState<AuthState>({
    isRegistered: false,
    profile: null,
    level: 'FREE',
    registrationDate: new Date().toISOString(),
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const postAuthActionRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    const stored = localStorage.getItem('grandchef_user_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (!parsed.registrationDate) {
          parsed.registrationDate = parsed.activationDate || new Date().toISOString();
        }
        setAuthState(parsed);
      } catch (e) {
        console.error('Failed to parse stored auth state', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const requireAuth = (next?: () => void) => {
    if (authState.isRegistered) {
      next?.();
      return true;
    }
    postAuthActionRef.current = next || null;
    openAuthModal();
    return false;
  };

  const runPostAuthAction = () => {
    const fn = postAuthActionRef.current;
    postAuthActionRef.current = null;
    if (!fn) return;
    // Let the modal close + state settle before triggering UI transitions.
    setTimeout(() => fn(), 0);
  };

  const saveState = (newState: AuthState) => {
    setAuthState(newState);
    localStorage.setItem('grandchef_user_auth', JSON.stringify(newState));
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    // Simulación de login. En producción iría a Supabase.

    // If the credentials match the server-side admin gate, establish the admin session cookie
    // and mark the local auth state as ADMIN for immediate UX.
    try {
      const ok = await adminLogin(email, pass);
      if (ok) {
        const adminState: AuthState = {
          isRegistered: true,
          profile: {
            firstName: 'Grand',
            lastName: 'Chef',
            province: 'España',
            city: 'GrandChef Lab',
            email,
          },
          level: 'ADMIN',
          registrationDate: new Date().toISOString(),
        };
        saveState(adminState);
        closeAuthModal();
        runPostAuthAction();
        return true;
      }
    } catch {
      // Ignore and keep local fallback.
    }
    // Buscamos si existe en el estado local (simulado)
    if (authState.profile?.email === email) {
      closeAuthModal();
      runPostAuthAction();
      return true;
    }
    
    return false;
  };

  const registerUser = (profile: UserProfile, specialCode?: string) => {
    let assignedLevel: AccessLevel = 'FREE';
    let isVip = false;

    if (specialCode) {
      const code = specialCode.trim().toUpperCase();
      if (VIP_PRO_CODES.includes(code)) {
        assignedLevel = 'PRO';
        isVip = true;
      } else if (VIP_PRE_CODES.includes(code)) {
        assignedLevel = 'PREMIUM';
        isVip = true;
      }
    }

    const now = new Date().toISOString();
    const newState: AuthState = {
      isRegistered: true,
      profile,
      level: assignedLevel,
      registrationDate: now,
      ...(isVip && {
        vipCode: specialCode!.trim().toUpperCase(),
        activationDate: now,
      }),
    };

    saveState(newState);
    closeAuthModal();
    runPostAuthAction();
  };

  const logout = () => {
    // Clear admin session too, if present.
    adminLogout();
    const newState: AuthState = { 
      isRegistered: false, 
      profile: null, 
      level: 'FREE',
      registrationDate: new Date().toISOString() 
    };
    saveState(newState);
  };

  const calculateAccountAge = () => {
    const start = new Date(authState.registrationDate);
    const now = new Date();
    const diffTime = now.getTime() - start.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const accountAgeInDays = calculateAccountAge();

  let daysRemaining = null;
  if (authState.vipCode && authState.activationDate) {
    const start = new Date(authState.activationDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    daysRemaining = Math.max(0, 30 - diffDays);
  }

  const getDynamicLevel = (): AccessLevel => {
    if (daysRemaining !== null && daysRemaining <= 0) {
      return 'FREE';
    }
    return authState.level;
  };

  const getEffectiveLevel = (): AccessLevel => {
    if (isAdmin) return 'ADMIN';
    return getDynamicLevel();
  };

  if (!isLoaded) return null;

  return (
    <UserAuthContext.Provider value={{ 
      authState, registerUser, login, logout, daysRemaining, accountAgeInDays, getEffectiveLevel,
      isAuthModalOpen, openAuthModal, closeAuthModal, requireAuth
    }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
