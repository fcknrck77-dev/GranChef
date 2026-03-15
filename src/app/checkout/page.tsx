'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ACCESS_CONFIGS, AccessLevel } from '@/data/access';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tier = (searchParams.get('tier') as AccessLevel) || 'PRO';
  const billing = searchParams.get('billing') || 'monthly';
  
  const [method, setMethod] = useState<'bizum' | 'transfer' | 'card' | null>(null);
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({ 
    name: '', 
    phone: '', 
    iban: '', 
    cardNumber: '', 
    expiry: '', 
    cvv: '' 
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [bankValidation, setBankValidation] = useState(false);

  // Price Calculation
  const plan = ACCESS_CONFIGS[tier];
  let finalPrice = plan.price;
  if (billing === 'annual') {
    if (tier === 'PRO') finalPrice = '193€';
    if (tier === 'PREMIUM') finalPrice = '470€';
  }

  // Format Card Number (space every 4 digits)
  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = val.replace(/(.{4})/g, '$1 ').trim();
    setUserData({ ...userData, cardNumber: formatted });
  };

  // Format Expiry (MM/YY)
  const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setUserData({ ...userData, expiry: val });
  };

  const handlePayment = () => {
    if (method === 'card') {
      setIsProcessing(true);
      // Simulate connection to payment gateway
      setTimeout(() => {
        setIsProcessing(false);
        setBankValidation(true);
        // Simulate 3D Secure verification process
        setTimeout(() => {
          setBankValidation(false);
          setStep(3);
        }, 4000);
      }, 1500);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep(3);
      }, 2500);
    }
  };

  return (
    <div className="checkout-page container">
      <div className="checkout-wrapper glass neon-border animate-fadeIn">
        <div className="checkout-header">
          <h1 className="neon-text">Pasarela de Evolución</h1>
          <p>Nivel <strong>{tier}</strong> ({billing === 'annual' ? 'Facturación Anual' : 'Facturación Mensual'})</p>
          <div className="plan-price">{finalPrice}</div>
        </div>

        {step === 1 && (
          <div className="checkout-step animate-slideUp">
            <h3>Selecciona tu método de pago</h3>
            <div className="method-grid">
              <div 
                className={`method-card ${method === 'card' ? 'active' : ''}`}
                onClick={() => setMethod('card')}
              >
                <div className="method-icon">💳</div>
                <h4 style={{ fontWeight: 900 }}>TARJETA BANCARIA</h4>
                <p>Pago seguro con tarjeta de crédito/débito</p>
                <div className="secure-badges">🔒 3D Secure</div>
              </div>
              <div 
                className={`method-card ${method === 'bizum' ? 'active' : ''}`}
                onClick={() => setMethod('bizum')}
              >
                <div className="method-icon">📱</div>
                <h4 style={{ fontWeight: 900 }}>BIZUM</h4>
                <p>Transferencia instantánea via móvil</p>
              </div>
              <div 
                className={`method-card ${method === 'transfer' ? 'active' : ''}`}
                onClick={() => setMethod('transfer')}
              >
                <div className="method-icon">🏦</div>
                <h4 style={{ fontWeight: 900 }}>TRANSFERENCIA</h4>
                <p>Ingreso bancario tradicional</p>
              </div>
            </div>
            <button 
              className="next-btn" 
              disabled={!method} 
              onClick={() => setStep(2)}
            >
              Continuar a Datos de Pago
            </button>
          </div>
        )}

        {step === 2 && !bankValidation && (
          <div className="checkout-step animate-slideUp">
            <button className="back-link" onClick={() => setStep(1)}>← Cambiar método</button>
            <h3>Detalles del Emisor</h3>
            
            <div className="form-group">
              <label>Tu Nombre Completo {method === 'card' && '(tal como aparece en la tarjeta)'}</label>
              <input 
                type="text" 
                placeholder="Ej: JESUS FERNANDEZ" 
                value={userData.name}
                onChange={e => setUserData({...userData, name: e.target.value.toUpperCase()})}
              />
            </div>

            {method === 'card' && (
              <div className="card-details-grid">
                <div className="form-group full-width">
                  <label>Número de Tarjeta</label>
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000" 
                    value={userData.cardNumber}
                    onChange={handleCardNumber}
                    maxLength={19}
                  />
                </div>
                <div className="form-group half-width">
                  <label>Vencimiento</label>
                  <input 
                    type="text" 
                    placeholder="MM/AA" 
                    value={userData.expiry}
                    onChange={handleExpiry}
                    maxLength={5}
                  />
                </div>
                <div className="form-group half-width">
                  <label>CVV / CVC</label>
                  <input 
                    type="password" 
                    placeholder="123" 
                    value={userData.cvv}
                    onChange={e => setUserData({...userData, cvv: e.target.value.replace(/\D/g, '').substring(0, 4)})}
                    maxLength={4}
                  />
                </div>
              </div>
            )}

            {method === 'bizum' && (
              <div className="form-group">
                <label>Tu Número de Teléfono (Bizum)</label>
                <input 
                  type="tel" 
                  placeholder="600 000 000" 
                  value={userData.phone}
                  onChange={e => setUserData({...userData, phone: e.target.value})}
                />
              </div>
            )}
            
            {method === 'transfer' && (
              <div className="form-group">
                <label>Tu IBAN de Origen</label>
                <input 
                  type="text" 
                  placeholder="ES00 0000 ..." 
                  value={userData.iban}
                  onChange={e => setUserData({...userData, iban: e.target.value})}
                />
              </div>
            )}

            <div className="payment-note">
              <p>Nota: El extracto bancario mostrará: <strong>APPGRANDCHEF</strong></p>
              <p className="secure-msg">🔒 Transacción cifrada punto a punto (256-bit AES).</p>
            </div>

            <button 
              className="pay-btn" 
              disabled={
                isProcessing || 
                !userData.name || 
                (method === 'bizum' && !userData.phone) || 
                (method === 'transfer' && !userData.iban) ||
                (method === 'card' && (userData.cardNumber.length < 19 || userData.expiry.length < 5 || userData.cvv.length < 3))
              }
              onClick={handlePayment}
            >
              {isProcessing ? 'Conectando con pasarela...' : `Efectuar Pago Seguro de ${finalPrice}`}
            </button>
          </div>
        )}

        {bankValidation && (
          <div className="checkout-step bank-validation animate-pop">
            <div className="bank-spinner"></div>
            <h3>Validación Bancaria</h3>
            <p>Conectando con su entidad financiera...</p>
            <div className="security-logs">
              <p>Iniciando protocolo 3D Secure...</p>
              <p>Verificando identidad del titular...</p>
              <p>Confirmando autorización de cobro de {finalPrice}...</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="checkout-step final animate-pop">
            <div className="success-icon">✨</div>
            <h2>¡EVOLUCIÓN EN CURSO!</h2>
            <p>El pago ha sido procesado exitosamente vía {method?.toUpperCase()}.</p>
            <p className="summary-text" style={{ color: 'var(--primary)' }}>
              <strong>Tu cuenta se ha desbloqueado automáticamente.</strong><br/>
              Ya eres miembro del nivel {tier}. Accede a la Omnisciencia sin límites.
            </p>
            <button className="home-btn" onClick={() => router.push('/')}>Entrar al Laboratorio</button>
          </div>
        )}
      </div>

      <style jsx>{`
        .checkout-page { padding: 120px 20px; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .checkout-wrapper { width: 100%; max-width: 600px; padding: 60px; border-radius: 40px; background: rgba(10,10,10,0.8); }
        .checkout-header { text-align: center; margin-bottom: 50px; }
        .neon-text { font-size: 2.5rem; margin-bottom: 15px; }
        .plan-price { font-size: 3rem; font-weight: 900; color: var(--primary); margin-top: 20px; }

        .method-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin: 40px 0; }
        .method-card { 
          padding: 25px; 
          border-radius: 20px; 
          border: 1px solid var(--border); 
          cursor: pointer; 
          transition: 0.3s; 
          text-align: center;
          background: rgba(255,255,255,0.02);
          position: relative;
        }
        .method-card:hover { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.05); }
        .method-card.active { border-color: var(--primary); background: var(--primary); color: black; box-shadow: var(--neon-shadow); }
        .method-card.active p, .method-card.active .secure-badges { color: black; opacity: 0.8; }
        .method-icon { font-size: 2.5rem; margin-bottom: 10px; }
        .method-card h4 { margin-bottom: 5px; letter-spacing: 1px; }
        .method-card p { fontSize: 0.8rem; opacity: 0.6; line-height: 1.4; }
        .secure-badges { position: absolute; top: 15px; right: 20px; font-size: 0.7rem; font-weight: 900; color: var(--primary); opacity: 0.8;}

        .card-details-grid { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 25px; }
        .full-width { width: 100%; margin-bottom: 0 !important; }
        .half-width { width: calc(50% - 7.5px); margin-bottom: 0 !important; }

        .form-group { margin-bottom: 25px; text-align: left; }
        .form-group label { display: block; font-size: 0.8rem; font-weight: 800; color: var(--primary); margin-bottom: 10px; letter-spacing: 1px; }
        .form-group input { width: 100%; padding: 15px; border-radius: 12px; border: 1px solid var(--border); background: rgba(255,255,255,0.05); color: white; font-size: 1rem; letter-spacing: 1px;}
        .form-group input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 10px var(--primary-glow); }

        .next-btn, .pay-btn, .home-btn { width: 100%; padding: 20px; border-radius: 15px; background: var(--primary); color: black; font-weight: 900; font-size: 1.1rem; border: none; cursor: pointer; transition: 0.3s; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px;}
        .next-btn:disabled, .pay-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .next-btn:hover:not(:disabled), .pay-btn:hover:not(:disabled) { transform: scale(1.02); box-shadow: var(--neon-shadow); }

        .back-link { background: none; border: none; color: white; opacity: 0.5; cursor: pointer; margin-bottom: 30px; font-weight: 700; }
        .back-link:hover { opacity: 1; }

        .payment-note { margin: 30px 0; padding: 20px; border-radius: 15px; background: rgba(255,255,255,0.03); text-align: center; border: 1px solid rgba(255,255,255,0.05); }
        .payment-note p { font-size: 0.9rem; opacity: 0.6; margin-bottom: 5px; }
        .secure-msg { color: #00ff88 !important; font-weight: 800; font-size: 0.85rem; opacity: 1 !important;}

        .bank-validation { text-align: center; padding: 40px 0; }
        .bank-spinner { width: 60px; height: 60px; border: 4px solid rgba(255,255,255,0.1); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 30px; }
        .security-logs { margin-top: 40px; text-align: left; background: rgba(0,0,0,0.5); padding: 20px; border-radius: 10px; font-family: monospace; font-size: 0.85rem; color: #00ff88; opacity: 0.8; height: 100px; display: flex; flex-direction: column; justify-content: flex-end;}
        .security-logs p { margin: 5px 0; animation: fadeInLog 0.5s ease-out forwards; opacity: 0; }
        .security-logs p:nth-child(1) { animation-delay: 0.5s; }
        .security-logs p:nth-child(2) { animation-delay: 1.8s; }
        .security-logs p:nth-child(3) { animation-delay: 3.1s; color: var(--primary); font-weight: bold;}

        .final { text-align: center; }
        .success-icon { font-size: 5rem; margin-bottom: 20px; }
        .summary-text { font-size: 1.1rem; line-height: 1.6; margin: 30px 0; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pop { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInLog { to { opacity: 1; } }

        @media (max-width: 600px) {
          .checkout-wrapper { padding: 30px; }
        }
      `}</style>
    </div>
  );
}
