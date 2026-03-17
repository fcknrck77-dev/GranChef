'use client';

import { useState, useEffect } from 'react';
import { demoFetchAiRequests, demoInsertAiRequest } from '@/lib/demoStore';
import { Sparkles, Send, RefreshCw, Zap, Users, Shield, ShieldOff, Trash2 } from 'lucide-react';
import { IS_STATIC_EXPORT } from '@/lib/deployTarget';

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

  const handleUserAction = async (userId: string, action: 'block' | 'unblock' | 'delete') => {
    if (action === 'delete') {
      alert('Borrado no implementado en la previa. Usa Bloquear/Activar o gestiona en Supabase.');
      return;
    }

    const status = action === 'block' ? 'blocked' : 'active';
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('request_failed');
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));
    } catch {
      // Demo fallback: update UI only
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  useEffect(() => {
    fetchRequests();
    fetchUsers();
    if (!IS_STATIC_EXPORT) fetchEngineStatus();
  }, []);

  const fetchEngineStatus = async () => {
    if (IS_STATIC_EXPORT) return;
    try {
      const res = await fetch('/api/admin/engine/cycle');
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
    if (IS_STATIC_EXPORT) {
      alert('En export estático (FTP) no existe backend /api. Para generar ciclos hay que usar un despliegue con servidor o un job externo.');
      return;
    }
    if (!confirm('¿Seguro que quieres solicitar un nuevo ciclo? Si aún no toca (96h), quedará programado automáticamente.')) return;
    setEngineLoading(true);
    try {
      const res = await fetch('/api/admin/engine/cycle', { method: 'POST' });
      if (!res.ok) throw new Error('cycle_failed');
      const json = await res.json().catch(() => ({}));
      if (json?.scheduled) {
        alert(`Ciclo programado. Se ejecutará a partir de: ${new Date(json.runAt).toLocaleString()}`);
      } else {
        alert('Ciclo completado con éxito. Nuevos cursos han sido inyectados en Supabase.');
      }
      await fetchEngineStatus();
    } catch (err) {
      alert('Error al generar el ciclo. Revisa los logs del servidor.');
    } finally {
      setEngineLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/requests?limit=5');
      if (!res.ok) throw new Error('request_failed');
      const json = await res.json();
      setRequests(Array.isArray(json.requests) ? json.requests : []);
    } catch {
      setRequests(demoFetchAiRequests(5));
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('request_failed');
      const json = await res.json();
      const rows = Array.isArray(json.users) ? json.users : [];

      const now = Date.now();
      const mapped: ManagedUser[] = rows.map((u: any) => {
        const billing = u?.billing && typeof u.billing === 'object' ? u.billing : {};
        const lastPaidAt = typeof billing.lastPaidAt === 'string' ? billing.lastPaidAt : '';
        const nextDueAt = typeof billing.nextDueAt === 'string' ? billing.nextDueAt : '';
        const nextDueMs = nextDueAt ? Date.parse(nextDueAt) : NaN;
        const daysOverdue = Number.isFinite(nextDueMs) && nextDueMs < now ? Math.ceil((now - nextDueMs) / (1000 * 60 * 60 * 24)) : 0;

        return {
          id: String(u.id),
          name: String(u.name || ''),
          email: String(u.email || ''),
          plan: (u.plan || 'FREE') as any,
          status: (u.status || 'active') as any,
          lastPayment: lastPaidAt ? new Date(lastPaidAt).toISOString().slice(0, 10) : 'N/A',
          daysOverdue,
        };
      });

      setUsers(mapped);
    } catch {
      // Demo fallback
      setUsers([
        { id: 'demo-1', name: 'Carlos Martin', email: 'carlos@chef.com', plan: 'PRO', status: 'active', lastPayment: '2026-03-01', daysOverdue: 0 },
        { id: 'demo-2', name: 'Ana Garcia', email: 'ana@cocina.es', plan: 'PREMIUM', status: 'active', lastPayment: '2026-02-28', daysOverdue: 0 },
        { id: 'demo-3', name: 'Luis Rodriguez', email: 'luis@gastro.com', plan: 'PRO', status: 'suspended', lastPayment: '2026-01-15', daysOverdue: 45 },
      ]);
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
        body: JSON.stringify({ kind, instruction, days_to_generate: days, payload: {} }),
      });
      if (!res.ok) throw new Error('request_failed');
      setInstruction('');
      await fetchRequests();
      alert('Orden guardada (admin).');
    } catch {
      const { error } = demoInsertAiRequest(instruction, days);
      if (!error) {
        setInstruction('');
        fetchRequests();
        alert('Orden guardada en modo demo local. Para usar Supabase, entra como admin y reintenta.');
      }
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Usuarios totales', val: '1,284', trend: '+12%', icon: 'USERS' },
    { label: 'Pedidos pendientes', val: '14', trend: 'Revisión', icon: 'PENDING' },
    { label: 'Ingresos mensuales', val: '4.820 €', trend: '+24%', icon: 'EUR' },
    { label: 'Tasa de conversión', val: '3,2%', trend: '-2%', icon: 'RATE' },
  ];

  return (
    <div className="admin-dashboard">
      <header className="page-header">
        <h1 className="neon-text">System Overview</h1>
        <p>Estado global del ecosistema GrandChef Lab.</p>
      </header>

      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card glass">
            <div className="stat-head">
              <span className="icon">{s.icon}</span>
              <span className={`trend ${s.trend.startsWith('+') ? 'up' : 'neutral'}`}>{s.trend}</span>
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
          <section className="gastronomic-engine mb-30 glass neon-border-primary">
            <div className="section-header">
              <h3><Zap size={20} className="mr-10 text-primary" /> Motor Gastronómico</h3>
              <span className={`engine-status ${canStart ? 'ready' : 'waiting'}`}>
                {engineLoading ? 'PROCESANDO...' : canStart ? 'LISTO PARA CICLO' : 'COOLDOWN (96H)'}
              </span>
            </div>

            <div className="engine-cycle-info">
              <div className="cycle-stat">
                <label>Último Ciclo</label>
                <p>{statusData?.latestCycle ? new Date(statusData.latestCycle.created_at).toLocaleString() : 'NUNCA'}</p>
              </div>
              <div className="cycle-stat">
                <label>Próximo Ciclo (Planificado)</label>
                <p>{statusData?.nextCycleDue ? new Date(statusData.nextCycleDue).toLocaleString() : 'Pte. inicio'}</p>
              </div>
              <div className="cycle-stat">
                <label>Job en cola</label>
                <p>
                  {statusData?.queuedJob
                    ? `${String(statusData.queuedJob.status || 'queued').toUpperCase()} · ${new Date(statusData.queuedJob.run_at).toLocaleString()}`
                    : 'Ninguno'}
                </p>
              </div>
            </div>

            <button 
              className={`engine-trigger-btn ${canStart ? 'active' : 'disabled'}`}
              onClick={handleTriggerCycle}
              disabled={engineLoading}
            >
              {engineLoading ? (
                <RefreshCw className="animate-spin mr-10" />
              ) : (
                <Sparkles size={18} className="mr-10" />
              )}
              {engineLoading
                ? 'GENERANDO CICLO...'
                : canStart
                  ? 'INICIAR NUEVO CICLO GASTRONÓMICO'
                  : 'PROGRAMAR NUEVO CICLO (96H)'}
            </button>
            <p className="engine-note">
              Cada ciclo genera 2 Free, 4 Pro y 8 Premium siguiendo el manual editorial. 
              {!canStart && statusData?.nextCycleDue && (
                <span className="text-warning"> Bloqueado hasta completar las 96 horas reglamentarias.</span>
              )}
            </p>
          </section>

          <section className="ai-control-center glass neon-border mb-30">
            <div className="section-header">
              <h3><Sparkles size={20} className="mr-10" /> Control Omniscience</h3>
              <span className="ai-badge">ONLINE</span>
            </div>
            
            <form onSubmit={handleSendOrder} className="ai-form">
              <div className="input-group">
                <label>Dar una orden al motor (Instrucciones de contenido)</label>
                <input 
                  type="text" 
                  placeholder="Ej: Haz que los próximos cursos sean sobre cocina al vacío y nitrógeno líquido..." 
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Tipo de pedido</label>
                <select value={kind} onChange={(e) => setKind(e.target.value as any)}>
                  <option value="courses">Cursos</option>
                  <option value="ingredients">Ingredientes</option>
                  <option value="techniques">Técnicas</option>
                  <option value="recipes">Recetas</option>
                </select>
              </div>
              <div className="form-footer">
                <div className="days-picker">
                  <label>Días a generar:</label>
                  <select value={days} onChange={(e) => setDays(parseInt(e.target.value))}>
                    <option value={1}>1 día</option>
                    <option value={7}>7 días (1 semana)</option>
                    <option value={14}>14 días (2 semanas)</option>
                    <option value={31}>31 días (mensual)</option>
                  </select>
                </div>
                <button type="submit" className="send-btn" disabled={loading}>
                  {loading ? <RefreshCw className="animate-spin" /> : <><Send size={16} /> ENVIAR ORDEN</>}
                </button>
              </div>
            </form>

            <div className="recent-orders">
              <h4>Últimas órdenes</h4>
              {requests.map(r => (
                <div key={r.id} className="order-item">
                  <span className={`status-dot ${r.status}`}></span>
                  <p>{r.instruction}</p>
                  <small>{new Date(r.created_at).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          </section>

          <section className="recent-activity glass">
            <h3>Actividad Reciente</h3>
            <div className="activity-list">
              <div className="activity-item">
                <span className="dot success"></span>
                <p>Nuevo pago validado: <strong>GCL-XJ82K1</strong> (Escoffier)</p>
                <small>Hace 2 horas</small>
              </div>
              <div className="activity-item">
                <span className="dot warning"></span>
                <p>Nuevo pedido pendiente: <strong>GCL-MZP93L</strong> (Ferran)</p>
                <small>Hace 4 horas</small>
              </div>
              <div className="activity-item">
                <span className="dot info"></span>
                <p>Ajuste de configuración: <strong>Cambio de IBAN</strong> por Admin</p>
                <small>Hace 1 día</small>
              </div>
            </div>
          </section>
        </div>

        {/* === USER MANAGEMENT PANEL === */}
        <section className="user-management glass neon-border" style={{ marginTop: '30px' }}>
          <div className="section-header">
            <h3><Users size={20} className="mr-10" /> Gestión de usuarios</h3>
            <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{users.length} usuarios registrados</span>
          </div>

          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            className="user-search-input"
          />

          <div className="users-table">
            <div className="users-table-header">
              <span>USUARIO</span>
              <span>PLAN</span>
              <span>ESTADO</span>
              <span>ÚLTIMO PAGO</span>
              <span>MOROSIDAD</span>
              <span>ACCIONES</span>
            </div>
            {filteredUsers.map(u => (
              <div key={u.id} className={`user-row ${u.status === 'blocked' ? 'row-blocked' : u.daysOverdue > 30 ? 'row-overdue' : ''}`}>
                <div className="user-info">
                  <strong>{u.name}</strong>
                  <small>{u.email}</small>
                </div>
                <span className={`plan-badge plan-${u.plan.toLowerCase()}`}>{u.plan}</span>
                <span className={`status-badge status-${u.status}`}>
                  {u.status === 'active' ? 'Activo' : u.status === 'blocked' ? 'Bloqueado' : 'Suspendido'}
                </span>
                <span className="payment-date">{u.lastPayment}</span>
                <span className={`overdue ${u.daysOverdue > 0 ? 'has-overdue' : ''}`}>
                  {u.daysOverdue > 0 ? `${u.daysOverdue} días` : '-'}
                </span>
                <div className="action-btns">
                  {u.status !== 'blocked' ? (
                    <button className="action-btn block-btn" onClick={() => handleUserAction(u.id, 'block')} title="Bloquear usuario">
                      <ShieldOff size={14} /> Bloquear
                    </button>
                  ) : (
                    <button className="action-btn unblock-btn" onClick={() => handleUserAction(u.id, 'unblock')} title="Desbloquear usuario">
                      <Shield size={14} /> Activar
                    </button>
                  )}
                  <button className="action-btn delete-btn" onClick={() => handleUserAction(u.id, 'delete')} title="Eliminar usuario">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="system-health glass">
          <h3>Estado del Sistema</h3>
          <div className="health-grid">
            <div className="health-item">
              <label>API Latency</label>
              <div className="progress-bar"><div className="fill" style={{ width: '94%' }}></div></div>
              <span>94ms</span>
            </div>
            <div className="health-item">
              <label>Library Nodes</label>
              <div className="progress-bar"><div className="fill" style={{ width: '99%' }}></div></div>
              <span>99.9%</span>
            </div>
            <div className="health-item">
              <label>Processor</label>
              <div className="progress-bar"><div className="fill" style={{ width: '82%' }}></div></div>
              <span>82% Ops</span>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .page-header { margin-bottom: 50px; }
        .page-header h1 { font-size: 3rem; margin-bottom: 10px; }
        .page-header p { opacity: 0.5; font-size: 1.1rem; }

        .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
          gap: 25px; 
          margin-bottom: 50px; 
        }

        .stat-card { padding: 30px; border-radius: 25px; border: 1px solid var(--border); }
        .stat-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .stat-head .icon { font-size: 1.5rem; background: rgba(255,255,255,0.05); width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
        .trend { font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: 10px; }
        .trend.up { background: rgba(0,255,136,0.1); color: #00ff88; }
        .trend.neutral { background: rgba(255,255,255,0.1); color: white; opacity: 0.5; }

        .val { font-size: 2.2rem; font-weight: 900; margin-bottom: 5px; color: var(--primary); }
        .lbl { font-size: 0.8rem; opacity: 0.4; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }

        .mb-30 { margin-bottom: 30px; }
        .ai-control-center { background: rgba(var(--primary-rgb), 0.03); border: 1px solid rgba(var(--primary-rgb), 0.2); }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .ai-badge { background: var(--primary); color: white; font-size: 0.6rem; padding: 2px 8px; border-radius: 4px; font-weight: 800; letter-spacing: 1px; }
        
        .ai-form { display: flex; flex-direction: column; gap: 20px; border-bottom: 1px solid var(--border); padding-bottom: 25px; margin-bottom: 25px; }
        .ai-form label { font-size: 0.8rem; opacity: 0.6; margin-bottom: 8px; display: block; }
        .ai-form input { width: 100%; padding: 15px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 12px; color: white; }
        .form-footer { display: flex; justify-content: space-between; align-items: center; }
        .days-picker { display: flex; align-items: center; gap: 10px; }
        .days-picker select { background: #111; color: white; border: 1px solid var(--border); padding: 8px; border-radius: 8px; }
        
        .send-btn { 
          background: var(--primary); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 800; 
          cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.3s;
        }
        .send-btn:hover { background: var(--accent); transform: scale(1.05); }

        .recent-orders h4 { font-size: 0.9rem; opacity: 0.5; margin-bottom: 15px; }
        .order-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; }
        .status-dot.pending { background: #ffbb00; box-shadow: 0 0 8px #ffbb00; }
        .status-dot.processing { background: #0088ff; box-shadow: 0 0 8px #0088ff; }
        .status-dot.completed { background: #00ff88; box-shadow: 0 0 8px #00ff88; }
        .order-item p { font-size: 0.85rem; margin: 0; flex: 1; opacity: 0.8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .order-item small { font-size: 0.7rem; opacity: 0.3; }

        .dashboard-sections { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
        section { padding: 40px; border-radius: 30px; border: 1px solid var(--border); }
        section h3 { margin-bottom: 30px; opacity: 0.8; font-size: 1.2rem; display: flex; align-items: center; }

        .activity-list { display: flex; flex-direction: column; gap: 20px; }
        .activity-item { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 20px; border-bottom: 1px solid var(--border); padding-bottom: 15px; }
        .activity-item:last-child { border: none; }
        .dot { width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 10px currentColor; }
        .dot.success { color: #00ff88; background: #00ff88; }
        .dot.warning { color: #ffbb00; background: #ffbb00; }
        .dot.info { color: var(--primary); background: var(--primary); }
        .activity-item p { font-size: 0.95rem; margin: 0; opacity: 0.8; }
        .activity-item small { opacity: 0.4; font-size: 0.75rem; }

        .health-grid { display: flex; flex-direction: column; gap: 25px; }
        .health-item label { display: block; font-size: 0.75rem; opacity: 0.5; margin-bottom: 10px; }
        .progress-bar { height: 6px; background: rgba(255,255,255,0.05); border-radius: 30px; margin-bottom: 5px; overflow: hidden; }
        .fill { height: 100%; background: var(--primary); box-shadow: 0 0 10px var(--primary-glow); }
        .health-item span { font-size: 0.8rem; font-weight: 800; }

        @media (max-width: 900px) {
          .dashboard-sections { grid-template-columns: 1fr; }
        }

        /* USER MANAGEMENT */
        .user-management { padding: 40px; border-radius: 30px; }
        .user-search-input {
          width: 100%; padding: 12px 18px; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: white;
          font-size: 0.9rem; margin-bottom: 25px; outline: none; transition: 0.3s;
        }
        .user-search-input:focus { border-color: var(--primary); box-shadow: 0 0 15px var(--primary-glow); }
        .users-table { display: flex; flex-direction: column; gap: 0; }
        .users-table-header {
          display: grid; grid-template-columns: 2fr 0.7fr 1fr 1fr 1fr 1.2fr;
          padding: 10px 20px; font-size: 0.65rem; font-weight: 900; 
          opacity: 0.4; text-transform: uppercase; letter-spacing: 2px;
        }
        .user-row {
          display: grid; grid-template-columns: 2fr 0.7fr 1fr 1fr 1fr 1.2fr;
          align-items: center; padding: 15px 20px;
          border-top: 1px solid rgba(255,255,255,0.05); transition: 0.3s;
        }
        .user-row:hover { background: rgba(255,255,255,0.03); }
        .row-blocked { background: rgba(255,0,85,0.05) !important; }
        .row-overdue { background: rgba(255,187,0,0.04) !important; }
        .user-info { display: flex; flex-direction: column; gap: 3px; }
        .user-info strong { font-size: 0.9rem; }
        .user-info small { font-size: 0.7rem; opacity: 0.4; }
        .plan-badge { font-size: 0.65rem; font-weight: 900; padding: 3px 10px; border-radius: 5px; text-align: center; width: fit-content; }
        .plan-free { background: rgba(0,255,136,0.1); color: #00ff88; }
        .plan-pro { background: rgba(0,242,255,0.1); color: #00f2ff; }
        .plan-premium { background: rgba(255,215,0,0.1); color: #FFD700; }
        .status-badge { font-size: 0.72rem; font-weight: 700; }
        .payment-date { font-size: 0.78rem; opacity: 0.5; }
        .overdue { font-size: 0.78rem; }
        .has-overdue { color: #ff4444; font-weight: 900; }
        .action-btns { display: flex; gap: 8px; align-items: center; }
        .action-btn {
          display: flex; align-items: center; gap: 5px; font-size: 0.7rem; font-weight: 800;
          padding: 5px 10px; border-radius: 7px; border: none; cursor: pointer; transition: 0.3s;
        }
        .block-btn { background: rgba(255,0,85,0.1); color: #ff0055; }
        .block-btn:hover { background: rgba(255,0,85,0.2); }
        .unblock-btn { background: rgba(0,255,136,0.1); color: #00ff88; }
        .unblock-btn:hover { background: rgba(0,255,136,0.2); }
        .delete-btn { background: rgba(255,255,255,0.05); color: white; opacity: 0.5; padding: 5px 8px; }
        .delete-btn:hover { opacity: 1; background: rgba(255,0,0,0.2); color: #ff4444; }

        /* GASTRONOMIC ENGINE */
        .neon-border-primary { border: 1px solid rgba(var(--primary-rgb), 0.3); box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.05); }
        .engine-status { font-size: 0.7rem; font-weight: 900; letter-spacing: 1px; padding: 5px 12px; border-radius: 6px; }
        .engine-status.ready { background: rgba(0,255,136,0.1); color: #00ff88; border: 1px solid rgba(0,255,136,0.2); }
        .engine-status.waiting { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.3); }
        
        .engine-cycle-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; background: rgba(255,255,255,0.03); padding: 20px; border-radius: 15px; }
        .cycle-stat label { display: block; font-size: 0.65rem; opacity: 0.4; text-transform: uppercase; margin-bottom: 5px; font-weight: 800; }
        .cycle-stat p { font-size: 0.9rem; font-weight: 700; color: white; margin: 0; }
        
        .engine-trigger-btn {
          width: 100%; padding: 18px; border-radius: 15px; border: none; font-weight: 900; font-size: 0.95rem;
          display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          letter-spacing: 0.5px;
        }
        .engine-trigger-btn.active { background: var(--primary); color: white; box-shadow: 0 10px 30px var(--primary-glow); }
        .engine-trigger-btn.active:hover { transform: translateY(-3px); background: white; color: black; box-shadow: 0 15px 40px rgba(255,255,255,0.2); }
        .engine-trigger-btn.disabled { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.1); cursor: not-allowed; }
        
        .engine-note { font-size: 0.75rem; opacity: 0.4; margin-top: 15px; text-align: center; font-style: italic; }
        .text-warning { color: #ffbb00; opacity: 1; }
      `}</style>
    </div>
  );
}

