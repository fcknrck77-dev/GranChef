'use client';

export default function Profile() {
  const stats = [
    { label: 'Experimentos', value: '42' },
    { label: 'Sinergias Descubiertas', value: '128' },
    { label: 'Cursos Completados', value: '3' },
    { label: 'Nivel', value: 'Sous Chef' },
  ];

  const recentExperiments = [
    { id: 1, title: 'Fusión Café y Cardamomo', date: 'Hace 2 horas', status: 'Éxito' },
    { id: 2, title: 'Deconstrucción de Remolacha', date: 'Ayer', status: 'En Proceso' },
    { id: 3, title: 'Esferificación de Caldo', date: 'Hace 3 días', status: 'Guardado' },
  ];

  return (
    <div className="profile-page container">
      <div className="profile-layout">
        <aside className="profile-sidebar glass">
          <div className="profile-avatar-wrapper">
             <div className="avatar-circle" style={{ background: 'linear-gradient(var(--primary), var(--accent))' }}>
               CHEF
             </div>
             <span className="pro-badge">PRO</span>
          </div>
          <h2 className="chef-name">Chef Casa</h2>
          <p className="chef-bio">Explorador de perfiles aromáticos y amante de la deconstrucción culinaria.</p>
          
          <div className="sidebar-stats">
            {stats.map(s => (
              <div key={s.label} className="stat-item">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <button className="edit-profile-btn">Ajustes de Perfil</button>
        </aside>

        <main className="profile-content">
          <section className="dashboard-section">
            <h3 className="section-title">Mi Cuaderno de Lab</h3>
            <div className="experiment-list">
              {recentExperiments.map(exp => (
                <div key={exp.id} className="experiment-card glass">
                  <div className="exp-meta">
                    <span className="exp-title">{exp.title}</span>
                    <span className="exp-status">{exp.status}</span>
                  </div>
                  <span className="exp-date">{exp.date}</span>
                  <div className="exp-actions">
                    <button className="action-btn">Replicar</button>
                    <button className="action-btn">Ver Ficha</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-section">
             <h3 className="section-title">Badges de Honor</h3>
             <div className="badges-grid">
               <div className="badge-item glass">🧪 Alquimista Novato</div>
               <div className="badge-index glass">📖 Devorador de Libros</div>
               <div className="badge-item glass">🔥 Maestro de la Llama</div>
             </div>
          </section>
        </main>
      </div>

      <style jsx>{`
        .profile-page {
          padding: 80px 20px;
        }
        .profile-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 40px;
        }
        .profile-sidebar {
          padding: 40px;
          border-radius: var(--border-radius);
          text-align: center;
          border: 1px solid var(--border);
          height: fit-content;
        }
        .profile-avatar-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 25px;
        }
        .avatar-circle {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 1.5rem;
          color: white;
          box-shadow: var(--neon-shadow);
        }
        .pro-badge {
          position: absolute;
          bottom: 5px;
          right: 5px;
          background: var(--primary);
          color: white;
          font-size: 0.6rem;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 800;
        }
        .chef-name {
          font-size: 1.8rem;
          margin-bottom: 10px;
        }
        .chef-bio {
          font-size: 0.9rem;
          opacity: 0.6;
          margin-bottom: 30px;
          line-height: 1.5;
        }
        .sidebar-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 40px;
          border-top: 1px solid var(--border);
          padding-top: 30px;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
        }
        .stat-value {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--primary);
        }
        .stat-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          opacity: 0.5;
          letter-spacing: 1px;
        }
        .edit-profile-btn {
          width: 100%;
          padding: 12px;
          border-radius: 30px;
          border: 1px solid var(--border);
          background: none;
          color: var(--foreground);
          cursor: pointer;
          font-weight: 600;
          transition: var(--transition);
        }
        .edit-profile-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .section-title {
          font-size: 1.4rem;
          margin-bottom: 30px;
          letter-spacing: -0.5px;
        }
        .experiment-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 50px;
        }
        .experiment-card {
          padding: 25px;
          border-radius: var(--border-radius);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
        }
        .exp-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }
        .exp-title {
          font-weight: 700;
          font-size: 1.1rem;
        }
        .exp-status {
          font-size: 0.7rem;
          background: rgba(var(--primary), 0.1);
          color: var(--primary);
          padding: 4px 10px;
          border-radius: 4px;
          font-weight: 800;
        }
        .exp-date {
          font-size: 0.8rem;
          opacity: 0.4;
          margin-bottom: 20px;
        }
        .exp-actions {
          display: flex;
          gap: 10px;
        }
        .action-btn {
          background: none;
          border: 1px solid var(--border);
          color: var(--foreground);
          padding: 6px 15px;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: var(--transition);
        }
        .action-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .badges-grid {
          display: flex;
          gap: 15px;
        }
        .badge-item, .badge-index {
          padding: 15px 25px;
          border-radius: 12px;
          border: 1px solid var(--border);
          font-size: 0.9rem;
          font-weight: 600;
        }
        @media (max-width: 900px) {
          .profile-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
