'use client';

import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import { Sparkles, Send, RefreshCw, Zap, Users, Shield, ShieldOff, Trash2 } from 'lucide-react';

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
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<ManagedUser[]>([
    { id: 'u1', name: 'Carlos Martín', email: 'carlos@chef.com', plan: 'PRO', status: 'active', lastPayment: '2026-03-01', daysOverdue: 0 },
    { id: 'u2', name: 'Ana García', email: 'ana@cocina.es', plan: 'PREMIUM', status: 'active', lastPayment: '2026-02-28', daysOverdue: 0 },
    { id: 'u3', name: 'Luis Rodríguez', email: 'luis@gastro.com', plan: 'PRO', status: 'suspended', lastPayment: '2026-01-15', daysOverdue: 45 },
    { id: 'u4', name: 'Marta López', email: 'marta@chef.io', plan: 'PREMIUM', status: 'blocked', lastPayment: '2025-12-20', daysOverdue: 85 },
    { id: 'u5', name: 'Pedro Sánchez', email: 'pedro@rest.com', plan: 'FREE', status: 'active', lastPayment: 'N/A', daysOverdue: 0 },
  ]);
  const [userSearch, setUserSearch] = useState('');

  const handleUserAction = (userId: string, action: 'block' | 'unblock' | 'delete') => {
    if (action === 'delete') {
      if (!confirm('¿Eliminar este usuario permanentemente?')) return;
      setUsers(prev => prev.filter(u => u.id !== userId));
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: action === 'block' ? 'blocked' : 'active' } : u));
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setRequests([]);
      return;
    }
    const { data } = await supabase.from('ai_requests').select('*').order('created_at', { ascending: false }).limit(5);
    if (data) setRequests(data);
  };

  const handleSendOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction) return;
    setLoading(true);
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      alert('Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.');
      return;
    }
    const { error } = await supabase.from('ai_requests').insert({ instruction, days_to_generate: days });
    if (!error) {
      setInstruction('');
      fetchRequests();
      alert('Orden enviada a la IA con éxito. El script la procesará en su próxima ejecución.');
    }
    setLoading(false);
  };

  const stats = [
    { label: 'Usuarios Totales', val: '1,284', trend: '+12%', icon: '👥' },
    { label: 'Pedidos Pendientes', val: '14', trend: 'Revisión', icon: '⏳' },
    { label: 'Ingresos Mensuales', val: '4,820€', trend: '+24%', icon: '💰' },
    { label: 'Tasa de Conversión', val: '3.2%', trend: '-2%', icon: '🎯' },
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
          <section className="ai-control-center glass neon-border mb-30">
            <div className="section-header">
              <h3><Sparkles size={20} className="mr-10" /> Control de IA Omniscience</h3>
              <span className="ai-badge">ONLINE</span>
            </div>
            
            <form onSubmit={handleSendOrder} className="ai-form">
              <div className="input-group">
                <label>Dar una orden a la IA (Instrucciones de contenido)</label>
                <input 
                  type="text" 
                  placeholder="Ej: Haz que los próximos cursos sean sobre cocina al vacío y nitrógeno líquido..." 
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                />
              </div>
              <div className="form-footer">
                <div className="days-picker">
                  <label>Días a generar:</label>
                  <select value={days} onChange={(e) => setDays(parseInt(e.target.value))}>
                    <option value={1}>1 Día</option>
                    <option value={7}>7 Días (1 Semana)</option>
                    <option value={14}>14 Días (2 Semanas)</option>
                    <option value={31}>31 Días (Mensual)</option>
                  </select>
                </div>
                <button type="submit" className="send-btn" disabled={loading}>
                  {loading ? <RefreshCw className="animate-spin" /> : <><Send size={16} /> ENVIAR ORDEN</>}
                </button>
              </div>
            </form>

            <div className="recent-orders">
              <h4>Últimas Órdenes</h4>
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
            <h3><Users size={20} className="mr-10" /> Gestión de Usuarios</h3>
            <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{users.length} usuarios registrados</span>
          </div>

          <input
            type="text"
            placeholder="🔍 Buscar por nombre o email..."
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
                  {u.status === 'active' ? '✅ Activo' : u.status === 'blocked' ? '🚫 Bloqueado' : '⚠️ Suspendido'}
                </span>
                <span className="payment-date">{u.lastPayment}</span>
                <span className={`overdue ${u.daysOverdue > 0 ? 'has-overdue' : ''}`}>
                  {u.daysOverdue > 0 ? `${u.daysOverdue} días` : '—'}
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
              <label>AI Processor</label>
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
      `}</style>
    </div>
  );
}
