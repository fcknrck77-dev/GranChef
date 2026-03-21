'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminUserProfilePage() {
  const searchParams = useSearchParams();
  const id = String(searchParams.get('id') || '');
  const [refresh, setRefresh] = useState(0);
  const [user, setUser] = useState<any | null>(null);
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [note, setNote] = useState('');
  const [rewardLabel, setRewardLabel] = useState('Premio manual');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setUser(data?.user || null);
            setRewards(Array.isArray(data?.rewards) ? data.rewards : []);
          }
        }
      } catch (err) {
        console.error('Failed to load user profile:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id, refresh]);

  if (!id) {
    return (
      <div className="panel glass">
        <p>Selecciona un usuario desde el listado.</p>
        <Link href="/admin/users" className="btn link">Volver</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="panel glass">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="panel glass">
        <p>Usuario no encontrado en el Shard CORE.</p>
        <Link href="/admin/users" className="btn link">Volver</Link>
      </div>
    );
  }

  const hasOverride = user.plan_override && user.plan_override.until && (Date.now() < new Date(user.plan_override.until).getTime());
  const effectivePlan = hasOverride ? user.plan_override.plan : user.plan;
  const overdue = user.billing?.nextDueAt ? Math.max(0, Math.floor((Date.now() - new Date(user.billing.nextDueAt).getTime()) / (1000 * 60 * 60 * 24))) : null;
  const overdueLabel = overdue === null ? '-' : overdue === 0 ? 'Al día' : `${overdue} días tarde`;

  return (
    <div className="profile">
      <header className="page-header">
        <div>
          <Link href="/admin/users" className="back">← Usuarios</Link>
          <h1 className="neon-text">{user.name}</h1>
          <p className="sub">{user.email}</p>
        </div>
        <div className="badges">
          <span className={`badge plan-${(effectivePlan || 'FREE').toLowerCase()}`}>{effectivePlan}</span>
          <span className={`badge status-${user.status}`}>{user.status}</span>
        </div>
      </header>

      <div className="grid">
        <section className="panel glass">
          <h2>Estado del Pago</h2>
          <div className="kv">
            <span>Último Pago</span>
            <span>{user.billing?.lastPaidAt ? new Date(user.billing.lastPaidAt).toLocaleString() : 'N/A'}</span>
            <span>Próximo Vencimiento</span>
            <span>{user.billing?.nextDueAt ? new Date(user.billing.nextDueAt).toLocaleDateString() : '-'}</span>
            <span>Morosidad</span>
            <span className={overdue && overdue > 0 ? 'danger' : ''}>{overdueLabel}</span>
          </div>

          <div className="actions">
            <button className="btn subtle" onClick={() => {
              fetch(`/api/admin/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ markPaid: true }),
              }).finally(() => setRefresh(v => v + 1));
            }}>Registrar Pago</button>
            <button className="btn subtle" onClick={() => {
              fetch(`/api/admin/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ status: user.status === 'blocked' ? 'active' : 'blocked' }),
              }).finally(() => setRefresh(v => v + 1));
            }}>
              {user.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}
            </button>
          </div>
        </section>

        <section className="panel glass">
          <h2>Control de Plan</h2>
          <div className="kv">
            <span>Plan actual</span>
            <span>{user.plan}</span>
            <span>Override Temporal</span>
            <span>{user.plan_override ? `${user.plan_override.plan} hasta ${new Date(user.plan_override.until).toLocaleDateString()}` : 'Ninguno'}</span>
          </div>

          <div className="actions">
            <select className="select" value={user.plan} onChange={e => {
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
            <select className="select" defaultValue="" onChange={e => {
              const v = e.target.value;
              if (!v) return;
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
                body: JSON.stringify({ planOverride: { plan, until, reason: 'Premio Especial' } }),
              }).finally(() => setRefresh(x => x + 1));
            }}>
              <option value="" disabled>Acciones de premio...</option>
              <option value="PREMIUM_7">Premiar PREMIUM 7 días</option>
              <option value="PRO_7">Premiar PRO 7 días</option>
              <option value="CLEAR">Eliminar Override</option>
            </select>
          </div>
        </section>

        <section className="panel glass">
          <h2>Notas y Registro</h2>
          <div className="stack">
            <textarea className="textarea" value={note} onChange={e => setNote(e.target.value)} placeholder="Escribe una nota técnica o de seguimiento..." />
            <div className="actions">
              <button className="btn subtle" onClick={() => {
                const label = `Nota: ${note.trim() || '(vacía)'}`;
                fetch(`/api/admin/users/${user.id}`, {
                  method: 'PATCH',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({ addReward: { type: 'manual', label } }),
                }).finally(() => { setNote(''); setRefresh(v => v + 1); });
              }}>
                Guardar Nota
              </button>
            </div>
          </div>

          <div className="stack">
            <input className="input" value={rewardLabel} onChange={e => setRewardLabel(e.target.value)} placeholder="Descripción del premio..." />
            <div className="actions">
              <button className="btn" onClick={() => {
                const label = rewardLabel.trim() || 'Premio manual';
                fetch(`/api/admin/users/${user.id}`, {
                  method: 'PATCH',
                  headers: { 'content-type': 'application/json' },
                  body: JSON.stringify({ addReward: { type: 'manual', label } }),
                }).finally(() => setRefresh(v => v + 1));
              }}>
                Registrar Evento
              </button>
            </div>
          </div>
        </section>

        <section className="panel glass wide">
          <h2>Historial de Cuenta (CORE)</h2>
          <div className="history">
            <div className="hrow head">
              <span>Fecha</span>
              <span>Tipo</span>
              <span>Evento</span>
            </div>
            {rewards.map((r: any) => (
              <div key={r.id} className="hrow">
                <span>{new Date(r.created_at).toLocaleString()}</span>
                <span className="badge-small">{r.type}</span>
                <span>{r.label}</span>
              </div>
            ))}
            {rewards.length === 0 && <div className="hrow"><span>-</span><span>-</span><span>Sin eventos registrados</span></div>}
          </div>
        </section>
      </div>

      <style jsx>{`
        .profile { max-width: 1200px; margin: 0 auto; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 25px; }
        .back { opacity: 0.6; text-decoration: none; display: inline-block; margin-bottom: 10px; color: var(--primary); font-weight: 800; }
        .sub { opacity: 0.5; margin-top: 8px; }
        .badges { display: flex; gap: 10px; }

        .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .wide { grid-column: 1 / -1; }
        .panel { padding: 22px; border-radius: 20px; border: 1px solid var(--border); background: rgba(255,255,255,0.02); }
        h2 { font-size: 0.9rem; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 20px; opacity: 0.7; font-weight: 900; }
        .kv { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 20px; margin-bottom: 20px; opacity: 0.9; font-size: 0.95rem; }
        .danger { color: #ff0055; font-weight: 900; }
        .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
        .btn { background: var(--primary); border: none; color: white; padding: 12px 16px; border-radius: 12px; cursor: pointer; font-weight: 800; transition: all 0.2s; }
        .btn:hover { transform: translateY(-2px); box-shadow: var(--neon-shadow); }
        .btn.subtle { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); }
        .select, .input, .textarea { padding: 12px 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.3); color: white; outline: none; width: 100%; transition: border 0.2s; }
        .select:focus, .input:focus, .textarea:focus { border-color: var(--primary); }
        .textarea { min-height: 100px; resize: vertical; }
        .stack { display: flex; flex-direction: column; gap: 12px; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); }
        .history { border: 1px solid rgba(255,255,255,0.05); border-radius: 14px; overflow: hidden; background: rgba(0,0,0,0.2); }
        .hrow { display: grid; grid-template-columns: 0.9fr 0.7fr 2fr; gap: 10px; padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); align-items: center; }
        .hrow:last-child { border-bottom: none; }
        .hrow.head { opacity: 0.5; font-size: 0.7rem; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; background: rgba(255,255,255,0.03); }

        .badge { display: inline-flex; align-items: center; justify-content: center; padding: 4px 12px; border-radius: 999px; font-weight: 900; font-size: 0.75rem; text-transform: uppercase; }
        .badge-small { font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,0.1); text-transform: uppercase; font-weight: 700; opacity: 0.7; }
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
