'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin, login } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);
    if (!success) {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  if (!isAdmin) {
    return (
      <div className="admin-login-overlay">
        <div className="login-card glass">
          <div className="lock-header">
            <span className="icon">ADMIN</span>
            <h2>ACCESO DE ADMINISTRADOR</h2>
            <p>Identificación necesaria para acceder al panel.</p>
            <p className="hint">Usa las credenciales configuradas en <code>.env.local</code> (ADMIN_USER / ADMIN_PASS).</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>USUARIO</label>
              <input 
                type="text" 
                placeholder="Identificador..." 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={error ? 'error' : ''}
                autoFocus
                autoComplete="username"
              />
            </div>

            <div className="input-group">
              <label>CONTRASEÑA</label>
              <input 
                type="password" 
                placeholder="Clave de acceso..." 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error ? 'error' : ''}
                autoComplete="current-password"
              />
            </div>
            
            <button type="submit" className="login-btn">
              {loading ? 'VALIDANDO...' : 'VALIDAR CREDENCIALES'}
            </button>
          </form>

          {error && <p className="error-text">Acceso denegado. Credenciales no válidas.</p>}
        </div>

        <style jsx>{`
          .admin-login-overlay {
            position: fixed;
            inset: 0;
            background: var(--overlay-backdrop);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }

          .login-card {
            width: 100%;
            max-width: 420px;
            padding: 50px;
            border-radius: 30px;
            border: 1px solid var(--modal-border);
            text-align: center;
            background: var(--modal-surface);
            color: var(--modal-text);
          }

          .lock-header .icon { font-size: 2.5rem; display: block; margin-bottom: 15px; }
          h2 { font-size: 1.2rem; letter-spacing: 4px; color: var(--primary); margin-bottom: 5px; }
          p { opacity: 0.8; color: var(--modal-muted); font-size: 0.8rem; margin-bottom: 40px; }
          .hint { opacity: 0.55; font-size: 0.75rem; margin: -25px 0 35px; line-height: 1.4; }
          .hint code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; font-size: 0.75rem; opacity: 0.9; }

          .input-group { text-align: left; margin-bottom: 25px; }
          .input-group label { display: block; font-size: 0.65rem; font-weight: 900; opacity: 0.4; margin-bottom: 8px; letter-spacing: 1px; }

          input {
            width: 100%;
            padding: 15px 20px;
            background: var(--modal-surface-2);
            border: 1px solid var(--modal-border);
            border-radius: 12px;
            color: var(--modal-text);
            font-size: 1rem;
            outline: none;
            transition: all 0.3s ease;
          }

          input:focus { border-color: var(--primary); background: rgba(255,255,255,0.05); }
          input.error { border-color: #ff0055; animation: shake 0.4s ease; }

          .login-btn {
            width: 100%;
            padding: 18px;
            border-radius: 50px;
            background: var(--primary);
            border: none;
            color: white;
            font-weight: 800;
            cursor: pointer;
            margin-top: 10px;
            letter-spacing: 1px;
            transition: 0.3s;
          }

          .login-btn:hover { box-shadow: var(--neon-shadow); transform: translateY(-2px); }

          .error-text { color: #ff0055; font-size: 0.75rem; margin-top: 20px; font-weight: 800; }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}

