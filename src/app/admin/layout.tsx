'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Pedidos y Clientes', href: '/admin/orders', icon: '👥' },
    { label: 'Configuración de Pagos', href: '/admin/settings', icon: '💳' },
    { label: 'Volver a la Web', href: '/', icon: '🌐' },
  ];

  return (
    <AdminGuard>
      <div className="admin-layout">
        <aside className="admin-sidebar glass">
          <div className="admin-logo">
            <span className="neon-text">ADMIN</span>
            <small>GrandChef Lab</small>
          </div>
          
          <nav className="admin-nav">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="admin-footer">
            <div className="user-info">
              <span className="avatar">👨‍💻</span>
              <div className="user-details">
                <p className="name">Super Admin</p>
                <p className="role">Acceso Jesús</p>
                <button 
                  onClick={() => {
                    if(confirm('¿Deseas cerrar la sesión administrativa?')) {
                      window.localStorage.removeItem('gc_admin_session');
                      window.location.href = '/';
                    }
                  }} 
                  className="logout-small"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="admin-content">
          {children}
        </main>

        <style jsx>{`
          .admin-layout {
            display: flex;
            min-height: 100vh;
            background: #050505;
            color: white;
          }

          .admin-sidebar {
            width: 300px;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            display: flex;
            flex-direction: column;
            padding: 40px 20px;
            border-right: 1px solid var(--border);
            z-index: 100;
            background: #080808;
          }

          .admin-logo {
            margin-bottom: 60px;
            padding: 0 20px;
          }

          .admin-logo span {
            display: block;
            font-size: 1.5rem;
            font-weight: 900;
            letter-spacing: 5px;
            color: var(--primary);
          }

          .admin-nav {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .admin-nav-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 18px 25px;
            border-radius: 15px;
            text-decoration: none;
            color: white;
            opacity: 0.6;
            transition: var(--transition);
            background: rgba(255,255,255,0.02);
            border: 1px solid transparent;
          }

          .admin-nav-item:hover, .admin-nav-item.active {
            opacity: 1;
            background: rgba(var(--primary-rgb), 0.1);
            color: var(--primary);
            border-color: rgba(var(--primary-rgb), 0.2);
            transform: translateX(5px);
          }

          .admin-content {
            margin-left: 300px;
            flex-grow: 1;
            padding: 60px;
            background: #030303;
          }

          .admin-footer {
            padding-top: 20px;
            border-top: 1px solid var(--border);
          }

          .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
            background: rgba(255,255,255,0.03);
            padding: 15px;
            border-radius: 20px;
          }

          .avatar {
            font-size: 1.5rem;
            background: var(--primary);
            width: 45px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            box-shadow: var(--neon-shadow);
          }

          .user-details { display: flex; flex-direction: column; }
          .name { font-weight: 800; font-size: 0.9rem; margin: 0; }
          .role { font-size: 0.7rem; opacity: 0.5; margin: 0; }
          .logout-small { 
            background: none; 
            border: none; 
            color: var(--primary); 
            font-size: 0.65rem; 
            padding: 0; 
            text-align: left; 
            cursor: pointer; 
            text-decoration: underline; 
            margin-top: 5px;
            font-weight: 800;
          }
        `}</style>
      </div>
    </AdminGuard>
  );
}
