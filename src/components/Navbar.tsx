'use client';

import Link from 'next/link';
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

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        <div className="logo">
          <BrandLogo href="/" />
        </div>
        
        <ul className="nav-links" style={{ display: 'flex', gap: '30px', alignItems: 'center', fontWeight: '500' }}>
          <li><Link href="/">Home</Link></li>
          <li><Link href={appHref('/laboratory')}>Laboratory</Link></li>
          <li><Link href={appHref('/encyclopedia')}>Encyclopedia</Link></li>
          <li><Link href={appHref('/recipes')}>Recipes</Link></li>
          <li><Link href={appHref('/courses')}>Courses</Link></li>
          {isAdmin && <li><Link href={appHref('/admin')} className="admin-quick-link">⚡ ADMIN</Link></li>}
          <li><Link href="/pricing" style={{ color: 'var(--accent)' }}>Pro</Link></li>
          <li>
            {!authState.isRegistered ? (
              IS_LANDING ? (
                <Link href={appHref('/login')} className="login-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  LOGIN / REGISTRO
                </Link>
              ) : (
                <button onClick={openAuthModal} className="login-btn">
                  LOGIN / REGISTRO
                </button>
              )
            ) : (
              <Link href={appHref(isAdmin ? "/admin" : "/profile")} className="chef-link">
                <span className="user-badge">{userLevel}</span> {isAdmin ? 'ADMIN MI CUENTA' : (authState.profile?.firstName || 'MI CUENTA')}
              </Link>
            )}
          </li>
          <li><ThemeToggle /></li>
        </ul>
      </div>
      <style jsx>{`
        .admin-quick-link { color: #00ff88 !important; font-weight: 900; }
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
      `}</style>
    </nav>
  );
}
