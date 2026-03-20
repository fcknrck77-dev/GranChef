import { getSupabase } from './supabaseClient';
import { getSupabaseAdmin } from './supabaseAdmin';

export const supabaseService = {
  // Public (Anon) Clients
  core: () => getSupabase('CORE'),
  courses: () => getSupabase('COURSES'),
  aiBrain: () => getSupabase('AI_BRAIN'),
  marketing: () => getSupabase('MARKETING'),
  logs: () => getSupabase('LOGS'),

  // Admin Clients (Server-side only)
  admin: {
    core: () => getSupabaseAdmin('CORE'),
    courses: () => getSupabaseAdmin('COURSES'),
    aiBrain: () => getSupabaseAdmin('AI_BRAIN'),
    marketing: () => getSupabaseAdmin('MARKETING'),
    logs: () => getSupabaseAdmin('LOGS'),
  }
};

/**
 * Helper to get the correct client based on domain name
 */
export function getClientForDomain(domain: 'CORE' | 'COURSES' | 'AI_BRAIN' | 'MARKETING' | 'LOGS', isAdmin = false) {
  if (isAdmin) {
    switch (domain) {
      case 'CORE': return supabaseService.admin.core();
      case 'COURSES': return supabaseService.admin.courses();
      case 'AI_BRAIN': return supabaseService.admin.aiBrain();
      case 'MARKETING': return supabaseService.admin.marketing();
      case 'LOGS': return supabaseService.admin.logs();
    }
  } else {
    switch (domain) {
      case 'CORE': return supabaseService.core();
      case 'COURSES': return supabaseService.courses();
      case 'AI_BRAIN': return supabaseService.aiBrain();
      case 'MARKETING': return supabaseService.marketing();
      case 'LOGS': return supabaseService.logs();
    }
  }
}
