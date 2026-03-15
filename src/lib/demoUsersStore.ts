'use client';

export type DemoPlan = 'FREE' | 'PRO' | 'PREMIUM';
export type DemoUserStatus = 'active' | 'blocked' | 'suspended';

export type DemoReward = {
  id: string;
  type: 'manual' | 'giveaway' | 'plan_override' | 'plan_change' | 'payment';
  label: string;
  created_at: string; // ISO
  meta?: Record<string, any>;
};

export type DemoPlanOverride = {
  plan: DemoPlan;
  until: string; // ISO
  reason: string;
};

export type DemoBilling = {
  lastPaidAt: string | null; // ISO
  nextDueAt: string | null; // ISO
};

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  plan: DemoPlan;
  status: DemoUserStatus;
  billing: DemoBilling;
  planOverride: DemoPlanOverride | null;
  createdAt: string; // ISO
  notes: string;
  rewards: DemoReward[];
};

export type GiveawayEligibility = 'all' | 'active' | 'active_paid' | 'pro_plus';

export type GiveawayRecord = {
  id: string;
  created_at: string; // ISO
  eligibility: GiveawayEligibility;
  prizeLabel: string;
  winners: { userId: string; name: string; email: string }[];
};

const USERS_KEY = 'grandchef_demo_users_v1';
const GIVEAWAYS_KEY = 'grandchef_demo_giveaways_v1';

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function loadUsersRaw(): DemoUser[] {
  if (typeof window === 'undefined') return [];
  const parsed = safeJsonParse<DemoUser[]>(localStorage.getItem(USERS_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

function saveUsersRaw(users: DemoUser[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadGiveawaysRaw(): GiveawayRecord[] {
  if (typeof window === 'undefined') return [];
  const parsed = safeJsonParse<GiveawayRecord[]>(localStorage.getItem(GIVEAWAYS_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

function saveGiveawaysRaw(giveaways: GiveawayRecord[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GIVEAWAYS_KEY, JSON.stringify(giveaways));
}

function seedUsers(): DemoUser[] {
  const createdAt = nowIso();
  const mk = (id: string, name: string, email: string, plan: DemoPlan, status: DemoUserStatus, lastPaidDaysAgo: number | null) => {
    const lastPaidAt = lastPaidDaysAgo === null ? null : addDays(createdAt, -lastPaidDaysAgo);
    const nextDueAt = lastPaidAt ? addDays(lastPaidAt, 30) : null;
    const rewards: DemoReward[] = [];
    if (lastPaidAt) {
      rewards.push({ id: makeId('rw'), type: 'payment', label: `Pago registrado (${new Date(lastPaidAt).toLocaleDateString()})`, created_at: lastPaidAt });
    }
    return {
      id,
      name,
      email,
      plan,
      status,
      billing: { lastPaidAt, nextDueAt },
      planOverride: null,
      createdAt,
      notes: '',
      rewards,
    } satisfies DemoUser;
  };

  return [
    mk('u1', 'Carlos Martín', 'carlos@chef.com', 'PRO', 'active', 10),
    mk('u2', 'Ana García', 'ana@cocina.es', 'PREMIUM', 'active', 5),
    mk('u3', 'Luis Rodríguez', 'luis@gastro.com', 'PRO', 'suspended', 75),
    mk('u4', 'Marta López', 'marta@chef.io', 'PREMIUM', 'blocked', 95),
    mk('u5', 'Pedro Sánchez', 'pedro@rest.com', 'FREE', 'active', null),
    mk('u6', 'Sofía Ruiz', 'sofia@lab.es', 'PRO', 'active', 35),
    mk('u7', 'Diego Navarro', 'diego@food.com', 'FREE', 'active', 65),
    mk('u8', 'Lucía Herrera', 'lucia@menu.es', 'PRO', 'active', 1),
  ];
}

export function demoEnsureUsersSeeded() {
  if (typeof window === 'undefined') return;
  const existing = loadUsersRaw();
  if (existing.length > 0) return;
  saveUsersRaw(seedUsers());
  saveGiveawaysRaw([]);
}

export function demoEffectivePlan(user: DemoUser): DemoPlan {
  const ov = user.planOverride;
  if (!ov) return user.plan;
  if (new Date(ov.until).getTime() <= Date.now()) return user.plan;
  return ov.plan;
}

export function demoOverdueDays(user: DemoUser): number | null {
  const due = user.billing.nextDueAt;
  if (!due) return null;
  const ms = Date.now() - new Date(due).getTime();
  if (ms <= 0) return 0;
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function demoListUsers(query = ''): DemoUser[] {
  demoEnsureUsersSeeded();
  const q = query.trim().toLowerCase();
  const all = loadUsersRaw();
  const filtered = !q
    ? all
    : all.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
}

export function demoGetUser(id: string): DemoUser | null {
  demoEnsureUsersSeeded();
  const all = loadUsersRaw();
  return all.find(u => u.id === id) || null;
}

export function demoUpdateUser(id: string, patch: Partial<DemoUser>): DemoUser | null {
  demoEnsureUsersSeeded();
  const all = loadUsersRaw();
  const idx = all.findIndex(u => u.id === id);
  if (idx === -1) return null;
  const updated: DemoUser = { ...all[idx], ...patch };
  all[idx] = updated;
  saveUsersRaw(all);
  return updated;
}

export function demoAddReward(userId: string, reward: Omit<DemoReward, 'id' | 'created_at'> & { created_at?: string }) {
  demoEnsureUsersSeeded();
  const all = loadUsersRaw();
  const idx = all.findIndex(u => u.id === userId);
  if (idx === -1) return;
  const created_at = reward.created_at || nowIso();
  const nextReward: DemoReward = { id: makeId('rw'), created_at, type: reward.type, label: reward.label, meta: reward.meta };
  all[idx] = { ...all[idx], rewards: [nextReward, ...all[idx].rewards] };
  saveUsersRaw(all);
}

export function demoSetPlan(userId: string, plan: DemoPlan, reason = 'Cambio manual') {
  const user = demoGetUser(userId);
  if (!user) return;
  demoUpdateUser(userId, { plan });
  demoAddReward(userId, { type: 'plan_change', label: `${reason}: plan base -> ${plan}`, meta: { plan } });
}

export function demoSetStatus(userId: string, status: DemoUserStatus, reason = 'Cambio manual') {
  const user = demoGetUser(userId);
  if (!user) return;
  demoUpdateUser(userId, { status });
  demoAddReward(userId, { type: 'manual', label: `${reason}: estado -> ${status}`, meta: { status } });
}

export function demoMarkPaid(userId: string, paidAtIso = nowIso(), cycleDays = 30) {
  const nextDue = addDays(paidAtIso, cycleDays);
  const user = demoGetUser(userId);
  if (!user) return;
  demoUpdateUser(userId, { billing: { lastPaidAt: paidAtIso, nextDueAt: nextDue }, status: 'active' });
  demoAddReward(userId, { type: 'payment', label: `Pago registrado. Próximo vencimiento: ${new Date(nextDue).toLocaleDateString()}`, meta: { paidAtIso, nextDue } });
}

export function demoClearPlanOverride(userId: string, reason = 'Fin de premio') {
  const user = demoGetUser(userId);
  if (!user) return;
  demoUpdateUser(userId, { planOverride: null });
  demoAddReward(userId, { type: 'plan_override', label: `${reason}: override eliminado`, meta: {} });
}

export function demoSetPlanOverride(userId: string, plan: DemoPlan, days: number, reason = 'Premio') {
  const until = addDays(nowIso(), days);
  const user = demoGetUser(userId);
  if (!user) return;
  demoUpdateUser(userId, { planOverride: { plan, until, reason } });
  demoAddReward(userId, { type: 'plan_override', label: `${reason}: ${plan} por ${days} días`, meta: { plan, until, days } });
}

export function demoBlockOverdueUsers(minOverdueDays = 1) {
  demoEnsureUsersSeeded();
  const all = loadUsersRaw();
  const updated = all.map(u => {
    const overdue = demoOverdueDays(u);
    if (u.status === 'active' && overdue !== null && overdue >= minOverdueDays) {
      return { ...u, status: 'blocked' } as DemoUser;
    }
    return u;
  });
  saveUsersRaw(updated);
}

export function demoListGiveaways(): GiveawayRecord[] {
  demoEnsureUsersSeeded();
  const all = loadGiveawaysRaw();
  return [...all].sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export function demoRunGiveaway(args: {
  eligibility: GiveawayEligibility;
  winnerCount: number;
  prizeLabel: string;
  rewardPlanOverride?: { plan: DemoPlan; days: number };
}): GiveawayRecord {
  demoEnsureUsersSeeded();
  const allUsers = loadUsersRaw();
  const eligible = allUsers.filter(u => {
    if (args.eligibility === 'all') return true;
    if (args.eligibility === 'active') return u.status === 'active';
    if (args.eligibility === 'active_paid') return u.status === 'active' && (demoOverdueDays(u) === 0);
    if (args.eligibility === 'pro_plus') return u.status === 'active' && (demoEffectivePlan(u) === 'PRO' || demoEffectivePlan(u) === 'PREMIUM');
    return true;
  });

  const pool = [...eligible];
  const winners: DemoUser[] = [];
  const count = Math.max(1, Math.min(args.winnerCount, pool.length));
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    winners.push(pool[idx]);
    pool.splice(idx, 1);
  }

  for (const w of winners) {
    demoAddReward(w.id, { type: 'giveaway', label: `Ganador sorteo: ${args.prizeLabel}`, meta: { prizeLabel: args.prizeLabel } });
    if (args.rewardPlanOverride) {
      demoSetPlanOverride(w.id, args.rewardPlanOverride.plan, args.rewardPlanOverride.days, `Sorteo: ${args.prizeLabel}`);
    }
  }

  const record: GiveawayRecord = {
    id: makeId('gv'),
    created_at: nowIso(),
    eligibility: args.eligibility,
    prizeLabel: args.prizeLabel,
    winners: winners.map(w => ({ userId: w.id, name: w.name, email: w.email })),
  };

  const allGiveaways = loadGiveawaysRaw();
  saveGiveawaysRaw([record, ...allGiveaways]);
  return record;
}

