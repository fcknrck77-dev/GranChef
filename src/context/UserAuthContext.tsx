'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
});

const VIP_PRO_CODES = ['DABIZXOPRO01', 'DABIZXOPRO02', 'DABIZXO03'];
const VIP_PRE_CODES = ['ADRIAPRE001', 'ADRIAPRE02'];

export const UserAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAdminAuth();
  const adminUser = process.env.NEXT_PUBLIC_ADMIN_USER || '';
  const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS || '';
  const [authState, setAuthState] = useState<AuthState>({
    isRegistered: false,
    profile: null,
    level: 'FREE',
    registrationDate: new Date().toISOString(),
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

  const saveState = (newState: AuthState) => {
    setAuthState(newState);
    localStorage.setItem('grandchef_user_auth', JSON.stringify(newState));
  };

  const { login: adminLogin } = useAdminAuth();

  const login = async (email: string, pass: string): Promise<boolean> => {
    // Simulación de login. En producción iría a Supabase.
    // Especial para admin
    if (adminUser && adminPass && email === adminUser && pass === adminPass) {
       await adminLogin(email, pass);
       // Activamos sesión de administrador
       const adminState: AuthState = {
         isRegistered: true,
         profile: { 
           firstName: 'Chef', 
           lastName: 'Administrador', 
           province: 'España', 
           city: 'GrandChef Lab', 
           email: adminUser
         },
         level: 'ADMIN',
         registrationDate: new Date().toISOString()
       };
       saveState(adminState);
       return true;
    }

    // Buscamos si existe en el estado local (simulado)
    if (authState.profile?.email === email) {
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
  };

  const logout = () => {
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
      isAuthModalOpen, openAuthModal, closeAuthModal
    }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
