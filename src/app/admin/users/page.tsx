'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  demoBlockOverdueUsers,
  demoEffectivePlan,
  demoListGiveaways,
  demoListUsers,
  demoMarkPaid,
  demoOverdueDays,
  demoRunGiveaway,
  demoSetPlan,
  demoSetPlanOverride,
  demoSetStatus,
  type DemoPlan,
  type GiveawayEligibility,
} from '@/lib/demoUsersStore';

export default function AdminUsersPage() {
  const [query, setQuery] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [backend, setBackend] = useState<'demo' | 'supabase'>('demo');
  const [serverUsers, setServerUsers] = useState<any[]>([]);
  const [serverGiveaways, setServerGiveaways] = useState<any[]>([]);

  const users = useMemo(() => (backend === 'demo' ? demoListUsers(query) : serverUsers), [backend, query, refresh, serverUsers]);
  const giveaways = useMemo(() => (backend === 'demo' ? demoListGiveaways() : serverGiveaways), [backend, refresh, serverGiveaways]);

  useEffect(() => {
    // Ensure seed on first load
    demoListUsers();
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/admin/users?q=${encodeURIComponent(query)}`, { cache: 'no-store' });
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
          setServerUsers(Array.isArray(data?.users) ? data.users : []);
        }

        const gRes = await fetch('/api/admin/giveaways', { cache: 'no-store' });
        if (gRes.ok) {
          const gData = await gRes.json();
          if (!cancelled) setServerGiveaways(Array.isArray(gData?.giveaways) ? gData.giveaways : []);
        }
      } catch {
        if (!cancelled) setBackend('demo');
      }
    }
    load();
    return () => { cancelled = true; };
  }, [query, refresh]);

  const forceRefresh = () => setRefresh(v => v + 1);

  const [eligibility, setEligibility] = useState<GiveawayEligibility>('active_paid');
  const [winnerCount, setWinnerCount] = useState(1);
  const [prize, setPrize] = useState<'pro7' | 'premium7' | 'manual'>('pro7');
  const [customPrize, setCustomPrize] = useState('Premio sorpresa');

  const runGiveaway = () => {
    const prizeLabel =
      prize === 'pro7' ? 'PRO 7 días' : prize === 'premium7' ? 'PREMIUM 7 días' : customPrize.trim() || 'Premio';
    const rewardPlanOverride =
      prize === 'pro7' ? { plan: 'PRO' as DemoPlan, days: 7 } : prize === 'premium7' ? { plan: 'PREMIUM' as DemoPlan, days: 7 } : undefined;

    if (backend === 'demo') {
      const record = demoRunGiveaway({
        eligibility,
        winnerCount: Number.isFinite(winnerCount) ? Math.max(1, winnerCount) : 1,
        prizeLabel,
        rewardPlanOverride,
      });
      alert(`Sorteo realizado. Ganadores: ${record.winners.map(w => w.name).join(', ') || 'Ninguno'}`);
      forceRefresh();
      return;
    }

    fetch('/api/admin/giveaways', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        eligibility,
        winnerCount: Number.isFinite(winnerCount) ? Math.max(1, winnerCount) : 1,
        prizeLabel,
        rewardPlanOverride,
      }),
    })
      .then(r => r.json().then(j => ({ ok: r.ok, j })))
      .then(({ ok, j }) => {
        if (!ok) throw new Error(j?.error || 'Error');
        alert(`Sorteo realizado. Ganadores: ${(j?.winners || []).map((w: any) => w.name).join(', ') || 'Ninguno'}`);
        forceRefresh();
      })
      .catch(() => alert('No se pudo ejecutar el sorteo en Supabase. Revisa /api/admin/health y tu configuración.'));
  };

  return (
    <div className="admin-users">
      <header className="page-header">
        <div className="head-left">
          <h1 className="neon-text">Usuarios</h1>
          <p>Perfiles, pagos, planes, bloqueos y premios (modo demo local).</p>
        </div>
        <div className="head-actions">
          <button className="btn subtle" onClick={() => { demoBlockOverdueUsers(1); forceRefresh(); }}>
            Bloquear morosos
          </button>
          <button className="btn" onClick={forceRefresh}>Refrescar</button>
        </div>
      </header>

      <section className="panel glass">
        <div className="panel-head">
          <h2>Directorio</h2>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="search"
          />
        </div>

        <div className="table">
          <div className="row head">
            <span>Usuario</span>
            <span>Plan</span>
            <span>Estado</span>
            <span>Pago</span>
            <span>Morosidad</span>
            <span>Acciones</span>
          </div>

          {users.map(u => {
            const effectivePlan = backend === 'demo'
              ? demoEffectivePlan(u as any)
              : ((u.plan_override && u.plan_override.until && (Date.now() < new Date(u.plan_override.until).getTime())) ? u.plan_override.plan : u.plan);
            const overdue = backend === 'demo'
              ? demoOverdueDays(u as any)
              : (u.billing?.nextDueAt ? Math.max(0, Math.floor((Date.now() - new Date(u.billing.nextDueAt).getTime()) / (1000 * 60 * 60 * 24))) : null);
            const overdueLabel = overdue === null ? '—' : overdue === 0 ? '0 días' : `${overdue} días`;
            const paymentLabel = u.billing?.lastPaidAt ? new Date(u.billing.lastPaidAt).toLocaleDateString() : 'N/A';
            const isOverdue = overdue !== null && overdue > 0;

            return (
              <div key={u.id} className={`row ${u.status !== 'active' ? 'row-muted' : ''} ${isOverdue ? 'row-overdue' : ''}`}>
                <div className="user">
                  <strong>{u.name}</strong>
                  <small>{u.email}</small>
                </div>
                <div>
                  <span className={`badge plan-${effectivePlan.toLowerCase()}`}>{effectivePlan}</span>
                  {backend === 'demo' && (u as any).planOverride && (
                    <small className="hint">override hasta {new Date((u as any).planOverride.until).toLocaleDateString()}</small>
                  )}
                  {backend === 'supabase' && u.plan_override?.until && (
                    <small className="hint">override hasta {new Date(u.plan_override.until).toLocaleDateString()}</small>
                  )}
                </div>
                <div>
                  <span className={`badge status-${u.status}`}>{u.status}</span>
                </div>
                <div>{paymentLabel}</div>
                <div className={isOverdue ? 'danger' : ''}>{overdueLabel}</div>
                <div className="actions">
                  <Link className="btn link" href={`/admin/users/${u.id}`}>Perfil</Link>
                  <button className="btn subtle" onClick={() => {
                    if (backend === 'demo') {
                      demoMarkPaid(u.id);
                      forceRefresh();
                      return;
                    }
                    fetch(`/api/admin/users/${u.id}`, {
                      method: 'PATCH',
                      headers: { 'content-type': 'application/json' },
                      body: JSON.stringify({ markPaid: true }),
                    }).finally(forceRefresh);
                  }}>
                    Marcar pago
                  </button>
                  <select
                    className="select"
                    value={u.plan}
                    onChange={e => {
                      if (backend === 'demo') {
                        demoSetPlan(u.id, e.target.value as DemoPlan, 'Admin');
                        forceRefresh();
                        return;
                      }
                      fetch(`/api/admin/users/${u.id}`, {
                        method: 'PATCH',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify({ plan: e.target.value }),
                      }).finally(forceRefresh);
                    }}
                    aria-label="Cambiar plan"
                  >
                    <option value="FREE">FREE</option>
                    <option value="PRO">PRO</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                  <button
                    className="btn subtle"
                    onClick={() => {
                      if (backend === 'demo') {
                        demoSetStatus(u.id, u.status === 'blocked' ? 'active' : 'blocked', 'Admin');
                        forceRefresh();
                        return;
                      }
                      fetch(`/api/admin/users/${u.id}`, {
                        method: 'PATCH',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify({ status: u.status === 'blocked' ? 'active' : 'blocked' }),
                      }).finally(forceRefresh);
                    }}
                  >
                    {u.status === 'blocked' ? 'Activar' : 'Bloquear'}
                  </button>
                  <button
                    className="btn"
                    onClick={() => {
                      if (backend === 'demo') {
                        demoSetPlanOverride(u.id, 'PREMIUM', 7, 'Premio manual');
                        forceRefresh();
                        return;
                      }
                      const until = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
                      fetch(`/api/admin/users/${u.id}`, {
                        method: 'PATCH',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify({ planOverride: { plan: 'PREMIUM', until, reason: 'Premio manual' } }),
                      }).finally(forceRefresh);
                    }}
                  >
                    Premiar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel glass">
        <div className="panel-head">
          <h2>Sorteos</h2>
          <p className="muted">Selecciona elegibilidad y premio. Se registra el historial.</p>
        </div>
        <div className="giveaway-grid">
          <label>
            Elegibilidad
            <select className="select" value={eligibility} onChange={e => setEligibility(e.target.value as GiveawayEligibility)}>
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="active_paid">Activos y al día</option>
              <option value="pro_plus">PRO o PREMIUM</option>
            </select>
          </label>
          <label>
            Ganadores
            <input className="search" type="number" value={winnerCount} min={1} onChange={e => setWinnerCount(parseInt(e.target.value || '1', 10))} />
          </label>
          <label>
            Premio
            <select className="select" value={prize} onChange={e => setPrize(e.target.value as any)}>
              <option value="pro7">PRO 7 días</option>
              <option value="premium7">PREMIUM 7 días</option>
              <option value="manual">Personalizado</option>
            </select>
          </label>
          {prize === 'manual' && (
            <label>
              Etiqueta premio
              <input className="search" value={customPrize} onChange={e => setCustomPrize(e.target.value)} placeholder="Ej: Cena privada, Cupón..." />
            </label>
          )}
          <div className="giveaway-actions">
            <button className="btn" onClick={runGiveaway}>Ejecutar sorteo</button>
          </div>
        </div>

        <div className="history">
          <div className="row head">
            <span>Fecha</span>
            <span>Elegibilidad</span>
            <span>Premio</span>
            <span>Ganadores</span>
          </div>
          {giveaways.slice(0, 8).map(g => (
            <div key={g.id} className="row">
              <span>{new Date(g.created_at).toLocaleString()}</span>
              <span>{(g as any).eligibility}</span>
              <span>{(g as any).prizeLabel ?? (g as any).prize_label}</span>
              <span>
                {Array.isArray((g as any).winners)
                  ? (g as any).winners.map((w: any) => w.name).join(', ') || '—'
                  : (typeof (g as any).winner_count === 'number'
                      ? `${(g as any).winner_count} ganador(es)`
                      : '—')}
              </span>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; margin-bottom: 30px; }
        .head-left p { opacity: 0.5; margin-top: 10px; }
        .head-actions { display: flex; gap: 10px; }
        .panel { padding: 25px; border-radius: 20px; border: 1px solid var(--border); margin-bottom: 25px; }
        .panel-head { display: flex; justify-content: space-between; align-items: center; gap: 15px; margin-bottom: 15px; }
        .panel-head h2 { font-size: 1.1rem; letter-spacing: 2px; text-transform: uppercase; }
        .muted { opacity: 0.5; font-size: 0.9rem; }
        .search { width: 320px; max-width: 100%; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--border); background: rgba(255,255,255,0.03); color: white; outline: none; }

        .table { display: flex; flex-direction: column; border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; overflow: hidden; }
        .row { display: grid; grid-template-columns: 1.6fr 0.9fr 0.8fr 0.7fr 0.7fr 2.1fr; gap: 12px; padding: 14px 14px; border-bottom: 1px solid rgba(255,255,255,0.05); align-items: center; }
        .row:last-child { border-bottom: none; }
        .row.head { opacity: 0.5; font-size: 0.75rem; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; background: rgba(255,255,255,0.02); }
        .user strong { display: block; }
        .user small { opacity: 0.5; }
        .hint { display: block; opacity: 0.5; margin-top: 3px; font-size: 0.75rem; }
        .row-muted { opacity: 0.7; }
        .row-overdue { border-left: 3px solid #ff0055; }
        .danger { color: #ff0055; font-weight: 800; }

        .actions { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
        .btn { background: var(--primary); border: none; color: white; padding: 10px 12px; border-radius: 12px; cursor: pointer; font-weight: 800; }
        .btn:hover { box-shadow: var(--neon-shadow); }
        .btn.subtle { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); }
        .btn.link { background: transparent; border: 1px solid rgba(255,255,255,0.15); text-decoration: none; display: inline-flex; align-items: center; justify-content: center; }
        .select { padding: 10px 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.15); background: rgba(0,0,0,0.4); color: white; }

        .badge { display: inline-flex; align-items: center; justify-content: center; padding: 4px 10px; border-radius: 999px; font-weight: 900; font-size: 0.75rem; text-transform: uppercase; }
        .plan-free { background: rgba(0,255,136,0.1); color: #00ff88; border: 1px solid rgba(0,255,136,0.25); }
        .plan-pro { background: rgba(0,242,255,0.1); color: #00f2ff; border: 1px solid rgba(0,242,255,0.25); }
        .plan-premium { background: rgba(255,0,85,0.1); color: #ff0055; border: 1px solid rgba(255,0,85,0.25); }
        .status-active { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); }
        .status-blocked { background: rgba(255,0,85,0.12); border: 1px solid rgba(255,0,85,0.25); color: #ff0055; }
        .status-suspended { background: rgba(255,200,0,0.12); border: 1px solid rgba(255,200,0,0.25); color: #ffd24a; }

        .giveaway-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; }
        label { display: flex; flex-direction: column; gap: 8px; font-weight: 800; opacity: 0.85; }
        .giveaway-actions { display: flex; align-items: flex-end; justify-content: flex-end; }
        .history { margin-top: 18px; border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; overflow: hidden; }
        @media (max-width: 900px) {
          .row { grid-template-columns: 1fr; }
          .actions { justify-content: flex-start; }
          .search { width: 100%; }
          .panel-head { flex-direction: column; align-items: flex-start; }
          .page-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
