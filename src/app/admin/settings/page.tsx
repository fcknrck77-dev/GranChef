'use client';

import { useState } from 'react';
import { INITIAL_SETTINGS } from '@/data/adminSettings';
import { Phone, AtSign, CreditCard } from 'lucide-react';

export default function PaymentSettings() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Configuración actualizada correctamente.');
    }, 1000);
  };

  return (
    <div className="payment-settings">
      <header className="page-header">
        <h1 className="neon-text">Configuración de Pagos</h1>
        <p>Datos que verá el cliente al pagar con tarjeta y en sus recibos de Stripe.</p>
      </header>

      <div className="settings-grid">
        <div className="settings-card glass">
          <div className="card-header">
            <span className="icon" aria-hidden="true"><AtSign size={20} /></span>
            <h3>Contacto de soporte</h3>
          </div>
          <div className="form-group">
            <label>EMAIL DE SOPORTE</label>
            <input 
              type="text" 
              className="glass-input" 
              value={settings.supportEmail}
              onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
            />
            <small>Se usa en los recibos y comunicaciones automáticas.</small>
          </div>
          <div className="form-group">
            <label>TELÉFONO DE SOPORTE</label>
            <input 
              type="text" 
              className="glass-input" 
              value={settings.supportPhone}
              onChange={(e) => setSettings({...settings, supportPhone: e.target.value})}
            />
            <small>Visible para usuarios autenticados.</small>
          </div>
        </div>

        <div className="settings-card glass">
          <div className="card-header">
            <span className="icon" aria-hidden="true"><CreditCard size={20} /></span>
            <h3>Tarjeta (Stripe)</h3>
          </div>
          
          <div className="form-group">
            <label>DESCRIPTOR DE FACTURACIÓN</label>
            <input 
              type="text" 
              className="glass-input" 
              value={settings.billingDescriptor}
              onChange={(e) => setSettings({...settings, billingDescriptor: e.target.value})}
            />
            <small>Texto que aparece en el extracto: ej. APPGRANDCHEF.</small>
          </div>
        </div>
      </div>

      <div className="action-bar">
        <button className="save-btn" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <style jsx>{`
        .page-header { margin-bottom: 50px; }
        .page-header h1 { font-size: 3rem; }
        .page-header p { opacity: 0.5; }

        .settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 30px; margin-bottom: 50px; }
        .settings-card { padding: 40px; border-radius: 30px; border: 1px solid var(--border); }
        .card-header { display: flex; align-items: center; gap: 15px; margin-bottom: 30px; }
        .card-header .icon { font-size: 1.5rem; }
        .card-header h3 { font-size: 1.2rem; font-weight: 800; letter-spacing: 2px; }

        .form-group { margin-bottom: 25px; }
        .form-group label { display: block; font-size: 0.7rem; font-weight: 800; opacity: 0.5; margin-bottom: 10px; letter-spacing: 1px; }
        .glass-input { width: 100%; padding: 18px; border-radius: 15px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); color: white; outline: none; transition: var(--transition); }
        .glass-input:focus { border-color: var(--primary); box-shadow: 0 0 20px var(--primary-glow); }
        .form-group small { display: block; margin-top: 10px; opacity: 0.4; font-size: 0.8rem; }

        .action-bar { border-top: 1px solid var(--border); padding-top: 40px; }
        .save-btn { padding: 20px 60px; border-radius: 50px; background: var(--primary); border: none; color: white; font-weight: 800; cursor: pointer; text-transform: uppercase; transition: var(--transition); box-shadow: var(--neon-shadow); }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .save-btn:hover:not(:disabled) { transform: translateY(-3px); opacity: 0.9; }

        @media (max-width: 600px) {
          .settings-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
