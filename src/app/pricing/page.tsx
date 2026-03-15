'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    { 
      name: 'FREE', 
      priceMonthly: 0,
      priceAnnual: 0,
      originalAnnual: 0,
      discount: 0,
      features: ['5 Ingredientes Desbloqueados', '2 Técnicas Básicas', 'Acceso al Laboratorio (Limitado)', 'Modo Lectura'], 
      btn: 'Empezar ya',
      href: '/laboratory'
    },
    { 
      name: 'PRO', 
      priceMonthly: 19,
      priceAnnual: 193,
      originalAnnual: 228,
      discount: 15,
      features: ['Más de 500 Ingredientes Maestros', '10 Técnicas de Vanguardia', 'Recetario Completo', 'Análisis Molecular', 'Soporte prioritario'], 
      btn: 'Subir a PRO', 
      featured: true,
      href: `/checkout?tier=PRO&billing=${billing}`
    },
    { 
      name: 'PREMIUM', 
      priceMonthly: 49,
      priceAnnual: 470,
      originalAnnual: 588,
      discount: 20,
      features: ['Todo Ilimitado', 'Todas las Técnicas del Mundo', 'Bridges con IA Culinaria', 'Nuevos Ingredientes Mensuales', 'Acceso a Masterclasses', 'Exportación a PDF e Impresión'], 
      btn: 'Ser Premium', 
      href: `/checkout?tier=PREMIUM&billing=${billing}`
    },
  ];

  return (
    <div className="pricing-page container">
      <header className="pricing-header">
        <h1 className="neon-text">Niveles de Maestría</h1>
        <p className="subtitle">Desbloquea el conocimiento arcano de la gastronomía molecular.</p>
        
        <div className="billing-toggle">
          <span className={billing === 'monthly' ? 'active' : ''}>Mensual</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={billing === 'annual'}
              onChange={() => setBilling(billing === 'monthly' ? 'annual' : 'monthly')}
            />
            <span className="slider round"></span>
          </label>
          <span className={`annual-label ${billing === 'annual' ? 'active' : ''}`}>
            Anual <span className="discount-badge">Ahorra hasta 20%</span>
          </span>
        </div>
      </header>

      <div className="pricing-grid">
        {plans.map(plan => {
          return (
            <div key={plan.name} className={`pricing-card glass ${plan.featured ? 'featured' : ''}`}>
              {plan.featured && <div className="featured-tag">RECOMENDADO</div>}
              <h3>{plan.name}</h3>
              
              <div className="price-display">
                {billing === 'annual' && plan.originalAnnual > 0 ? (
                  <div className="annual-pricing-info">
                    <div className="discount-callout">-{plan.discount}% DTO.</div>
                    <div className="original-price">{plan.originalAnnual}€</div>
                    <div className="amount highlight">{plan.priceAnnual}€<span className="period">/año</span></div>
                    <div className="price-sub">Queda en ~{Math.round(plan.priceAnnual / 12)}€ / mes</div>
                  </div>
                ) : (
                  <div>
                    <span className="amount">{plan.priceMonthly}€</span>
                    {plan.priceMonthly !== 0 && <span className="period">/mes</span>}
                  </div>
                )}
              </div>
              
              <ul className="feature-list">
                {plan.features.map(f => (
                  <li key={f}>
                    <span className="check">✦</span> {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.name === 'FREE' ? plan.href : `/checkout?tier=${plan.name}&billing=${billing}`} className="plan-btn-link">
                <button className={`plan-btn ${plan.featured ? 'primary-btn' : 'secondary-btn'}`}>
                  {plan.btn}
                </button>
              </Link>
            </div>
          );
        })}
      </div>

      <footer className="pricing-footer">
        <p>Pagos seguros garantizados mediante Bizum, Transferencia Bancaria y Tarjeta (3D Secure).</p>
      </footer>

      <style jsx>{`
        .pricing-page { padding: 100px 20px; min-height: 100vh; }
        .pricing-header { text-align: center; margin-bottom: 80px; }
        .pricing-header h1 { font-size: 4rem; margin-bottom: 20px; }
        .subtitle { font-size: 1.2rem; opacity: 0.6; margin-bottom: 40px; }

        .billing-toggle {
          display: inline-flex;
          align-items: center;
          gap: 15px;
          background: rgba(255,255,255,0.03);
          padding: 10px 25px;
          border-radius: 50px;
          border: 1px solid var(--border);
          font-weight: 700;
          font-size: 0.95rem;
        }
        .billing-toggle span { opacity: 0.5; transition: 0.3s; color: var(--foreground); }
        .billing-toggle span.active { opacity: 1; font-weight: 900; color: var(--primary); }
        .annual-label { position: relative; }
        
        .discount-badge {
          position: absolute;
          top: -25px;
          right: -20px;
          background: var(--primary);
          color: black;
          font-size: 0.65rem;
          padding: 3px 8px;
          border-radius: 10px;
          font-weight: 900;
          white-space: nowrap;
          box-shadow: var(--neon-shadow);
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 26px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(128,128,128,0.3);
          transition: .4s;
          border-radius: 34px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider { background-color: var(--primary); }
        input:checked + .slider:before { transform: translateX(24px); background-color: black; }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .pricing-card {
          padding: 60px 40px;
          border-radius: 40px;
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .pricing-card:hover {
          transform: translateY(-15px);
          border-color: var(--primary);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .featured {
          border-color: var(--primary);
          background: rgba(var(--primary-rgb), 0.03);
          transform: scale(1.05);
        }

        .featured-tag {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary);
          color: white;
          padding: 6px 20px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 2px;
          box-shadow: var(--neon-shadow);
        }

        h3 { font-size: 1.8rem; margin-bottom: 10px; opacity: 0.8; letter-spacing: 3px; }
        
        .price-display { margin-bottom: 30px; min-height: 120px; display: flex; flex-direction: column; justify-content: flex-end; }
        .amount { font-size: 4rem; font-weight: 900; color: var(--primary); line-height: 1; }
        .period { opacity: 0.4; font-size: 1rem; margin-left: 10px; }
        
        .annual-pricing-info { display: flex; flex-direction: column; gap: 5px; }
        .discount-callout { color: var(--primary); font-weight: 900; font-size: 1.2rem; margin-bottom: 5px; }
        .original-price { text-decoration: line-through; opacity: 0.4; font-size: 1.5rem; font-weight: bold; }
        .price-sub { font-size: 1rem; opacity: 0.8; font-weight: 600; margin-top: 5px; }

        .feature-list { list-style: none; margin-bottom: 50px; flex-grow: 1; }
        .feature-list li { margin-bottom: 15px; font-size: 1.05rem; opacity: 0.7; display: flex; align-items: center; gap: 15px; }
        .check { color: var(--primary); font-size: 1.2rem; }

        .plan-btn-link { text-decoration: none; }
        .plan-btn {
          width: 100%;
          padding: 20px;
          border-radius: 50px;
          font-weight: 800;
          cursor: pointer;
          transition: var(--transition);
          font-size: 1rem;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .primary-btn { background: var(--primary); border: none; color: white; box-shadow: var(--neon-shadow); }
        .secondary-btn { background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: white; }

        .plan-btn:hover { transform: scale(1.02); opacity: 0.9; }

        .pricing-footer { margin-top: 80px; text-align: center; opacity: 0.4; font-size: 0.9rem; }

        @media (max-width: 768px) {
          .pricing-header h1 { font-size: 2.5rem; }
          .featured { transform: scale(1); }
          .pricing-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
