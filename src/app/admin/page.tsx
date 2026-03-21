'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Send, RefreshCw, Zap, Users, Shield, ShieldOff, Search } from 'lucide-react';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  plan: 'FREE' | 'PRO' | 'PREMIUM';
  status: 'active' | 'blocked' | 'suspended';
  lastPayment: string;
  daysOverdue: number;
}

export default function AdminDashboard() {
  const [instruction, setInstruction] = useState('');
  const [kind, setKind] = useState<'courses' | 'ingredients' | 'techniques' | 'recipes'>('courses');
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [userSearch, setUserSearch] = useState('');

  // Gastronomic Engine State
  const [engineLoading, setEngineLoading] = useState(false);
  const [statusData, setStatusData] = useState<any>(null);
  const [canStart, setCanStart] = useState(false);

  useEffect(() => {
    fetchRequests();
    fetchUsers();
    fetchEngineStatus();
  }, []);

  const fetchEngineStatus = async () => {
    try {
      const res = await fetch('/api/admin/engine-cycle'); // Adjusted path from engine/cycle
      if (res.ok) {
        const data = await res.json();
        setStatusData(data);
        setCanStart(data.canStart);
      }
    } catch (err) {
      console.error('Failed to fetch engine status:', err);
    }
  };

  const handleTriggerCycle = async () => {
    if (!confirm('¿Seguro que quieres solicitar un nuevo ciclo? Si aún no toca (96h), quedará programado automáticamente.')) return;
    setEngineLoading(true);
    try {
      const res = await fetch('/api/admin/engine-cycle', { method: 'POST' });
      if (!res.ok) throw new Error('cycle_failed');
      const json = await res.json().catch(() => ({}));
      if (json?.scheduled) {
        alert(`Ciclo programado. Se ejecutará a partir de: ${new Date(json.runAt).toLocaleString()}`);
      } else {
        alert('Ciclo completado con éxito. Nuevos cursos inyectados.');
      }
      await fetchEngineStatus();
    } catch (err) {
      alert('Error al generar el ciclo. Revisa logs.');
    } finally {
      setEngineLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/requests?limit=10');
      if (res.ok) {
        const json = await res.json();
        setRequests(Array.isArray(json.requests) ? json.requests : []);
      }
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const json = await res.json();
        const rows = Array.isArray(json.users) ? json.users : [];
        const now = Date.now();
        const mapped: ManagedUser[] = rows.map((u: any) => {
          const billing = u?.billing || {};
          const nextDueMs = billing.nextDueAt ? Date.parse(billing.nextDueAt) : NaN;
          const daysOverdue = (Number.isFinite(nextDueMs) && nextDueMs < now) ? Math.ceil((now - nextDueMs) / (1000 * 60 * 60 * 24)) : 0;
          return {
            id: String(u.id),
            name: String(u.name || ''),
            email: String(u.email || ''),
            plan: (u.plan || 'FREE') as any,
            status: (u.status || 'active') as any,
            lastPayment: billing.lastPaidAt ? new Date(billing.lastPaidAt).toLocaleDateString() : 'N/A',
            daysOverdue,
          };
        });
        setUsers(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleUserAction = async (userId: string, action: 'block' | 'unblock') => {
    const status = action === 'block' ? 'blocked' : 'active';
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error('User action failed:', err);
    }
  };

  const handleSendOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/requests', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind, instruction, days_to_generate: days }),
      });
      if (res.ok) {
        setInstruction('');
        fetchRequests();
        alert('Orden enviada con éxito.');
      }
    } catch (err) {
      alert('Error al enviar orden.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const stats = [
    { label: 'Usuarios en CORE', val: users.length, trend: 'En tiempo real', icon: <Users size={20}/> },
    { label: 'Órdenes LOGS', val: requests.length, trend: 'Últimas 10', icon: <Zap size={20}/> },
    { label: 'Próximo Ciclo', val: statusData?.nextCycleDue ? new Date(statusData.nextCycleDue).toLocaleDateString() : 'Pendiente', trend: 'Programado', icon: <RefreshCw size={20}/> },
    { label: 'Estado Motor', val: canStart ? 'LISTO' : 'ESPERA', trend: 'HACCP/Cooldown', icon: <Shield size={20}/> },
  ];

  const handleManualSeed = async () => {
    if (!confirm('¿Seguro que quieres forzar la generación de contenido ahora? Esto ignorará el cooldown de 72h.')) return;
    setEngineLoading(true);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      if (!res.ok) throw new Error('seed_failed');
      alert('Contenido sembrado con éxito. Revisa la Enciclopedia y el Laboratorio.');
      await fetchEngineStatus();
    } catch (err) {
      alert('Error al sembrar contenido. Revisa logs.');
    } finally {
      setEngineLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="page-header">
        <h1 className="neon-text">Panel Shard 5.0</h1>
        <p>Control unificado de CORE, COURSES, AI_BRAIN, MARKETING y LOGS.</p>
      </header>

      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card glass">
            <div className="stat-head">
              <span className="icon">{s.icon}</span>
              <span className="trend up">{s.trend}</span>
            </div>
            <div className="stat-body">
              <p className="val">{s.val}</p>
              <p className="lbl">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="left-col">
          <section className="gastronomic-engine mb-30 glass">
            <div className="section-header">
              <h3><Zap size={20} className="mr-10 text-primary" /> Motor Gastronómico</h3>
              <span className={`engine-status ${canStart ? 'ready' : 'waiting'}`}>
                {engineLoading ? 'GENERANDO...' : canStart ? 'ONLINE / LISTO' : 'COOLDOWN / 72H'}
              </span>
            </div>

            <div className="engine-cycle-info">
              <div className="cycle-stat">
                <label>Vencimiento último ciclo</label>
                <p>{statusData?.latestCycle ? new Date(statusData.latestCycle.created_at).toLocaleString() : 'No registrado'}</p>
              </div>
              <div className="cycle-stat">
                <label>Próxima ventana de ejecución</label>
                <p>{statusData?.nextCycleDue ? new Date(statusData.nextCycleDue).toLocaleString() : 'Inmediata'}</p>
              </div>
            </div>

            <div className="engine-actions" style={{ display: 'flex', gap: '15px' }}>
              <button 
                className={`engine-trigger-btn ${canStart ? 'active' : 'disabled'}`}
                onClick={handleTriggerCycle}
                disabled={engineLoading}
              >
                {engineLoading ? <RefreshCw className="animate-spin mr-10" /> : <Sparkles size={18} className="mr-10" />}
                {engineLoading ? 'PROCESANDO...' : 'SOLICITAR CICLO'}
              </button>
              <button 
                className="engine-trigger-btn active"
                style={{ background: '#ff0055' }}
                onClick={handleManualSeed}
                disabled={engineLoading}
              >
                <RefreshCw className={engineLoading ? "animate-spin mr-10" : "mr-10"} size={18} />
                SEMBRAR DATOS (FORZAR)
              </button>
            </div>
          </section>

          <section className="ai-control-center glass mb-30">
            <div className="section-header">
              <h3><Send size={20} className="mr-10" /> Inserción de Órdenes</h3>
            </div>
            
            <form onSubmit={handleSendOrder} className="ai-form">
              <div className="input-group">
                <label>Instrucciones editoriales</label>
                <input 
                  type="text" 
                  placeholder="Ej: Priorizar técnicas de fermentación nórdica..." 
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Tipo de Contenido</label>
                  <select className="select" value={kind} onChange={(e) => setKind(e.target.value as any)}>
                    <option value="courses">Cursos Automáticos</option>
                    <option value="ingredients">Ingredientes (Laboratorio)</option>
                    <option value="techniques">Técnicas (Laboratorio)</option>
                    <option value="recipes">Recetas (Enciclopedia)</option>
                  </select>
                </div>
                <button type="submit" className="send-btn" disabled={loading || !instruction}>
                  {loading ? <RefreshCw className="animate-spin" /> : 'ENVIAR A FILA'}
                </button>
              </div>
            </form>

            <div className="recent-orders">
              <h4>Historial de Órdenes (LOGS)</h4>
              {requests.map(r => (
                <div key={r.id} className="order-item">
                  <span className={`status-dot ${r.status}`}></span>
                  <p>{r.instruction}</p>
                  <small>{r.kind.toUpperCase()}</small>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="right-col">
          <section className="user-management glass">
            <div className="section-header">
              <h3><Users size={20} className="mr-10" /> Usuarios Recientes</h3>
              <Link href="/admin/users" className="link-text">Ver todos</Link>
            </div>

            <div className="user-mini-list">
              {users.slice(0, 6).map(u => (
                <div key={u.id} className="user-mini-row">
                  <div className="u-info">
                    <strong>{u.name}</strong>
                    <span>{u.plan}</span>
                  </div>
                  <div className="u-actions">
                    {u.status === 'active' ? (
                      <button className="icon-btn" onClick={() => handleUserAction(u.id, 'block')}><ShieldOff size={14}/></button>
                    ) : (
                      <button className="icon-btn active" onClick={() => handleUserAction(u.id, 'unblock')}><Shield size={14}/></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="activity glass mt-20">
            <h3>Estado de Conexión</h3>
            <div className="health-stat">
              <label>Shard CORE</label>
              <div className="bar"><div className="fill done"></div></div>
            </div>
            <div className="health-stat">
              <label>Shard COURSES</label>
              <div className="bar"><div className="fill done"></div></div>
            </div>
            <div className="health-stat">
              <label>Shard AI_BRAIN</label>
              <div className="bar"><div className="fill done"></div></div>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard { max-width: 1400px; margin: 0 auto; color: white; }
        .page-header { margin-bottom: 40px; }
        .page-header h1 { font-size: 2.5rem; letter-spacing: -1px; }
        .page-header p { opacity: 0.5; margin-top: 5px; }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .stat-card { padding: 25px; border-radius: 20px; border: 1px solid var(--border); background: rgba(255,255,255,0.02); }
        .stat-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .icon { opacity: 0.5; }
        .trend { font-size: 0.7rem; font-weight: 900; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 8px; text-transform: uppercase; }
        .val { font-size: 1.8rem; font-weight: 900; color: var(--primary); }
        .lbl { font-size: 0.8rem; opacity: 0.4; font-weight: 700; margin-top: 5px; }

        .dashboard-sections { display: grid; grid-template-columns: 1fr 340px; gap: 30px; }
        section { padding: 30px; border-radius: 25px; border: 1px solid var(--border); background: rgba(255,255,255,0.01); }
        h3 { font-size: 1.1rem; font-weight: 900; margin-bottom: 25px; display: flex; align-items: center; }
        .mb-30 { margin-bottom: 30px; }
        .mt-20 { margin-top: 20px; }

        .engine-cycle-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 15px; }
        .cycle-stat label { font-size: 0.65rem; opacity: 0.4; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 5px; }
        .cycle-stat p { font-size: 0.9rem; font-weight: 700; }

        .engine-trigger-btn { width: 100%; padding: 16px; border-radius: 12px; border: none; font-weight: 900; cursor: pointer; transition: 0.3s; }
        .engine-trigger-btn.active { background: var(--primary); color: white; }
        .engine-trigger-btn.active:hover { background: white; color: black; box-shadow: 0 0 20px rgba(255,255,255,0.2); }
        .engine-trigger-btn.disabled { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.1); cursor: not-allowed; }

        .engine-status { font-size: 0.65rem; font-weight: 900; padding: 4px 10px; border-radius: 5px; }
        .engine-status.ready { color: #00ff88; background: rgba(0,255,136,0.1); }
        .engine-status.waiting { opacity: 0.3; }

        .ai-form { display: flex; flex-direction: column; gap: 15px; }
        .form-row { display: grid; grid-template-columns: 1fr auto; gap: 15px; align-items: flex-end; }
        .search-input { background: rgba(0,0,0,0.3); border: 1px solid var(--border); padding: 12px; border-radius: 10px; color: white; width: 100%; outline: none; }
        .search-input:focus { border-color: var(--primary); }
        .select { background: rgba(0,0,0,0.3); border: 1px solid var(--border); padding: 10px; border-radius: 10px; color: white; outline: none; }
        .send-btn { background: white; color: black; border: none; padding: 12px 20px; border-radius: 10px; font-weight: 900; cursor: pointer; }
        .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .order-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.03); font-size: 0.85rem; }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; }
        .status-dot.pending { background: #ffbb00; }
        .status-dot.completed { background: #00ff88; }
        .status-dot.processing { background: #0088ff; }
        .order-item p { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; opacity: 0.7; }
        .order-item small { font-size: 0.65rem; opacity: 0.3; font-weight: 900; }

        .user-mini-list { display: flex; flex-direction: column; gap: 12px; }
        .user-mini-row { display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255,255,255,0.02); border-radius: 10px; }
        .u-info strong { display: block; font-size: 0.85rem; }
        .u-info span { font-size: 0.7rem; opacity: 0.4; font-weight: 800; }
        .icon-btn { background: rgba(255,255,255,0.05); border: none; color: white; padding: 6px; border-radius: 6px; cursor: pointer; opacity: 0.5; }
        .icon-btn.active { color: #00ff88; }

        .link-text { font-size: 0.75rem; color: var(--primary); text-decoration: none; font-weight: 800; }
        .health-stat { margin-bottom: 15px; }
        .health-stat label { font-size: 0.65rem; opacity: 0.5; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 5px; }
        .bar { height: 4px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
        .fill.done { width: 100%; background: #00ff88; box-shadow: 0 0 10px rgba(0,255,136,0.3); }

        .mr-10 { margin-right: 10px; }
        .text-primary { color: var(--primary); }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
