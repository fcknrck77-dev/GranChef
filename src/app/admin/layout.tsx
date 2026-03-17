'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import BrandLogo from '@/components/BrandLogo';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAdminAuth();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: "DASH" },
    { label: "Usuarios", href: "/admin/users", icon: "USERS" },
    { label: "Sorteos", href: "/admin/giveaways", icon: "GIFT" },
    { label: "Pedidos y clientes", href: "/admin/orders", icon: "ORD" },
    { label: "Configuracion de pagos", href: "/admin/settings", icon: "PAY" },
    { label: "Volver a la web", href: "/", icon: "WEB" },
  ];

  return (
    <AdminGuard>
      <div className="admin-layout">
        <aside className="admin-sidebar glass">
          <div className="admin-logo">
            <BrandLogo href="/" />
            <small className="admin-kicker">Panel de Administracion</small>
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
              <span className="avatar">ADM</span>
              <div className="user-details">
                <p className="name">Super Admin</p>
                <p className="role">Acceso propietario</p>
                <button 
                  onClick={() => {
                    if(confirm('Deseas cerrar la sesión administrativa?')) {
                      logout();
                      window.location.href = '/';
                    }
                  }} 
                  className="logout-small"
                >
                  Cerrar sesión
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

          .admin-kicker { display: block; margin-top: 8px; opacity: 0.6; font-weight: 800; letter-spacing: 1px; }

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


