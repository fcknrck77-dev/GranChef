'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useUserAuth } from '@/context/UserAuthContext';
import { appHref } from '@/lib/appHref';
import { IS_LANDING } from '@/lib/deployTarget';

export default function LoginPage() {
  const { authState, openAuthModal } = useUserAuth();

  useEffect(() => {
    if (IS_LANDING) {
      window.location.href = appHref('/login');
      return;
    }
    if (!authState.isRegistered) openAuthModal();
  }, [authState.isRegistered, openAuthModal]);

  return (
    <div className="container" style={{ padding: '120px 20px' }}>
      <div className="glass" style={{ borderRadius: 24, border: '1px solid var(--border)', padding: 28 }}>
        <h1 className="neon-text" style={{ margin: 0 }}>Login / Registro</h1>
        <p style={{ opacity: 0.75, marginTop: 10 }}>
          Crea tu cuenta (FREE incluido) para acceder al contenido y personalizar tu experiencia.
        </p>

        {authState.isRegistered ? (
          <p style={{ marginTop: 16 }}>
            Ya tienes sesion iniciada. Ir a <Link href={appHref('/profile')} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>mi perfil</Link>.
          </p>
        ) : (
          <button
            className="btn"
            onClick={openAuthModal}
            style={{ marginTop: 18, padding: '14px 18px', borderRadius: 14, border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 900, cursor: 'pointer' }}
          >
            Abrir formulario
          </button>
        )}
      </div>
    </div>
  );
}
