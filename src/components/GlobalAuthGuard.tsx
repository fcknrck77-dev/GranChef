'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useUserAuth } from '@/context/UserAuthContext';
import { useAdminAuth } from '@/context/AdminAuthContext';

import AuthModal from './AuthModal';

export default function GlobalAuthGuard() {
  const pathname = usePathname();
  const { authState, daysRemaining } = useUserAuth();
  const { isAdmin } = useAdminAuth();

  const showWarning = authState.isRegistered && !isAdmin && authState.vipCode && daysRemaining !== null && daysRemaining <= 5;

  return (
    <>
      <AuthModal />
      
      {showWarning && (
        <div className="vip-warning-banner">
          ⚠️ <strong>Aviso de Suscripción:</strong> Tu pase especial VIP caducará en {daysRemaining} día{daysRemaining !== 1 ? 's' : ''}. 
          Si deseas mantener tus beneficios, actualiza tu plan. Si no, pasarás a ser usuario FREE.
          <a href="/pricing" className="upgrade-link">Ver Planes</a>
        </div>
      )}

      <style jsx>{`
        .vip-warning-banner {
          background: #ffaa00;
          color: #000;
          text-align: center;
          padding: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          position: sticky;
          top: 0;
          z-index: 9999;
          box-shadow: 0 4px 15px rgba(255, 170, 0, 0.4);
        }
        .upgrade-link {
          margin-left: 15px;
          color: #000;
          text-decoration: underline;
          font-weight: 900;
        }
        .auth-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        }
        .auth-modal {
          background: var(--card-bg);
          width: 100%;
          max-width: 500px;
          padding: 40px;
          border-radius: 20px;
          box-shadow: var(--neon-shadow);
        }
        .auth-header { text-align: center; margin-bottom: 30px; }
        .auth-header h2 { font-size: 2rem; color: var(--primary); margin-bottom: 10px; }
        .auth-header p { font-size: 0.9rem; opacity: 0.7; }
        
        .error-msg { background: rgba(255,0,0,0.1); color: #ff4444; padding: 10px; border-radius: 5px; text-align: center; margin-bottom: 20px; font-size: 0.9rem; border: 1px solid #ff4444; }
        
        .auth-form { display: flex; flex-direction: column; gap: 15px; }
        .form-row { display: flex; gap: 15px; }
        .form-row input { flex: 1; }
        
        input {
          padding: 15px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.03);
          color: var(--foreground);
          font-family: inherit;
          outline: none;
          transition: 0.3s;
        }
        input:focus { border-color: var(--primary); box-shadow: 0 0 10px var(--primary-glow); }
        .vip-input { border-color: var(--accent); background: rgba(var(--accent-rgb), 0.05); text-align: center; letter-spacing: 2px; font-weight: bold; text-transform: uppercase; }
        .vip-input::placeholder { text-transform: none; font-weight: normal; letter-spacing: normal; }

        .submit-btn {
          margin-top: 10px;
          background: var(--primary);
          color: white;
          padding: 16px;
          border-radius: 10px;
          font-weight: 900;
          font-size: 1.1rem;
          cursor: pointer;
          letter-spacing: 2px;
          border: none;
          transition: 0.3s;
        }
        .submit-btn:hover { background: var(--accent); transform: scale(1.02); }
      `}</style>
    </>
  );
}
