'use client';

import React, { useState } from 'react';
import { useUserAuth } from '@/context/UserAuthContext';
import { X, User, Mail, MapPin, Briefcase, Key, ShieldCheck, LogIn, Eye, EyeOff } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, registerUser, registerCompany, login, authState } = useUserAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [accountType, setAccountType] = useState<'individual' | 'company'>('individual');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    province: '',
    city: '',
    email: '',
    password: '',
    professionalSector: '',
    vipCode: '',
    // Company fields
    businessName: '',
    vatNumber: '',
    sector: '',
    address: '',
  });

  if (!isAuthModalOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (accountType === 'company') {
          if (!formData.businessName || !formData.vatNumber || !formData.email) {
            setError('Por favor, rellena los datos de empresa obligatorios.');
            return;
          }
          await registerCompany(
            {
              businessName: formData.businessName,
              vatNumber: formData.vatNumber,
              sector: formData.sector,
              address: formData.address,
              city: formData.city,
            },
            formData.email
          );
        } else {
          if (!formData.firstName || !formData.lastName || !formData.province || !formData.city || !formData.email) {
            setError('Por favor, rellena todos los campos obligatorios (*).');
            return;
          }
          await registerUser(
            {
              firstName: formData.firstName,
              lastName: formData.lastName,
              province: formData.province,
              city: formData.city,
              email: formData.email,
              professionalSector: formData.professionalSector,
            },
            formData.vipCode
          );
        }
      } else {
        const success = await login(formData.email, formData.password);
        if (success) {
          closeAuthModal();
        } else {
          setError('Acceso denegado. Comprueba tus datos.');
        }
      }
    } catch (err: any) {
      console.error('[AuthModal] Submission error:', err);
      setError('Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && closeAuthModal()}>
      <div className="auth-card glass neon-border">
        <button className="close-btn" onClick={closeAuthModal}><X size={20} /></button>
        
        <div className="auth-tabs">
          <button className={`tab-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>LOGIN</button>
          <button className={`tab-btn ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>REGISTRO</button>
        </div>

        <div className="auth-header">
          <h2>{mode === 'login' ? 'Hola, Chef!' : 'Únete a GrandChef'}</h2>
          <p>{mode === 'login' ? 'Accede a tu biblioteca personalizada' : 'Crea tu perfil profesional culinario'}</p>
        </div>

        {mode === 'register' && (
          <div className="account-type-selector">
            <button 
              type="button" 
              className={accountType === 'individual' ? 'active' : ''} 
              onClick={() => setAccountType('individual')}
            >
              CHEF INDIVIDUAL
            </button>
            <button 
              type="button" 
              className={accountType === 'company' ? 'active' : ''} 
              onClick={() => setAccountType('company')}
            >
              EMPRESA / GRUPO
            </button>
          </div>
        )}

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && accountType === 'individual' && (
             <div className="input-row">
               <div className="input-icon-group">
                 <User size={18} />
                 <input type="text" name="firstName" placeholder="Nombre *" value={formData.firstName} onChange={handleChange} />
               </div>
               <div className="input-icon-group">
                 <input type="text" name="lastName" placeholder="Apellidos *" value={formData.lastName} onChange={handleChange} />
               </div>
             </div>
          )}

          {mode === 'register' && accountType === 'company' && (
            <>
              <div className="input-icon-group">
                <Briefcase size={18} />
                <input type="text" name="businessName" placeholder="Razón Social / Nombre Comercial *" value={formData.businessName} onChange={handleChange} />
              </div>
              <div className="input-icon-group">
                <ShieldCheck size={18} />
                <input type="text" name="vatNumber" placeholder="CIF / VAT Number *" value={formData.vatNumber} onChange={handleChange} />
              </div>
            </>
          )}

          <div className="input-icon-group">
            <Mail size={18} />
            <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} />
          </div>

          <div className="input-icon-group">
            <Key size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              placeholder="Contraseña *" 
              value={formData.password} 
              onChange={handleChange} 
            />
            <button 
              type="button" 
              className="eye-btn" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {mode === 'register' && (
            <>
              <div className="input-row">
                <div className="input-icon-group">
                  <MapPin size={18} />
                  <input type="text" name="province" placeholder="Provincia *" value={formData.province} onChange={handleChange} />
                </div>
                <div className="input-icon-group">
                  <input type="text" name="city" placeholder="Ciudad *" value={formData.city} onChange={handleChange} />
                </div>
              </div>
              {accountType === 'individual' && (
                <div className="input-icon-group">
                  <Briefcase size={18} />
                  <input type="text" name="professionalSector" placeholder="Sector Profesional" value={formData.professionalSector} onChange={handleChange} />
                </div>
              )}
              {accountType === 'company' && (
                <div className="input-icon-group">
                  <MapPin size={18} />
                  <input type="text" name="address" placeholder="Dirección Fiscal" value={formData.address} onChange={handleChange} />
                </div>
              )}
              <div className="input-icon-group vip-group">
                <ShieldCheck size={18} />
                <input type="text" name="vipCode" placeholder="CÓDIGO VIP (OPCIONAL)" value={formData.vipCode} onChange={handleChange} className="vip-input" />
              </div>
            </>
          )}

          <button type="submit" className="submit-btn neon-glow" disabled={loading}>
            {loading ? 'PROCESANDO...' : (mode === 'login' ? 'ENTRAR' : 'CREAR CUENTA')}
          </button>
        </form>

        <p className="switch-text">
          {mode === 'login' ? '¿Aún no tienes cuenta?' : '¿Ya eres miembro?'} 
          <span onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? ' Regístrate' : ' Inicia Sesión'}
          </span>
        </p>
      </div>

      <style jsx>{`
        .auth-overlay {
          position: fixed;
          inset: 0;
          background: var(--overlay-backdrop);
          backdrop-filter: blur(15px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .auth-card {
          width: 100%;
          max-width: 480px;
          background: var(--modal-surface);
          color: var(--modal-text);
          padding: 40px;
          border-radius: 25px;
          position: relative;
          animation: modalSlide 0.4s ease-out;
        }
        @keyframes modalSlide {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: var(--modal-text);
          opacity: 0.5;
          cursor: pointer;
        }
        .close-btn:hover { opacity: 1; }

        .account-type-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
          background: var(--modal-surface-2);
          padding: 4px;
          border-radius: 12px;
          border: 1px solid var(--modal-border);
        }
        .account-type-selector button {
          flex: 1;
          padding: 8px;
          border: none;
          background: none;
          color: var(--modal-text);
          font-size: 0.65rem;
          font-weight: 800;
          cursor: pointer;
          border-radius: 8px;
          transition: 0.3s;
          opacity: 0.4;
        }
        .account-type-selector button.active {
          background: var(--primary);
          color: black;
          opacity: 1;
          box-shadow: 0 4px 15px var(--primary-glow);
        }

        .auth-header { text-align: center; margin-bottom: 20px; }
        .auth-header h2 { font-size: 2rem; color: var(--primary); margin-bottom: 8px; letter-spacing: -1px; }
        .auth-header p { font-size: 0.9rem; opacity: 0.8; color: var(--modal-muted); }

        .error-msg { background: rgba(255,0,0,0.1); border: 1px solid #ff4444; color: #ff4444; padding: 12px; border-radius: 8px; font-size: 0.8rem; margin-bottom: 20px; text-align: center; }

        .auth-form { display: flex; flex-direction: column; gap: 15px; }
        .input-row { display: flex; gap: 15px; }
        .input-icon-group {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }
        .input-icon-group :global(svg) {
          position: absolute;
          left: 15px;
          opacity: 0.3;
          color: var(--primary);
        }
        input {
          width: 100%;
          padding: 14px 14px 14px 45px;
          background: var(--modal-surface-2);
          border: 1px solid var(--modal-border);
          border-radius: 12px;
          color: var(--modal-text);
          font-family: inherit;
          outline: none;
          transition: 0.3s;
        }
        input:focus {
          background: var(--modal-surface-2);
          border-color: var(--primary);
          box-shadow: 0 0 15px var(--primary-glow);
        }
        .eye-btn {
          position: absolute;
          right: 15px;
          background: none;
          border: none;
          color: var(--primary);
          opacity: 0.5;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
          transition: 0.3s;
        }
        .eye-btn:hover { opacity: 1; transform: scale(1.1); }
        .vip-group :global(svg) { color: var(--accent); }
        .vip-input {
          border-color: rgba(var(--accent-rgb), 0.3);
          text-align: center;
          padding-left: 15px !important;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .submit-btn {
          margin-top: 15px;
          padding: 16px;
          border: none;
          border-radius: 12px;
          background: var(--primary);
          color: white;
          font-weight: 900;
          letter-spacing: 2px;
          cursor: pointer;
          transition: 0.3s;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          background: var(--accent);
        }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .switch-text {
          text-align: center;
          margin-top: 25px;
          font-size: 0.85rem;
          opacity: 0.6;
        }
        .switch-text span {
          color: var(--primary);
          cursor: pointer;
          font-weight: 700;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
