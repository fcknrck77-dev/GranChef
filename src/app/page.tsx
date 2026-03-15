'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="home-page">
      <header className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="badge-premium">PLATAFORMA V.2.0</div>
            <h1 className="neon-text">Precision <span className="highlight">Gastronomy</span></h1>
            <p>La herramienta definitiva de análisis molecular y experimentación para los arquitectos del sabor contemporáneo.</p>
            <div className="hero-actions">
              <Link href="/laboratory" className="btn btn-primary">Entrar al Laboratorio</Link>
              <Link href="/encyclopedia" className="btn btn-secondary">Explorar Enciclopedia</Link>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="dna-spiral"></div>
        </div>
      </header>

      <section className="features">
        <div className="container">
          <div className="section-title">
            <h2>Nuestra Matriz Genética</h2>
            <p>Descifra los compuestos que hacen que un plato sea inolvidable.</p>
          </div>
          <div className="grid">
            <div className="card feature-card glass">
              <div className="card-icon">🧪</div>
              <h3>Laboratorio Molecular</h3>
              <p>Simula reacciones aromáticas basadas en perfiles químicos reales extraídos de la ciencia del foodpairing.</p>
              <Link href="/laboratory" className="learn-more">Iniciar Simulación →</Link>
            </div>
            
            <div className="card feature-card glass">
              <div className="card-icon">📖</div>
              <h3>Enciclopedia de Sabores</h3>
              <p>Acceso a la base de datos más profunda de maridajes y notas de cata literarias de Niki Segnit.</p>
              <Link href="/encyclopedia" className="learn-more">Consultar Archivo →</Link>
            </div>

            <div className="card feature-card glass">
              <div className="card-icon">🏫</div>
              <h3>Master Classes</h3>
              <p>Técnicas de vanguardia explicadas por simulaciones de los chefs más disruptivos del mundo.</p>
              <Link href="/courses" className="learn-more">Ver Cursos →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="tiers-preview">
        <div className="container">
          <div className="section-title">
            <h2>Evoluciona tu Carrera</h2>
            <p>Desde entusiasta hasta Master Chef de Vanguardia.</p>
          </div>
          <div className="tiers-grid">
            <div className="tier-card glass">
              <h3>FREE</h3>
              <p className="price">0€</p>
              <Link href="/pricing" className="btn-link">Explorar →</Link>
            </div>
            <div className="tier-card glass featured">
              <h3>PRO</h3>
              <p className="price">19€</p>
              <Link href="/pricing" className="btn-link">Desbloquear →</Link>
            </div>
            <div className="tier-card glass">
              <h3>PREMIUM</h3>
              <p className="price">49€</p>
              <Link href="/pricing" className="btn-link">Dominar →</Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-page { padding-bottom: 100px; }
        .hero { padding: 150px 0 100px; text-align: center; position: relative; overflow: hidden; background: radial-gradient(circle at 50% 0%, var(--primary-glow) 0%, transparent 70%); }
        .badge-premium { display: inline-block; background: rgba(var(--primary), 0.1); color: var(--primary); padding: 6px 15px; border-radius: 30px; font-size: 0.75rem; font-weight: 800; letter-spacing: 2px; border: 1px solid var(--primary); margin-bottom: 30px; box-shadow: 0 0 15px var(--primary-glow); }
        .hero h1 { font-size: 5.5rem; font-weight: 900; margin-bottom: 25px; line-height: 0.95; letter-spacing: -3px; }
        .highlight { color: var(--primary); text-shadow: 0 0 20px var(--primary-glow); }
        .hero p { font-size: 1.4rem; color: var(--foreground); opacity: 0.7; max-width: 650px; margin: 0 auto 50px; line-height: 1.5; }
        .hero-actions { display: flex; gap: 20px; justify-content: center; }
        
        .btn { padding: 18px 45px; border-radius: 40px; font-weight: 700; transition: var(--transition); display: inline-block; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; }
        .btn-primary { background: var(--primary); color: white; box-shadow: 0 5px 25px var(--primary-glow); }
        .btn-primary:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 10px 40px var(--primary-glow); }
        .btn-secondary { border: 1px solid var(--border); color: var(--foreground); background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); }
        .btn-secondary:hover { border-color: var(--primary); background: rgba(var(--primary), 0.05); transform: translateY(-3px); }
        
        .features { padding: 120px 0; }
        .section-title { text-align: center; margin-bottom: 80px; }
        .section-title h2 { font-size: 3rem; margin-bottom: 15px; }
        .section-title p { opacity: 0.5; font-size: 1.1rem; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 30px; }
        .card { padding: 50px; border-radius: 40px; transition: var(--transition); border: 1px solid var(--border); text-align: left; }
        .card:hover { border-color: var(--primary); transform: translateY(-10px); box-shadow: var(--neon-shadow); }
        .card-icon { font-size: 3rem; margin-bottom: 25px; background: rgba(var(--primary), 0.1); width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; border-radius: 20px; }
        .card h3 { font-size: 1.6rem; margin-bottom: 15px; }
        .card p { opacity: 0.6; margin-bottom: 30px; line-height: 1.7; font-size: 1.05rem; }
        .learn-more { color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

        .tiers-preview { padding: 100px 0; background: rgba(255,255,255,0.01); }
        .tiers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; max-width: 1000px; margin: 0 auto; }
        .tier-card { padding: 50px 30px; border-radius: 30px; text-align: center; border: 1px solid var(--border); transition: var(--transition); }
        .tier-card h3 { font-size: 1.2rem; letter-spacing: 3px; margin-bottom: 15px; opacity: 0.6; }
        .tier-card .price { font-size: 3rem; font-weight: 900; color: var(--primary); margin-bottom: 30px; }
        .tier-card.featured { border-color: var(--primary); box-shadow: var(--neon-shadow); }
        .btn-link { color: var(--primary); font-weight: 800; text-decoration: none; display: block; padding-top: 20px; border-top: 1px solid var(--border); }

        @media (max-width: 768px) {
          .hero h1 { font-size: 3.5rem; }
          .hero-actions { flex-direction: column; }
          .hero { padding-top: 100px; }
        }
      `}</style>
    </div>
  );
}
