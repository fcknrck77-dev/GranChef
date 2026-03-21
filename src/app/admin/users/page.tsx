'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function AdminUsersPage() {
  const [query, setQuery] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [users, setUsers] = useState<any[]>([]);
  const [giveaways, setGiveaways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', plan: 'FREE', password: '', durationDays: 0 });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/users?q=${encodeURIComponent(query)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setUsers(Array.isArray(data?.users) ? data.users : []);
        }

        const gRes = await fetch('/api/admin/giveaways', { cache: 'no-store' });
        if (gRes.ok) {
          const gData = await gRes.json();
          if (!cancelled) setGiveaways(Array.isArray(gData?.giveaways) ? gData.giveaways : []);
        }
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [query, refresh]);

  const forceRefresh = () => setRefresh(v => v + 1);

  const [eligibility, setEligibility] = useState('active_paid');
  const [winnerCount, setWinnerCount] = useState(1);
  const [prize, setPrize] = useState<'pro7' | 'premium7' | 'manual'>('pro7');
  const [customPrize, setCustomPrize] = useState('Premio sorpresa');

  const runGiveaway = () => {
    const prizeLabel = prize === 'pro7' ? 'PRO 7 días' : prize === 'premium7' ? 'PREMIUM 7 días' : customPrize.trim() || 'Premio';
    const rewardPlanOverride = prize === 'pro7' ? { plan: 'PRO', days: 7 } : prize === 'premium7' ? { plan: 'PREMIUM', days: 7 } : undefined;

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
      .catch((err) => alert(`Error al ejecutar sorteo: ${err.message}`));
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.name) return alert('Email y nombre son obligatorios');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewUser({ name: '', email: '', plan: 'FREE', password: '', durationDays: 0 });
        forceRefresh();
        alert('Usuario creado con éxito');
      } else {
        const error = await res.json();
        alert(`Error: ${error.error || 'No se pudo crear el usuario'}`);
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  return (
    <div className="admin-users">
      <header className="page-header">
        <div className="head-left">
          <h1 className="neon-text">Usuarios</h1>
          <p>Gestión real de perfiles en el Shard CORE.</p>
        </div>
        <div className="head-actions">
          <button className="btn" onClick={() => setShowAddModal(true)}>Nuevo Usuario</button>
          <button className="btn subtle" onClick={forceRefresh}>Refrescar</button>
        </div>
      </header>

      <section className="panel glass">
        <div className="panel-head">
          <h2>Directorio {loading && <small>(Cargando...)</small>}</h2>
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
            const hasOverride = u.plan_override && u.plan_override.until && (Date.now() < new Date(u.plan_override.until).getTime());
            const effectivePlan = hasOverride ? u.plan_override.plan : u.plan;
            const overdue = u.billing?.nextDueAt ? Math.max(0, Math.floor((Date.now() - new Date(u.billing.nextDueAt).getTime()) / (1000 * 60 * 60 * 24))) : null;
            const overdueLabel = overdue === null ? '-' : overdue === 0 ? '0 días' : `${overdue} días`;
            const paymentLabel = u.billing?.lastPaidAt ? new Date(u.billing.lastPaidAt).toLocaleDateString() : 'N/A';
            const isOverdue = overdue !== null && overdue > 0;

            return (
              <div key={u.id} className={`row ${u.status !== 'active' ? 'row-muted' : ''} ${isOverdue ? 'row-overdue' : ''}`}>
                <div className="user">
                  <strong>{u.name}</strong>
                  <small>{u.email}</small>
                </div>
                <div>
                  <span className={`badge plan-${(effectivePlan || 'FREE').toLowerCase()}`}>{effectivePlan}</span>
                  {hasOverride && (
                    <small className="hint">override hasta {new Date(u.plan_override.until).toLocaleDateString()}</small>
                  )}
                </div>
                <div>
                  <span className={`badge status-${u.status}`}>{u.status}</span>
                </div>
                <div>{paymentLabel}</div>
                <div className={isOverdue ? 'danger' : ''}>{overdueLabel}</div>
                <div className="actions">
                  <Link className="btn link" href={`/admin/users/user?id=${encodeURIComponent(u.id)}`}>Perfil</Link>
                  <button className="btn subtle" onClick={() => {
                    fetch(`/api/admin/users/${u.id}`, {
                      method: 'PATCH',
                      headers: { 'content-type': 'application/json' },
                      body: JSON.stringify({ markPaid: true }),
                    }).finally(forceRefresh);
                  }}>
                    Pago
                  </button>
                  <select
                    className="select"
                    value={u.plan}
                    onChange={e => {
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
                    <option value="ENTERPRISE">ENTERPRISE</option>
                  </select>
                  <select
                    className="select"
                    value={u.status}
                    onChange={e => {
                      fetch(`/api/admin/users/${u.id}`, {
                        method: 'PATCH',
                        headers: { 'content-type': 'application/json' },
                        body: JSON.stringify({ status: e.target.value }),
                      }).finally(forceRefresh);
                    }}
                    aria-label="Cambiar estado"
                  >
                    <option value="active">Activo</option>
                    <option value="blocked">Bloqueado</option>
                    <option value="suspended">Suspendido</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel glass">
        <div className="panel-head">
          <h2>Sorteos Reales</h2>
          <p className="muted">Ejecución inmediata sobre la base de datos.</p>
        </div>
        <div className="giveaway-grid">
          <label>
            Elegibilidad
            <select className="select" value={eligibility} onChange={e => setEligibility(e.target.value)}>
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="active_paid">Activos y al día</option>
              <option value="pro_plus">PRO o PREMIUM</option>
              <option value="overdue">Morosos</option>
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
          {giveaways.slice(0, 10).map(g => (
            <div key={g.id} className="row">
              <span>{new Date(g.created_at).toLocaleString()}</span>
              <span>{g.eligibility}</span>
              <span>{g.prize_label}</span>
              <span>{g.winner_count} ganador(es)</span>
            </div>
          ))}
        </div>
      </section>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal glass neon-border" onClick={e => e.stopPropagation()}>
            <h2 className="neon-text">Nuevo Usuario</h2>
            <div className="form">
              <label>Nombre Completo
                <input className="input" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="Ej: Juan Pérez" />
              </label>
              <label>Correo Electrónico
                <input className="input" type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="email@ejemplo.com" />
              </label>
              <label>Contraseña (opcional)
                <input className="input" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="Temp123!" />
              </label>
              <div className="form-row">
                <label>Plan
                  <select className="select" value={newUser.plan} onChange={e => setNewUser({...newUser, plan: e.target.value})}>
                    <option value="FREE">FREE</option>
                    <option value="PRO">PRO</option>
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="ENTERPRISE">ENTERPRISE</option>
                  </select>
                </label>
                <label>Duración (días)
                  <input className="input" type="number" value={newUser.durationDays} onChange={e => setNewUser({...newUser, durationDays: parseInt(e.target.value || '0', 10)})} />
                </label>
              </div>
              <div className="modal-actions">
                <button className="btn subtle" onClick={() => setShowAddModal(false)}>Cancelar</button>
                <button className="btn" onClick={handleAddUser}>Crear Usuario</button>
              </div>
            </div>
          </div>
        </div>
      )}

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

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal { width: 100%; max-width: 500px; padding: 40px; border-radius: 24px; position: relative; }
        .modal h2 { margin-bottom: 30px; }
        .form { display: flex; flex-direction: column; gap: 20px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px; }
        .input { width: 100%; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--border); background: rgba(0,0,0,0.4); color: white; outline: none; }
        .input:focus { border-color: var(--primary); }

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
