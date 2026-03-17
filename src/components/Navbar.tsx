'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useUserAuth } from '@/context/UserAuthContext';
import BrandLogo from './BrandLogo';
import { appHref } from '@/lib/appHref';
import { IS_LANDING } from '@/lib/deployTarget';

export default function Navbar() {
  const { isAdmin } = useAdminAuth();
  const { authState, openAuthModal, getEffectiveLevel } = useUserAuth();
  const userLevel = getEffectiveLevel();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        <div className="logo">
          <BrandLogo href="/" />
        </div>

        <button
          className="nav-toggle"
          type="button"
          aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          {menuOpen ? 'Cerrar' : 'Menu'}
        </button>
        
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><Link href="/" onClick={closeMenu}>Home</Link></li>
          <li><Link href={appHref('/laboratory')} onClick={closeMenu}>Laboratory</Link></li>
          <li><Link href={appHref('/encyclopedia')} onClick={closeMenu}>Encyclopedia</Link></li>
          <li><Link href={appHref('/recipes')} onClick={closeMenu}>Recipes</Link></li>
          <li><Link href={appHref('/courses')} onClick={closeMenu}>Courses</Link></li>
          {isAdmin && <li><Link href={appHref('/admin')} className="admin-quick-link" onClick={closeMenu}>⚡ ADMIN</Link></li>}
          <li><Link href="/pricing" style={{ color: 'var(--accent)' }} onClick={closeMenu}>Pro</Link></li>
          <li>
            {!authState.isRegistered ? (
              IS_LANDING ? (
                <Link href={appHref('/login')} className="login-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} onClick={closeMenu}>
                  LOGIN / REGISTRO
                </Link>
              ) : (
                <button onClick={openAuthModal} className="login-btn">
                  LOGIN / REGISTRO
                </button>
              )
            ) : (
              <Link href={appHref(isAdmin ? "/admin" : "/profile")} className="chef-link" onClick={closeMenu}>
                <span className="user-badge">{userLevel}</span> {isAdmin ? 'ADMIN MI CUENTA' : (authState.profile?.firstName || 'MI CUENTA')}
              </Link>
            )}
          </li>
          <li><ThemeToggle /></li>
        </ul>
      </div>
      <style jsx>{`
        .admin-quick-link { color: #00ff88 !important; font-weight: 900; }
        .nav-toggle {
          display: none;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--foreground);
          padding: 8px 12px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
        }
        .login-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
          font-size: 0.9rem;
        }
        .login-btn:hover { background: var(--accent); transform: translateY(-2px); }
        .user-badge {
          background: rgba(255,255,255,0.1);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          margin-right: 5px;
          color: var(--primary);
          border: 1px solid var(--primary);
        }

        :global(.nav-links) {
          display: flex;
          gap: 30px;
          align-items: center;
          font-weight: 500;
        }

        @media (max-width: 900px) {
          .nav-toggle { display: inline-flex; }
          :global(.nav-links) {
            display: none;
            position: absolute;
            top: 70px;
            right: 16px;
            left: 16px;
            flex-direction: column;
            align-items: stretch;
            gap: 14px;
            padding: 16px;
            border-radius: 18px;
            background: var(--modal-surface);
            border: 1px solid var(--modal-border);
            z-index: 1100;
          }
          :global(.nav-links.open) { display: flex; }
          :global(.nav-links li) { width: 100%; }
          :global(.nav-links a) { display: block; padding: 10px 12px; border-radius: 12px; }
          :global(.nav-links a:hover) { background: var(--modal-surface-2); }
        }
      `}</style>
    </nav>
  );
}
