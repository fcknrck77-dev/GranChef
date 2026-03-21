'use client';

import Link from 'next/link';
import { useState } from 'react';
import { appHref } from '@/lib/appHref';

export default function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    { 
      name: 'FREE', 
      priceMonthly: 0,
      priceAnnual: 0,
      originalAnnual: 0,
      discount: 0,
      features: ['5 Ingredientes desbloqueados', '2 Técnicas básicas', 'Acceso al laboratorio (limitado)', 'Modo lectura'], 
      btn: 'Empezar ya',
      href: appHref('/laboratory')
    },
    { 
      name: 'PRO', 
      priceMonthly: 39,
      priceAnnual: 398, // ~39 * 12 * 0.85
      originalAnnual: 468,
      discount: 15,
      features: ['200 Ingredientes maestros', '100 técnicas de vanguardia', '200 Recetas perfectas', 'Exámenes de nivel (25 ítems)', 'Acceso a 40 cursos'], 
      btn: 'Subir a PRO', 
      featured: true,
      href: appHref(`/checkout?tier=PRO&billing=${billing}`)
    },
    { 
      name: 'PREMIUM', 
      priceMonthly: 69,
      priceAnnual: 662, 
      originalAnnual: 828,
      discount: 20,
      features: ['Todo ilimitado', 'Exámenes magistrales (50 ítems)', '60 Cursos avanzados', 'Sinergias moleculares', 'Red Profesional (Candidato)'], 
      btn: 'Ser Premium', 
      href: appHref(`/checkout?tier=PREMIUM&billing=${billing}`)
    },
    { 
      name: 'ENTERPRISE', 
      priceMonthly: 149,
      priceAnnual: 1341, // 149 * 12 * 0.75
      originalAnnual: 1788,
      discount: 25,
      features: ['Perfiles de Empresa verificados', 'Publicación de Ofertas', 'Acceso a Talent Pool (CVs)', 'Mensajería privada cifrada', 'Soporte prioritario'], 
      btn: 'Plan Empresa', 
      href: appHref(`/checkout?tier=ENTERPRISE&billing=${billing}`)
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

              <Link href={plan.href} className="plan-btn-link">
                <button className={`plan-btn ${plan.featured ? 'primary-btn' : 'secondary-btn'}`}>
                  {plan.btn}
                </button>
              </Link>
            </div>
          );
        })}
      </div>

      <footer className="pricing-footer">
        <p>Pagos seguros con tarjeta (3D Secure) procesados por Stripe.</p>
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
        }

        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; }
        .pricing-card { padding: 40px; border-radius: 28px; border: 1px solid var(--border); position: relative; overflow: hidden; transition: 0.3s; }
        .pricing-card:hover { transform: translateY(-8px); border-color: var(--primary); box-shadow: var(--neon-shadow); }
        .pricing-card.featured { border-color: var(--primary); box-shadow: var(--neon-shadow); }
        .featured-tag { position: absolute; top: 20px; right: 20px; background: var(--primary); color: black; padding: 6px 10px; border-radius: 10px; font-weight: 900; font-size: 0.7rem; }
        .pricing-card h3 { font-size: 1.5rem; letter-spacing: 2px; margin-bottom: 20px; }

        .price-display { margin-bottom: 20px; }
        .amount { font-size: 3rem; font-weight: 900; }
        .period { opacity: 0.5; font-size: 1rem; margin-left: 6px; }
        .annual-pricing-info { display: flex; flex-direction: column; gap: 6px; }
        .original-price { text-decoration: line-through; opacity: 0.4; }
        .highlight { color: var(--primary); }
        .discount-callout { font-weight: 800; color: var(--primary); }
        .price-sub { opacity: 0.6; font-size: 0.9rem; }

        .feature-list { list-style: none; padding: 0; margin: 0 0 25px 0; display: flex; flex-direction: column; gap: 10px; }
        .feature-list li { display: flex; align-items: center; gap: 10px; font-size: 0.95rem; opacity: 0.85; }
        .check { color: var(--primary); font-weight: 900; }

        .plan-btn-link { text-decoration: none; }
        .plan-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; cursor: pointer; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; }
        .primary-btn { background: var(--primary); color: black; box-shadow: var(--neon-shadow); }
        .secondary-btn { background: rgba(255,255,255,0.05); color: white; border: 1px solid var(--border); }

        .pricing-footer { text-align: center; margin-top: 60px; opacity: 0.6; font-size: 0.95rem; }

        /* Switch */
        .switch { position: relative; display: inline-block; width: 52px; height: 28px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255,255,255,0.1); transition: 0.4s; border-radius: 34px; }
        .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: 0.4s; border-radius: 50%; }
        input:checked + .slider { background-color: var(--primary); }
        input:checked + .slider:before { transform: translateX(24px); }
        .slider.round { border-radius: 34px; }
        .slider.round:before { border-radius: 50%; }
      `}</style>
    </div>
  );
}
