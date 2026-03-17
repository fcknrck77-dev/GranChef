'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ACCESS_CONFIGS, AccessLevel } from '@/data/access';
import { CreditCard, ShieldCheck, ArrowLeft } from 'lucide-react';
import { IS_STATIC_EXPORT } from '@/lib/deployTarget';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tier = (searchParams.get('tier') as AccessLevel) || 'PRO';
  const billing = searchParams.get('billing') || 'monthly';
  
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const plan = ACCESS_CONFIGS[tier];
  let finalPrice = plan.price;
  if (billing === 'annual') {
    if (tier === 'PRO') finalPrice = '193€';
    if (tier === 'PREMIUM') finalPrice = '470€';
  }

  const handlePayment = () => {
    if (IS_STATIC_EXPORT) {
      alert('Pagos deshabilitados en la versión estática (FTP). Para Stripe necesitas un despliegue con backend.');
      return;
    }
    if (!userData.email) {
      alert('Introduce un email para el recibo.');
      return;
    }
    setIsProcessing(true);
    fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tier,
        billing,
        email: userData.email,
        name: userData.name,
        successUrl: `${window.location.origin}/checkout?status=success`,
        cancelUrl: `${window.location.origin}/checkout?status=cancel`
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.url) {
          window.location.href = data.url;
        } else {
          setIsProcessing(false);
          alert('No se pudo iniciar el pago con Stripe.');
        }
      })
      .catch(() => {
        setIsProcessing(false);
        alert('Error al conectar con Stripe.');
      });
  };

  return (
    <div className="checkout-page container">
      <div className="checkout-wrapper glass neon-border animate-fadeIn">
        <div className="checkout-header">
          <h1 className="neon-text">Pago seguro</h1>
          <p>Nivel <strong>{tier}</strong> ({billing === 'annual' ? 'Facturación anual' : 'Facturación mensual'})</p>
          <div className="plan-price">{finalPrice}</div>
        </div>

        {step === 1 && (
          <div className="checkout-step animate-slideUp">
            <h3>Tarjeta bancaria</h3>
            <div className="method-card active">
              <div className="method-icon" aria-hidden="true"><CreditCard size={28} /></div>
              <h4 style={{ fontWeight: 900 }}>Tarjeta de crédito/débito</h4>
              <p>Pagos con 3D Secure gestionados por Stripe Checkout.</p>
              <div className="secure-badges"><ShieldCheck size={14} /> PSD2 · cifrado punto a punto</div>
            </div>
            <button className="next-btn" onClick={() => setStep(2)}>
              Continuar a datos de pago
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="checkout-step animate-slideUp">
            <button className="back-link" onClick={() => setStep(1)}><ArrowLeft size={14} /> Cambiar método</button>
            <h3>Datos de facturación</h3>
            
            <div className="form-group">
              <label>Nombre completo (opcional)</label>
              <input 
                type="text" 
                placeholder="Ej: JESUS FERNANDEZ" 
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email para el recibo</label>
              <input
                type="email"
                placeholder="cliente@correo.com"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </div>

            <div className="payment-note">
              <p>El extracto bancario mostrará: <strong>APPGRANDCHEF</strong></p>
              <p className="secure-msg"><ShieldCheck size={14} /> Transacción cifrada punto a punto (Stripe).</p>
            </div>

            <div className="actions-row">
              <button className="back-btn" onClick={() => router.push('/pricing')}>Volver a precios</button>
              <button 
                className="pay-btn" 
                onClick={handlePayment}
                disabled={isProcessing || !userData.email}
              >
                {isProcessing ? 'Redirigiendo...' : 'Pagar con Stripe'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .checkout-page { padding: 120px 20px; min-height: 100vh; display: flex; justify-content: center; align-items: flex-start; }
        .checkout-wrapper { width: 100%; max-width: 800px; padding: 50px; border-radius: 30px; border: 1px solid var(--modal-border); background: var(--modal-surface); color: var(--modal-text); }
        .checkout-header { text-align: center; margin-bottom: 40px; }
        .checkout-header h1 { font-size: 3rem; margin-bottom: 10px; }
        .checkout-header p { opacity: 0.6; }
        .plan-price { font-size: 3rem; font-weight: 900; color: var(--primary); margin-top: 10px; }

        .checkout-step { margin-top: 20px; }
        .method-card { padding: 25px; border-radius: 20px; border: 1px solid var(--modal-border); display: flex; flex-direction: column; gap: 10px; background: var(--modal-surface-2); color: var(--modal-text); }
        .method-card.active { border-color: var(--primary); box-shadow: var(--neon-shadow); }
        .method-icon { width: 56px; height: 56px; border-radius: 14px; display: grid; place-items: center; background: rgba(255,255,255,0.05); }
        .secure-badges { display: inline-flex; gap: 8px; align-items: center; font-weight: 800; color: var(--primary); }
        .next-btn { margin-top: 20px; width: 100%; padding: 18px; border-radius: 16px; border: none; background: var(--primary); color: black; font-weight: 900; cursor: pointer; box-shadow: var(--neon-shadow); }

        .form-group { margin-bottom: 18px; display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.9rem; opacity: 0.6; }
        .form-group input { padding: 14px; border-radius: 12px; border: 1px solid var(--modal-border); background: var(--modal-surface-2); color: var(--modal-text); }

        .payment-note { margin-top: 20px; padding: 15px; border-radius: 12px; border: 1px dashed var(--modal-border); background: var(--modal-surface-2); }
        .payment-note p { margin: 6px 0; }
        .payment-note strong { color: var(--primary); }
        .secure-msg { color: var(--primary); font-weight: 700; display: flex; gap: 8px; align-items: center; }

        .actions-row { display: flex; justify-content: space-between; gap: 12px; margin-top: 30px; }
        .back-btn, .pay-btn { flex: 1; padding: 16px; border-radius: 14px; font-weight: 900; cursor: pointer; border: 1px solid var(--modal-border); }
        .back-btn { background: var(--modal-surface-2); color: var(--modal-text); }
        .pay-btn { background: var(--primary); color: black; border-color: var(--primary); box-shadow: var(--neon-shadow); }
        .pay-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 600px) {
          .actions-row { flex-direction: column; }
          .checkout-wrapper { padding: 30px; }
        }
      `}</style>
    </div>
  );
}
