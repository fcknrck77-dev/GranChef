'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AccessLevel, TRIAL_DAYS } from '@/data/access';
import { useAdminAuth } from './AdminAuthContext';
import { getSupabase } from '@/lib/supabaseClient';

async function getClientIp(): Promise<string> {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip || 'unknown';
  } catch {
    return 'unknown';
  }
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  province: string;
  city: string;
  email: string;
  professionalSector?: string;
  cvUrl?: string;
  isPublic?: boolean;
}

export interface CompanyProfile {
  businessName: string;
  vatNumber: string;
  sector: string;
  address: string;
  city: string;
  logoUrl?: string;
}

export interface AuthState {
  isRegistered: boolean;
  accountType: 'individual' | 'company';
  profile: UserProfile | null;
  companyProfile: CompanyProfile | null;
  level: AccessLevel;
  registrationDate: string; 
  vipCode?: string;
  activationDate?: string; 
  trialStartAt?: string;   
  registrationIp?: string;  
  id?: string | null;
  isLoading: boolean;
}

interface UserAuthContextType {
  authState: AuthState;
  refreshAuth: () => Promise<void>;
  registerUser: (profile: UserProfile, specialCode?: string) => Promise<void>;
  registerCompany: (profile: CompanyProfile, email: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getEffectiveLevel: () => AccessLevel;
  isAuthModalOpen: boolean;
  isBlocked: boolean; 
  openAuthModal: () => void;
  closeAuthModal: () => void;
  requireAuth: (next?: () => void) => boolean;
  accountAgeInDays: number;
  daysRemaining: number | null;
}

const UserAuthContext = createContext<UserAuthContextType | null>(null);

const VIP_PRO_CODES = ['DABIZXOPRO01', 'DABIZXOPRO02', 'DABIZXO03'];
const VIP_PRE_CODES = ['ADRIAPRE001', 'ADRIAPRE02'];

export const UserAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, login: adminLogin, logout: adminLogout } = useAdminAuth();
  const [authState, setAuthState] = useState<AuthState>({
    isRegistered: false,
    accountType: 'individual',
    profile: null,
    companyProfile: null,
    level: 'FREE',
    registrationDate: new Date().toISOString(),
    isLoading: true
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const postAuthActionRef = useRef<null | (() => void)>(null);

  const syncUserFromDb = async () => {
    const supabase = getSupabase('CORE');
    if (!supabase) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
        setAuthState(prev => ({ ...prev, isRegistered: false, isLoading: false }));
        return;
    }

    const { data: userRow } = await supabase
      .from('app_users')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (userRow) {
      const net = getSupabase('NETWORKING');
      let accountType: 'individual' | 'company' = (userRow.account_type === 'company') ? 'company' : 'individual';
      let companyProfile: CompanyProfile | null = null;

      if (net && accountType === 'company') {
          const { data: cp } = await net.from('company_profiles').select('*').eq('id', session.user.id).maybeSingle();
          if (cp) {
            companyProfile = {
              businessName: cp.business_name,
              vatNumber: cp.vat_number,
              sector: cp.sector,
              address: cp.address,
              city: cp.city,
              logoUrl: cp.logo_url
            };
          }
      }

      setAuthState({
        isRegistered: true,
        accountType,
        profile: {
          firstName: userRow.name?.split(' ')[0] || '',
          lastName: userRow.name?.split(' ').slice(1).join(' ') || '',
          province: userRow.province || '',
          city: userRow.city || '',
          email: session.user.email || '',
          professionalSector: userRow.professional_sector,
        },
        companyProfile,
        level: (userRow.plan || 'FREE') as AccessLevel,
        registrationDate: userRow.created_at || new Date().toISOString(),
        vipCode: userRow.vip_code,
        activationDate: userRow.activated_at,
        trialStartAt: userRow.trial_start_at,
        registrationIp: userRow.registration_ip,
        id: session.user.id,
        isLoading: false
      });
    } else {
        setAuthState(prev => ({ ...prev, isRegistered: false, isLoading: false }));
    }
  };

  useEffect(() => {
    syncUserFromDb();
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
    setTimeout(() => fn(), 0);
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    const supabase = getSupabase('CORE');
    if (!supabase) return false;

    // Try Admin Login first
    const isAdmOk = await adminLogin(email, pass);
    if (isAdmOk) {
      closeAuthModal();
      runPostAuthAction();
      return true;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error || !data.user) return false;

    await syncUserFromDb();
    closeAuthModal();
    runPostAuthAction();
    return true;
  };

  const registerUser = async (profile: UserProfile, specialCode?: string) => {
    const supabase = getSupabase('CORE');
    if (!supabase) return;

    let assignedLevel: AccessLevel = 'FREE';
    if (specialCode) {
      const code = specialCode.trim().toUpperCase();
      if (VIP_PRO_CODES.includes(code)) assignedLevel = 'PRO';
      else if (VIP_PRE_CODES.includes(code)) assignedLevel = 'PREMIUM';
    }

    const { data, error } = await supabase.auth.signUp({
      email: profile.email,
      password: 'TemporaryPass123!', 
      options: { data: { first_name: profile.firstName, last_name: profile.lastName, level: assignedLevel } }
    });

    if (error || !data.user) {
      alert(`Error: ${error?.message}`);
      return;
    }

    const now = new Date().toISOString();
    const ip = await getClientIp();

    await supabase.from('app_users').upsert({
      id: data.user.id,
      email: profile.email,
      name: `${profile.firstName} ${profile.lastName}`,
      province: profile.province,
      city: profile.city,
      professional_sector: profile.professionalSector,
      status: 'active',
      plan: assignedLevel,
      account_type: 'individual',
      vip_code: specialCode?.trim().toUpperCase() || null,
      activated_at: (assignedLevel !== 'FREE') ? now : null,
      created_at: now,
      trial_start_at: now,
      registration_ip: ip
    });

    await syncUserFromDb();
    closeAuthModal();
    runPostAuthAction();
  };

  const registerCompany = async (profile: CompanyProfile, email: string) => {
    const supabase = getSupabase('CORE');
    const net = getSupabase('NETWORKING');
    if (!supabase || !net) return;

    const { data, error } = await supabase.auth.signUp({
      email,
      password: 'CompanyPass123!',
      options: { data: { business_name: profile.businessName, account_type: 'company' } }
    });

    if (error || !data.user) {
      alert(`Error: ${error?.message}`);
      return;
    }

    const now = new Date().toISOString();
    const ip = await getClientIp();

    await supabase.from('app_users').upsert({
      id: data.user.id,
      email,
      name: profile.businessName,
      city: profile.city,
      status: 'active',
      plan: 'ENTERPRISE',
      account_type: 'company',
      created_at: now,
      trial_start_at: now,
      registration_ip: ip
    });

    await net.from('company_profiles').upsert({
      id: data.user.id,
      business_name: profile.businessName,
      vat_number: profile.vatNumber,
      sector: profile.sector,
      address: profile.address,
      city: profile.city,
      created_at: now
    });

    await syncUserFromDb();
    closeAuthModal();
    runPostAuthAction();
  };

  const logout = async () => {
    const supabase = getSupabase('CORE');
    adminLogout();
    if (supabase) await supabase.auth.signOut();
    
    setAuthState({
      isRegistered: false,
      accountType: 'individual',
      profile: null,
      companyProfile: null,
      level: 'FREE',
      registrationDate: new Date().toISOString(),
      isLoading: false
    });
    window.location.href = '/';
  };

  const calculateTrialDaysUsed = () => {
    if (!authState.trialStartAt) return 0;
    const diff = Date.now() - new Date(authState.trialStartAt).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const isBlocked = authState.level === 'FREE' && calculateTrialDaysUsed() >= TRIAL_DAYS;

  const getEffectiveLevel = (): AccessLevel => {
    if (isAdmin) return 'ADMIN';
    if (isBlocked) return 'FREE'; 
    return authState.level;
  };

  return (
    <UserAuthContext.Provider value={{ 
      authState, 
      refreshAuth: syncUserFromDb, 
      getEffectiveLevel,
      registerUser,
      registerCompany,
      login,
      logout,
      isAuthModalOpen,
      isBlocked,
      openAuthModal,
      closeAuthModal,
      requireAuth,
      accountAgeInDays: calculateTrialDaysUsed(),
      daysRemaining: authState.trialStartAt ? Math.max(0, TRIAL_DAYS - calculateTrialDaysUsed()) : null
    }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) throw new Error('useUserAuth must be used within UserAuthProvider');
  return context;
};
