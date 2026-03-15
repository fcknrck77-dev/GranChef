'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  demoAddReward,
  demoClearPlanOverride,
  demoEffectivePlan,
  demoGetUser,
  demoMarkPaid,
  demoOverdueDays,
  demoSetPlan,
  demoSetPlanOverride,
  demoSetStatus,
  type DemoPlan,
} from '@/lib/demoUsersStore';

export default function AdminUserProfilePage() {
  const params = useParams();
  const id = String((params as any).id || '');
  const [refresh, setRefresh] = useState(0);
  const [backend, setBackend] = useState<'demo' | 'supabase'>('demo');
  const [serverUser, setServerUser] = useState<any | null>(null);
  const [serverRewards, setServerRewards] = useState<any[]>([]);

  const demoUser = useMemo(() => demoGetUser(id), [id, refresh]);
  const user = backend === 'demo' ? demoUser : serverUser;

  const [note, setNote] = useState('');
  const [rewardLabel, setRewardLabel] = useState('Premio manual');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, { cache: 'no-store' });
        if (res.status === 503) {
          if (!cancelled) setBackend('demo');
          return;
        }
        if (!res.ok) {
          if (!cancelled) setBackend('demo');
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setBackend('supabase');
          setServerUser(data?.user || null);
          setServerRewards(Array.isArray(data?.rewards) ? data.rewards : []);
        }
      } catch {
        if (!cancelled) setBackend('demo');
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id, refresh]);

  if (!user) {
    return (
      <div className="panel glass">
        <p>Usuario no encontrado.</p>
        <Link href="/admin/users" className="btn link">Volver</Link>
      </div>
    );
  }

  const effectivePlan = backend === 'demo'
    ? demoEffectivePlan(user as any)
    : ((user.plan_override && user.plan_override.until && (Date.now() < new Date(user.plan_override.until).getTime())) ? user.plan_override.plan : user.plan);
  const overdue = backend === 'demo'
    ? demoOverdueDays(user as any)
    : (user.billing?.nextDueAt ? Math.max(0, Math.floor((Date.now() - new Date(user.billing.nextDueAt).getTime()) / (1000 * 60 * 60 * 24))) : null);
  const overdueLabel = overdue === null ? '—' : overdue === 0 ? 'Al día' : `${overdue} días tarde`;

  return (
    <div className="profile">
      <header className="page-header">
        <div>
          <Link href="/admin/users" className="back">← Usuarios</Link>
          <h1 className="neon-text">{user.name}</h1>
          <p className="sub">{user.email}</p>
        </div>
        <div className="badges">
          <span className={`badge plan-${effectivePlan.toLowerCase()}`}>{effectivePlan}</span>
          <span className={`badge status-${user.status}`}>{user.status}</span>
        </div>
      </header>

      <div className="grid">
        <section className="panel glass">
          <h2>Estado</h2>
          <div className="kv">
            <span>Pago último</span>
            <span>{user.billing.lastPaidAt ? new Date(user.billing.lastPaidAt).toLocaleString() : 'N/A'}</span>
            <span>Vencimiento</span>
            <span>{user.billing.nextDueAt ? new Date(user.billing.nextDueAt).toLocaleDateString() : '—'}</span>
            <span>Morosidad</span>
            <span className={overdue && overdue > 0 ? 'danger' : ''}>{overdueLabel}</span>
          </div>

          <div className="actions">
            <button className="btn subtle" onClick={() => {
              if (backend === 'demo') {
                demoMarkPaid(user.id);
                setRefresh(v => v + 1);
                return;
              }
              fetch(`/api/admin/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ markPaid: true }),
              }).finally(() => setRefresh(v => v + 1));
            }}>Marcar pago</button>
            <button className="btn subtle" onClick={() => {
              if (backend === 'demo') {
                demoSetStatus(user.id, user.status === 'blocked' ? 'active' : 'blocked', 'Admin');
                setRefresh(v => v + 1);
                return;
              }
              fetch(`/api/admin/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ status: user.status === 'blocked' ? 'active' : 'blocked' }),
              }).finally(() => setRefresh(v => v + 1));
            }}>
              {user.status === 'blocked' ? 'Activar' : 'Bloquear'}
            </button>
          </div>
        </section>

        <section className="panel glass">
          <h2>Plan</h2>
          <div className="kv">
            <span>Plan base</span>
            <span>{user.plan}</span>
            <span>Override</span>
            <span>{user.planOverride ? `${user.planOverride.plan} hasta ${new Date(user.planOverride.until).toLocaleDateString()}` : '—'}</span>
          </div>

          <div className="actions">
            <select className="select" value={user.plan} onChange={e => {
              if (backend === 'demo') {
                demoSetPlan(user.id, e.target.value as DemoPlan, 'Admin');
                setRefresh(v => v + 1);
                return;
              }
              fetch(`/api/admin/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ plan: e.target.value }),
              }).finally(() => setRefresh(v => v + 1));
            }}>
              <option value="FREE">FREE</option>
              <option value="PRO">PRO</option>
              <option value="PREMIUM">PREMIUM</option>
            </select>
            <select className="select" defaultValue="PREMIUM_7" onChange={e => {
              const v = e.target.value;
              if (backend === 'demo') {
                if (v === 'PRO_7') demoSetPlanOverride(user.id, 'PRO', 7, 'Premio');
                if (v === 'PREMIUM_7') demoSetPlanOverride(user.id, 'PREMIUM', 7, 'Premio');
                if (v === 'CLEAR') demoClearPlanOverride(user.id, 'Admin');
                setRefresh(x => x + 1);
                return;
              }
              if (v === 'CLEAR') {
                fetch(`/api/admin/users/${user.id}`, {
                  method: 'PATCH',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({ planOverride: null }),
                }).finally(() => setRefresh(x => x + 1));
                return;
              }
              const plan = v === 'PRO_7' ? 'PRO' : 'PREMIUM';
              const until = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
              fetch(`/api/admin/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ planOverride: { plan, until, reason: 'Premio' } }),
              }).finally(() => setRefresh(x => x + 1));
            }}>
              <option value="PREMIUM_7">Premiar PREMIUM 7 días</option>
              <option value="PRO_7">Premiar PRO 7 días</option>
              <option value="CLEAR">Quitar override</option>
            </select>
          </div>
        </section>

        <section className="panel glass">
          <h2>Notas y premios</h2>
          <div className="stack">
            <textarea className="textarea" value={note} onChange={e => setNote(e.target.value)} placeholder="Nota interna (ej: reclamación, caso especial)..." />
            <div className="actions">
              <button className="btn subtle" onClick={() => {
                const label = `Nota: ${note.trim() || '(vacía)'}`;
                if (backend === 'demo') {
                  demoAddReward(user.id, { type: 'manual', label });
                  setNote('');
                  setRefresh(v => v + 1);
                  return;
                }
                fetch(`/api/admin/users/${user.id}`, {
                  method: 'PATCH',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({ addReward: { type: 'manual', label } }),
                }).finally(() => { setNote(''); setRefresh(v => v + 1); });
              }}>
                Guardar nota como evento
              </button>
            </div>
          </div>

          <div className="stack">
            <input className="input" value={rewardLabel} onChange={e => setRewardLabel(e.target.value)} placeholder="Etiqueta del premio..." />
            <div className="actions">
              <button className="btn" onClick={() => {
                const label = rewardLabel.trim() || 'Premio manual';
                if (backend === 'demo') {
                  demoAddReward(user.id, { type: 'manual', label });
                  setRefresh(v => v + 1);
                  return;
                }
                fetch(`/api/admin/users/${user.id}`, {
                  method: 'PATCH',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({ addReward: { type: 'manual', label } }),
                }).finally(() => setRefresh(v => v + 1));
              }}>
                Registrar premio
              </button>
            </div>
          </div>
        </section>

        <section className="panel glass wide">
          <h2>Historial</h2>
          <div className="history">
            <div className="hrow head">
              <span>Fecha</span>
              <span>Tipo</span>
              <span>Detalle</span>
            </div>
            {(backend === 'demo' ? (user as any).rewards : serverRewards).slice(0, 30).map((r: any) => (
              <div key={r.id} className="hrow">
                <span>{new Date(r.created_at).toLocaleString()}</span>
                <span>{r.type}</span>
                <span>{r.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 25px; }
        .back { opacity: 0.6; text-decoration: none; display: inline-block; margin-bottom: 10px; }
        .sub { opacity: 0.5; margin-top: 8px; }
        .badges { display: flex; gap: 10px; }

        .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .wide { grid-column: 1 / -1; }
        .panel { padding: 22px; border-radius: 20px; border: 1px solid var(--border); }
        h2 { font-size: 1rem; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 14px; opacity: 0.85; }
        .kv { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; margin-bottom: 12px; opacity: 0.9; }
        .danger { color: #ff0055; font-weight: 900; }
        .actions { display: flex; flex-wrap: wrap; gap: 10px; }
        .btn { background: var(--primary); border: none; color: white; padding: 10px 12px; border-radius: 12px; cursor: pointer; font-weight: 800; }
        .btn.subtle { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); }
        .btn.link { background: transparent; border: 1px solid rgba(255,255,255,0.15); text-decoration: none; display: inline-flex; align-items: center; justify-content: center; }
        .select, .input, .textarea { padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15); background: rgba(0,0,0,0.4); color: white; outline: none; width: 100%; }
        .textarea { min-height: 90px; resize: vertical; }
        .stack { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
        .history { border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; overflow: hidden; }
        .hrow { display: grid; grid-template-columns: 0.9fr 0.7fr 2fr; gap: 10px; padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .hrow:last-child { border-bottom: none; }
        .hrow.head { opacity: 0.5; font-size: 0.75rem; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; background: rgba(255,255,255,0.02); }

        .badge { display: inline-flex; align-items: center; justify-content: center; padding: 4px 10px; border-radius: 999px; font-weight: 900; font-size: 0.75rem; text-transform: uppercase; }
        .plan-free { background: rgba(0,255,136,0.1); color: #00ff88; border: 1px solid rgba(0,255,136,0.25); }
        .plan-pro { background: rgba(0,242,255,0.1); color: #00f2ff; border: 1px solid rgba(0,242,255,0.25); }
        .plan-premium { background: rgba(255,0,85,0.1); color: #ff0055; border: 1px solid rgba(255,0,85,0.25); }
        .status-active { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); }
        .status-blocked { background: rgba(255,0,85,0.12); border: 1px solid rgba(255,0,85,0.25); color: #ff0055; }
        .status-suspended { background: rgba(255,200,0,0.12); border: 1px solid rgba(255,200,0,0.25); color: #ffd24a; }

        @media (max-width: 980px) {
          .grid { grid-template-columns: 1fr; }
          .page-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
