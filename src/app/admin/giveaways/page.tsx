'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { IS_STATIC_EXPORT } from '@/lib/deployTarget';

type GiveAwayRow = {
  id: string;
  eligibility: string;
  prize_label: string;
  prize_meta?: any;
  status?: string;
  winner_count: number;
  created_at: string;
};

type WinnerRow = {
  giveaway_id: string;
  user_id: string;
  name: string;
  email: string;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  status: string;
  plan: 'FREE' | 'PRO' | 'PREMIUM';
  billing?: any;
};

export default function AdminGiveawaysPage() {
  if (IS_STATIC_EXPORT) {
    return (
      <div className="panel glass" style={{ padding: 24, borderRadius: 20, border: '1px solid var(--border)' }}>
        <h1 style={{ marginTop: 0 }}>Sorteos y Premios</h1>
        <p style={{ opacity: 0.8 }}>
          Esta seccion requiere backend (`/api/admin/*`) y no esta disponible en el export estatico para FTP.
        </p>
        <Link href="/admin/users" className="btn link">Ir a Usuarios</Link>
      </div>
    );
  }

  const [giveaways, setGiveaways] = useState<GiveAwayRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<{ giveaway: GiveAwayRow; winners: WinnerRow[]; rewards: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [eligibility, setEligibility] = useState('active_paid');
  const [winnerCount, setWinnerCount] = useState(1);
  const [prizeLabel, setPrizeLabel] = useState('Upgrade de plan');
  const [rewardType, setRewardType] = useState<'none' | 'plan_override' | 'plan_set' | 'custom_reward'>('plan_override');
  const [rewardPlan, setRewardPlan] = useState<'FREE' | 'PRO' | 'PREMIUM'>('PREMIUM');
  const [rewardDays, setRewardDays] = useState(30);
  const [planSet, setPlanSet] = useState<'FREE' | 'PRO' | 'PREMIUM'>('PRO');
  const [customRewardType, setCustomRewardType] = useState('coupon');
  const [customLabel, setCustomLabel] = useState('Codigo descuento');
  const [couponCode, setCouponCode] = useState('GC-');

  const [userSearch, setUserSearch] = useState('');
  const [userResults, setUserResults] = useState<UserRow[]>([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);

  async function refreshList() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/giveaways', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'failed');
      setGiveaways(json.giveaways || []);
    } catch (e: any) {
      setError(e?.message || 'No se pudo cargar sorteos');
    } finally {
      setLoading(false);
    }
  }

  async function loadDetail(id: string) {
    setSelectedId(id);
    setDetailLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/giveaways/${id}`, { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'failed');
      setSelected(json);
    } catch (e: any) {
      setError(e?.message || 'No se pudo cargar el sorteo');
      setSelected(null);
    } finally {
      setDetailLoading(false);
    }
  }

  useEffect(() => {
    refreshList();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setSelected(null);
      return;
    }
    loadDetail(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const sortedGiveaways = useMemo(() => {
    return [...giveaways].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  }, [giveaways]);

  async function createGiveaway() {
    setBusy(true);
    setError(null);
    try {
      const reward =
        rewardType === 'none'
          ? { type: 'none' as const }
          : rewardType === 'plan_override'
            ? { type: 'plan_override' as const, plan: rewardPlan, days: rewardDays }
            : rewardType === 'plan_set'
              ? { type: 'plan_set' as const, plan: planSet }
              : { type: 'custom_reward' as const, rewardType: customRewardType, label: customLabel, meta: { couponCode } };

      const prizeMeta =
        rewardType === 'custom_reward'
          ? { couponCode, reward }
          : { reward };

      const res = await fetch('/api/admin/giveaways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eligibility,
          winnerCount,
          prizeLabel,
          prizeMeta,
          reward
        })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'failed');
      await refreshList();
      if (json?.giveaway?.id) setSelectedId(json.giveaway.id);
    } catch (e: any) {
      setError(e?.message || 'No se pudo crear el sorteo');
    } finally {
      setBusy(false);
    }
  }

  async function action(actionBody: any) {
    if (!selectedId) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/giveaways/${selectedId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actionBody)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'failed');
      await loadDetail(selectedId);
      await refreshList();
    } catch (e: any) {
      setError(e?.message || 'No se pudo ejecutar la accion');
    } finally {
      setBusy(false);
    }
  }

  async function searchUsers() {
    setUserSearchLoading(true);
    try {
      const res = await fetch(`/api/admin/users?q=${encodeURIComponent(userSearch)}`, { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'failed');
      setUserResults(json.users || []);
    } catch {
      setUserResults([]);
    } finally {
      setUserSearchLoading(false);
    }
  }

  return (
    <div className="giveaways-page">
      <header className="top">
        <div>
          <h1>Sorteos y Premios</h1>
          <p>Control total: crear sorteos, aplicar upgrades/downgrades y gestionar ganadores.</p>
        </div>
        <button className="btn" onClick={refreshList} disabled={loading || busy}>
          Recargar
        </button>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="grid">
        <section className="panel">
          <h2>Nuevo sorteo</h2>
          <div className="form">
            <label>
              Elegibilidad
              <select value={eligibility} onChange={(e) => setEligibility(e.target.value)} disabled={busy}>
                <option value="active_paid">Activos al dia (pagado)</option>
                <option value="active">Activos</option>
                <option value="pro_plus">PRO y PREMIUM</option>
                <option value="overdue">Morosos (overdue)</option>
                <option value="all">Todos</option>
              </select>
            </label>

            <label>
              Ganadores
              <input
                type="number"
                min={1}
                max={50}
                value={winnerCount}
                onChange={(e) => setWinnerCount(Number(e.target.value) || 1)}
                disabled={busy}
              />
            </label>

            <label>
              Premio (titulo)
              <input value={prizeLabel} onChange={(e) => setPrizeLabel(e.target.value)} disabled={busy} />
            </label>

            <label>
              Tipo de premio
              <select value={rewardType} onChange={(e) => setRewardType(e.target.value as any)} disabled={busy}>
                <option value="plan_override">Upgrade temporal</option>
                <option value="plan_set">Cambiar plan (permanente)</option>
                <option value="custom_reward">Premio personalizado</option>
                <option value="none">Solo registrar ganadores</option>
              </select>
            </label>

            {rewardType === 'plan_override' && (
              <div className="row">
                <label>
                  Plan
                  <select value={rewardPlan} onChange={(e) => setRewardPlan(e.target.value as any)} disabled={busy}>
                    <option value="FREE">FREE</option>
                    <option value="PRO">PRO</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                </label>
                <label>
                  Dias
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={rewardDays}
                    onChange={(e) => setRewardDays(Number(e.target.value) || 7)}
                    disabled={busy}
                  />
                </label>
              </div>
            )}

            {rewardType === 'plan_set' && (
              <label>
                Nuevo plan
                <select value={planSet} onChange={(e) => setPlanSet(e.target.value as any)} disabled={busy}>
                  <option value="FREE">FREE</option>
                  <option value="PRO">PRO</option>
                  <option value="PREMIUM">PREMIUM</option>
                </select>
              </label>
            )}

            {rewardType === 'custom_reward' && (
              <>
                <div className="row">
                  <label>
                    rewardType
                    <input value={customRewardType} onChange={(e) => setCustomRewardType(e.target.value)} disabled={busy} />
                  </label>
                  <label>
                    Codigo (opcional)
                    <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} disabled={busy} />
                  </label>
                </div>
                <label>
                  Etiqueta
                  <input value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} disabled={busy} />
                </label>
              </>
            )}

            <button className="btn primary" onClick={createGiveaway} disabled={busy}>
              Crear y sortear
            </button>
          </div>
        </section>

        <section className="panel">
          <h2>Historial</h2>
          {loading ? (
            <div className="muted">Cargando...</div>
          ) : sortedGiveaways.length === 0 ? (
            <div className="muted">No hay sorteos aun.</div>
          ) : (
            <div className="list">
              {sortedGiveaways.map((g) => (
                <button key={g.id} className={`item ${selectedId === g.id ? 'active' : ''}`} onClick={() => setSelectedId(g.id)}>
                  <div className="item-top">
                    <strong>{g.prize_label}</strong>
                    <span className={`tag ${String(g.status || 'completed')}`}>{String(g.status || 'completed')}</span>
                  </div>
                  <div className="item-sub">
                    <span>{new Date(g.created_at).toLocaleString('es-ES')}</span>
                    <span>{g.winner_count} ganador(es)</span>
                    <span>elig: {g.eligibility}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <h2>Detalle</h2>
          {!selectedId ? (
            <div className="muted">Selecciona un sorteo del historial.</div>
          ) : detailLoading ? (
            <div className="muted">Cargando detalle...</div>
          ) : !selected ? (
            <div className="muted">No se pudo cargar.</div>
          ) : (
            <>
              <div className="detail-head">
                <div>
                  <div className="big">{selected.giveaway.prize_label}</div>
                  <div className="muted">
                    {selected.giveaway.eligibility} | {selected.giveaway.winner_count} ganadores | {String(selected.giveaway.status || 'completed')}
                  </div>
                </div>
                <div className="actions">
                  <button className="btn" onClick={() => action({ action: 'reroll_all' })} disabled={busy}>
                    Reroll (todos)
                  </button>
                  <button className="btn danger" onClick={() => action({ action: 'revoke' })} disabled={busy}>
                    Revocar
                  </button>
                </div>
              </div>

              <h3>Ganadores</h3>
              {selected.winners.length === 0 ? (
                <div className="muted">Sin ganadores.</div>
              ) : (
                <div className="winners">
                  {selected.winners.map((w) => (
                    <div key={w.user_id} className="winner">
                      <div className="who">
                        <strong>{w.name}</strong>
                        <small>{w.email}</small>
                      </div>
                      <button className="btn danger sm" onClick={() => action({ action: 'remove_winner', userId: w.user_id })} disabled={busy}>
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <h3>Añadir ganador manual</h3>
              <div className="row">
                <input
                  placeholder="Buscar por nombre o email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  disabled={busy}
                />
                <button className="btn" onClick={searchUsers} disabled={busy || userSearchLoading || userSearch.trim().length < 2}>
                  {userSearchLoading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
              {userResults.length > 0 && (
                <div className="search-results">
                  {userResults.slice(0, 10).map((u) => (
                    <button key={u.id} className="result" onClick={() => action({ action: 'add_winner', userId: u.id })} disabled={busy}>
                      <strong>{u.name}</strong>
                      <span>{u.email}</span>
                      <span className="pill">{u.plan}</span>
                      <span className={`pill ${u.status}`}>{u.status}</span>
                    </button>
                  ))}
                </div>
              )}

              <h3>Rewards generados</h3>
              <div className="muted">Registros en user_rewards con meta.giveawayId.</div>
              <div className="rewards">
                {selected.rewards.slice(0, 20).map((r: any) => (
                  <div key={r.id} className="reward">
                    <span className="pill">{r.type}</span>
                    <span>{r.label}</span>
                    <small>{new Date(r.created_at).toLocaleString('es-ES')}</small>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      <style jsx>{`
        .giveaways-page { max-width: 1200px; margin: 0 auto; }
        .top { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; margin-bottom: 25px; }
        h1 { font-size: 2.2rem; margin: 0; }
        p { margin: 6px 0 0; opacity: 0.65; }

        .grid { display: grid; grid-template-columns: 1.1fr 0.9fr 1.3fr; gap: 18px; align-items: start; }
        .panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 18px; }
        .panel h2 { margin: 0 0 12px; font-size: 1rem; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.8; }
        .panel h3 { margin: 18px 0 8px; font-size: 0.9rem; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.8; }

        .form { display: grid; gap: 12px; }
        label { display: grid; gap: 6px; font-size: 0.85rem; opacity: 0.8; }
        input, select {
          background: rgba(0,0,0,0.35);
          border: 1px solid rgba(255,255,255,0.12);
          color: white;
          padding: 10px 12px;
          border-radius: 12px;
          outline: none;
        }
        input:focus, select:focus { border-color: rgba(var(--primary-rgb), 0.6); box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.15); }

        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .row input { width: 100%; }
        .actions { display: flex; gap: 10px; justify-content: flex-end; }
        .btn {
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.04);
          color: white;
          padding: 10px 12px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 800;
          transition: 0.2s;
        }
        .btn:hover { border-color: rgba(var(--primary-rgb), 0.8); transform: translateY(-1px); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .btn.primary { background: rgba(var(--primary-rgb), 0.15); border-color: rgba(var(--primary-rgb), 0.35); }
        .btn.danger { border-color: rgba(255,0,80,0.35); background: rgba(255,0,80,0.1); }
        .btn.sm { padding: 8px 10px; font-size: 0.85rem; }

        .error { margin: 10px 0 18px; padding: 12px 14px; border-radius: 14px; background: rgba(255,0,80,0.08); border: 1px solid rgba(255,0,80,0.3); }
        .muted { opacity: 0.6; }

        .list { display: grid; gap: 10px; }
        .item { text-align: left; width: 100%; padding: 12px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.22); cursor: pointer; }
        .item.active { border-color: rgba(var(--primary-rgb), 0.6); }
        .item-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .item-sub { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 8px; opacity: 0.65; font-size: 0.8rem; }

        .tag { font-size: 0.7rem; padding: 4px 8px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.14); opacity: 0.9; }
        .tag.revoked { border-color: rgba(255,0,80,0.5); color: rgb(255, 160, 180); }
        .tag.completed { border-color: rgba(0,255,136,0.35); color: rgb(160, 255, 210); }
        .tag.draft { border-color: rgba(255,170,0,0.35); color: rgb(255, 220, 160); }

        .detail-head { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
        .big { font-size: 1.2rem; font-weight: 900; }

        .winners { display: grid; gap: 10px; }
        .winner { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.22); }
        .who { display: grid; }
        .who small { opacity: 0.65; }

        .search-results { margin-top: 10px; display: grid; gap: 8px; }
        .result { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; padding: 10px 12px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.22); cursor: pointer; }
        .result:hover { border-color: rgba(var(--primary-rgb), 0.6); }
        .result span { opacity: 0.75; }

        .pill { font-size: 0.7rem; padding: 3px 8px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.14); }
        .pill.active { border-color: rgba(0,255,136,0.35); }
        .pill.blocked { border-color: rgba(255,0,80,0.35); }
        .pill.suspended { border-color: rgba(255,170,0,0.35); }

        .rewards { margin-top: 10px; display: grid; gap: 8px; }
        .reward { display: grid; grid-template-columns: auto 1fr auto; gap: 10px; align-items: center; padding: 10px 12px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.22); }
        .reward small { opacity: 0.6; }

        @media (max-width: 1100px) {
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
