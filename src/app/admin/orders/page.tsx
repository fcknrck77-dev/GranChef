'use client';

import { useState } from 'react';
import { MOCK_ORDERS, Order } from '@/data/adminSettings';
import { CheckCircle2, Clock, CreditCard } from 'lucide-react';

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filter === 'ALL' ? true : o.status === filter;
    const matchesSearch =
      o.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleStatus = (id: string) => {
    setOrders(
      orders.map((o) => {
        if (o.id === id) {
          const newStatus = o.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
          return { ...o, status: newStatus };
        }
        return o;
      })
    );
  };

  return (
    <div className="order-manager">
      <header className="page-header">
        <h1 className="neon-text">Gestión de Cobros</h1>
        <p>Verifica los pagos con tarjeta (Stripe) y activa las cuentas PRO/PREMIUM.</p>
      </header>

      <div className="table-controls glass">
        <div className="filter-group">
          <button className={filter === 'ALL' ? 'active' : ''} onClick={() => setFilter('ALL')}>
            Todos
          </button>
          <button className={filter === 'PENDING' ? 'active' : ''} onClick={() => setFilter('PENDING')}>
            Pendientes
          </button>
          <button className={filter === 'COMPLETED' ? 'active' : ''} onClick={() => setFilter('COMPLETED')}>
            Completados
          </button>
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por REF, Email o Nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>REFERENCIA</th>
              <th>CLIENTE</th>
              <th>PLAN · MÉTODO</th>
              <th>FECHA</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className={order.status.toLowerCase()}>
                  <td className="ref">{order.reference}</td>
                  <td>
                    <div className="client-info">
                      <p className="name">{order.customerName}</p>
                      <p className="email">{order.customerEmail}</p>
                      <div className="origin-data">
                        <span className="source-tag card">
                          <CreditCard size={14} aria-hidden="true" /> Stripe · {order.last4 ? `•••• ${order.last4}` : 'Card'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="order-meta">
                      <span className={`plan-tag ${order.plan.toLowerCase()}`}>{order.plan}</span>
                      <span className="method-label">Tarjeta</span>
                    </div>
                  </td>
                  <td className="date">{order.date}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status === 'PENDING' ? (
                        <>
                          <Clock size={14} aria-hidden="true" /> PENDIENTE
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={14} aria-hidden="true" /> OK
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`action-btn ${order.status === 'PENDING' ? 'validate' : 'revert'}`}
                      onClick={() => toggleStatus(order.id)}
                    >
                      {order.status === 'PENDING' ? 'Validar pago' : 'Reactivar pendiente'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '50px', opacity: 0.5 }}>
                  No hay pedidos que coincidan con los criterios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .page-header { margin-bottom: 50px; }
        .page-header h1 { font-size: 3rem; margin-bottom: 10px; }
        .page-header p { opacity: 0.8; font-size: 1.1rem; }
        .page-header strong { color: var(--primary); }

        .table-controls { padding: 25px; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border: 1px solid var(--border); }
        .filter-group { display: flex; gap: 10px; }
        .filter-group button { background: none; border: 1px solid var(--border); color: white; padding: 10px 20px; border-radius: 12px; cursor: pointer; transition: var(--transition); font-size: 0.8rem; font-weight: 700; }
        .filter-group button.active { background: var(--primary); border-color: var(--primary); box-shadow: var(--neon-shadow); }

        .search-box input { background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: white; padding: 12px 25px; border-radius: 30px; outline: none; width: 350px; transition: var(--transition); }
        .search-box input:focus { border-color: var(--primary); box-shadow: 0 0 15px var(--primary-glow); }

        .table-wrapper { border-radius: 30px; border: 1px solid var(--border); overflow: hidden; background: rgba(255,255,255,0.01); }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
        .admin-table th { padding: 25px; font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; opacity: 0.4; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.02); }
        .admin-table td { padding: 25px; border-bottom: 1px solid var(--border); font-size: 0.95rem; vertical-align: middle; }
        
        .ref { font-family: monospace; font-weight: 900; color: var(--primary); font-size: 1.1rem; }
        .client-info .name { font-weight: 900; margin-bottom: 4px; font-size: 1.1rem; }
        .client-info .email { font-size: 0.8rem; opacity: 0.5; margin-bottom: 10px; }
        
        .origin-data { margin-top: 8px; }
        .source-tag { font-size: 0.75rem; padding: 4px 10px; border-radius: 6px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; }
        .source-tag.card { background: rgba(0, 242, 255, 0.05); color: #00f2ff; border: 1px solid rgba(0, 242, 255, 0.2); }

        .order-meta { display: flex; flex-direction: column; gap: 8px; }
        .plan-tag { display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 0.7rem; font-weight: 900; width: fit-content; }
        .plan-tag.pro { background: rgba(0,242,255,0.1); color: #00f2ff; }
        .plan-tag.premium { background: rgba(255,0,85,0.1); color: #ff0055; }
        .method-label { font-size: 0.75rem; opacity: 0.5; font-weight: 800; }

        .status-badge { padding: 8px 16px; border-radius: 25px; font-size: 0.75rem; font-weight: 900; letter-spacing: 1px; display: inline-flex; align-items: center; gap: 8px; }
        .status-badge.pending { background: rgba(255,187,0,0.1); color: #ffbb00; border: 1px solid rgba(255,187,0,0.2); }
        .status-badge.completed { background: rgba(0,255,136,1); color: black; box-shadow: 0 0 20px rgba(0,255,136,0.3); }

        .action-btn { padding: 12px 20px; border-radius: 12px; cursor: pointer; font-size: 0.85rem; transition: var(--transition); font-weight: 800; border: none; width: 100%; text-transform: uppercase; }
        .action-btn.validate { background: var(--primary); color: white; box-shadow: var(--neon-shadow); }
        .action-btn.revert { background: rgba(255,255,255,0.05); color: white; border: 1px solid var(--border); opacity: 0.5; }
        .action-btn:hover { transform: scale(1.02); opacity: 0.9; }

        .date { opacity: 0.4; font-size: 0.85rem; }

        tr.completed td { opacity: 0.7; }
        tr.completed .ref { color: #00ff88; }

        @media (max-width: 1100px) {
          .table-controls { flex-direction: column; gap: 20px; align-items: stretch; }
          .search-box input { width: 100%; }
        }
      `}</style>
    </div>
  );
}
