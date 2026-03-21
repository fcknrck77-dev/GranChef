'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import BrandLogo from '@/components/BrandLogo';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { LayoutDashboard, Users, Gift, ShoppingBag, Settings, Globe, ChevronRight, ChevronLeft, Menu } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAdminAuth();
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isOpen = isPinned || isHovered;

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { label: "Usuarios", href: "/admin/users", icon: <Users size={20} /> },
    { label: "Sorteos", href: "/admin/giveaways", icon: <Gift size={20} /> },
    { label: "Pedidos", href: "/admin/orders", icon: <ShoppingBag size={20} /> },
    { label: "Configuración", href: "/admin/settings", icon: <Settings size={20} /> },
    { label: "Volver a la web", href: "/", icon: <Globe size={20} /> },
  ];

  return (
    <AdminGuard>
      <div className={`admin-layout ${isOpen ? 'sidebar-open' : 'sidebar-closed'} ${isPinned ? 'sidebar-pinned' : ''}`}>
        {/* Trigger Zone */}
        {!isOpen && (
          <div 
            className="sidebar-trigger" 
            onMouseEnter={() => setIsHovered(true)}
            onClick={() => setIsPinned(true)}
          >
            <div className="trigger-pill">
              <Menu size={14} />
            </div>
          </div>
        )}

        <aside 
          className="admin-sidebar glass"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="admin-logo">
            <BrandLogo href="/" />
            <small className="admin-kicker">Panel Administrativo</small>
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
                <button 
                  onClick={() => {
                    if(confirm('¿Deseas cerrar la sesión administrativa?')) {
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
          
          <button 
            className="toggle-sidebar-pin"
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? "Desanclar menú" : "Anclar menú"}
          >
            {isPinned ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </aside>

        <main className="admin-content">
          {children}
        </main>

        <style jsx>{`
          .admin-layout {
            display: flex;
            min-height: 100vh;
            background: #000;
            color: white;
          }

          /* Trigger Floating Button */
          .sidebar-trigger {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            width: 60px;
            z-index: 900;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding-left: 15px;
            cursor: pointer;
          }

          .trigger-pill {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            width: 35px;
            height: 35px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
          }
          .sidebar-trigger:hover .trigger-pill {
            background: var(--primary);
            color: black;
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.3);
          }

          .admin-sidebar {
            width: 300px;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            display: flex;
            flex-direction: column;
            padding: 40px 25px;
            border-right: 1px solid rgba(255,255,255,0.08);
            z-index: 1000;
            background: rgba(8, 8, 8, 0.98);
            backdrop-filter: blur(30px);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateX(-100%);
          }

          .sidebar-open .admin-sidebar {
            transform: translateX(0);
          }

          .admin-logo {
            margin-bottom: 60px;
            padding: 0 10px;
            display: flex;
            flex-direction: column;
          }

          .admin-kicker { 
            display: block; 
            margin-top: 8px; 
            opacity: 0.5; 
            font-weight: 800; 
            letter-spacing: 2px; 
            font-size: 0.6rem;
            text-transform: uppercase;
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
            padding: 14px 20px;
            border-radius: 14px;
            text-decoration: none;
            color: white;
            opacity: 0.5;
            transition: all 0.3s ease;
            background: transparent;
            border: 1px solid transparent;
          }

          .admin-nav-item:hover {
            opacity: 1;
            background: rgba(255,255,255,0.03);
          }

          .admin-nav-item.active {
            opacity: 1;
            background: var(--primary);
            color: black;
            font-weight: 700;
            box-shadow: 0 10px 20px rgba(var(--primary-rgb), 0.2);
          }

          .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 24px;
          }

          .label {
            font-size: 0.9rem;
            letter-spacing: 0.5px;
          }

          .admin-content {
            flex-grow: 1;
            padding: 60px;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            margin-left: 0;
            width: 100%;
          }

          /* If pinned, we shift the content */
          .sidebar-pinned .admin-content {
            margin-left: 300px;
            width: calc(100% - 300px);
          }

          /* If just hovered but NOT pinned, we keep content centered but overlay the sidebar */
          .admin-layout:not(.sidebar-pinned) .admin-content {
             /* Optional: blur content when overlayed */
          }

          .admin-footer {
            padding-top: 25px;
            border-top: 1px solid rgba(255,255,255,0.08);
          }

          .user-info {
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(255,255,255,0.03);
            padding: 15px;
            border-radius: 18px;
          }

          .avatar {
            font-size: 0.75rem;
            background: var(--primary);
            color: black;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            font-weight: 900;
          }

          .user-details { display: flex; flex-direction: column; }
          .name { font-weight: 800; font-size: 0.85rem; margin: 0; }
          .logout-small { 
            background: none; 
            border: none; 
            color: #ff4444; 
            font-size: 0.65rem; 
            padding: 0; 
            text-align: left; 
            cursor: pointer; 
            margin-top: 3px;
            font-weight: 700;
            opacity: 0.7;
          }
          .logout-small:hover { opacity: 1; text-decoration: underline; }

          .toggle-sidebar-pin {
            position: absolute;
            right: -12px;
            top: 50px;
            width: 24px;
            height: 24px;
            background: var(--primary);
            color: black;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          }

          @media (max-width: 1024px) {
            .sidebar-open.admin-layout .admin-content {
              margin-left: 0;
              width: 100%;
            }
          }
        `}</style>
      </div>
    </AdminGuard>
  );
}


