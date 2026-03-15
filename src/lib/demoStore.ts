'use client';

type DemoAiRequest = {
  id: string;
  instruction: string;
  days_to_generate: number;
  status: 'pending' | 'processing' | 'completed';
  created_at: string; // ISO
};

const REQUESTS_KEY = 'grandchef_demo_ai_requests_v1';

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function loadRequests(): DemoAiRequest[] {
  if (typeof window === 'undefined') return [];
  const parsed = safeJsonParse<DemoAiRequest[]>(localStorage.getItem(REQUESTS_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

function saveRequests(requests: DemoAiRequest[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

export function demoFetchAiRequests(limit = 5): DemoAiRequest[] {
  const all = loadRequests();
  const sorted = [...all].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  return sorted.slice(0, limit);
}

export function demoInsertAiRequest(instruction: string, days_to_generate: number): { error: null | string } {
  const now = new Date().toISOString();
  const next: DemoAiRequest = {
    id: `demo_${Math.random().toString(16).slice(2)}_${Date.now()}`,
    instruction,
    days_to_generate,
    status: 'pending',
    created_at: now,
  };

  const current = loadRequests();
  saveRequests([next, ...current]);
  return { error: null };
}

