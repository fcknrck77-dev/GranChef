'use client';

import { useState, useEffect } from 'react';
import { Course, courses as localCourses } from '@/data/courses';
import { ACCESS_CONFIGS, AccessLevel } from '@/data/access';
import { useUserAuth } from '@/context/UserAuthContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { getSupabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Timer, Sparkles, ChevronRight } from 'lucide-react';
import LockedOverlay from '@/components/LockedOverlay';

export default function Courses() {
  const { getEffectiveLevel, accountAgeInDays, authState, openAuthModal } = useUserAuth();
  const { isAdmin } = useAdminAuth();
  const displayAge = Math.max(1, accountAgeInDays);
  const [filter, setFilter] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dbCourses, setDbCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const FALLBACK_COURSES: any[] = [
    { id: 'f1', title: 'Introducción a la Esferificación Básica', description: 'Aprende los fundamentos de la cocina molecular con la técnica que revolutionó la gastronomía. Alginato de sodio y calcio en acción.', instructor: 'Chef Ferran Adrià (Homenaje)', category: 'Técnicas', tier: 'FREE', days_required: 1, readingTime: '15 min', publishedAt: '15/03/2026', modules: [] },
    { id: 'f2', title: 'Bases de la Gelificación: Agar-Agar y Gelatina', description: 'Comparativa exhaustiva de agentes gelificantes, sus temperaturas de activación y casos de uso en la cocina de vanguardia.', instructor: 'Chef Heston Blumenthal', category: 'Técnicas', tier: 'FREE', days_required: 1, readingTime: '20 min', publishedAt: '15/03/2026', modules: [] },
    { id: 'f3', title: 'El Huevo: Ciencia y Precisión', description: 'Análisis completo de las proteínas del huevo y cómo la temperatura controla su textura. Cocción a 63ºC, 65ºC y 68ºC.', instructor: 'Chef Joan Roca', category: 'Técnicas', tier: 'FREE', days_required: 1, readingTime: '18 min', publishedAt: '15/03/2026', modules: [] },
    { id: 'f4', title: 'Arquitectura del Sabor: Compuestos Aromáticos', description: 'MasterClass sobre moléculas de aroma, familias de terpenos y cómo usarlos para crear maridajes perfectos basados en química.', instructor: 'Chef François Chartier', category: 'Creatividad', tier: 'PRO', days_required: 1, readingTime: '35 min', publishedAt: '15/03/2026', modules: [] },
    { id: 'f5', title: 'Soportes Estructurales y Gelificación Avanzada', description: 'Dominio de hidrocoloides para crear estructuras imposibles: geles calientes, espumas frías y membranas comestibles.', instructor: 'Chef Joan Roca', category: 'Técnicas', tier: 'PRO', days_required: 1, readingTime: '30 min', publishedAt: '15/03/2026', modules: [] },
    { id: 'f6', title: 'Cromatografía Gastronómica', description: 'Cómo la ciencia de las moléculas aromáticas define el maridaje. El método científico aplicado al diseño de menú.', instructor: 'Chef François Chartier', category: 'Creatividad', tier: 'PREMIUM', days_required: 1, readingTime: '60 min', publishedAt: '15/03/2026', modules: [] },
    { id: 'f7', title: 'Cocción al Vacío: Sous-Vide Mastery', description: 'Protocolo completo para dominar el sous-vide: tablas de temperatura, tiempos exactos y técnicas de seguridad alimentaria.', instructor: 'Chef Thomas Keller', category: 'Técnicas', tier: 'FREE', days_required: 2, readingTime: '25 min', publishedAt: '16/03/2026', modules: [] },
    { id: 'f8', title: 'Emulsiones: De la Mayonesa al Aceite de Oliva en Polvo', description: 'Física de las emulsiones, agentes emulsionantes naturales y técnicas moleculares para crear texturas inéditas.', instructor: 'Chef Ferran Adrià', category: 'Técnicas', tier: 'PRO', days_required: 3, readingTime: '40 min', publishedAt: '17/03/2026', modules: [] },
    { id: 'f9', title: 'Nitrógeno Líquido en la Cocina', description: 'Aplicaciones del nitrógeno líquido a -196ºC: heladería ultrarrápida, criofrituras, polvo de alcohol y más.', instructor: 'Chef Heston Blumenthal', category: 'Técnicas', tier: 'PREMIUM', days_required: 4, readingTime: '50 min', publishedAt: '18/03/2026', modules: [] },
    { id: 'f10', title: 'Aceites Infusionados: Control de Temperatura y Sabor', description: 'Técnicas de infusión en frío y en caliente para extraer aromas. El aceite como vehículo de sabores complejos.', instructor: 'Chef René Redzepi', category: 'Ingredientes', tier: 'FREE', days_required: 5, readingTime: '20 min', publishedAt: '19/03/2026', modules: [] },
    { id: 'f11', title: 'Fermentación Controlada: Kimchi, Miso y Koji', description: 'El mundo de los fermentados: bacterias, levaduras, mohos y cómo controlar el proceso para resultados culinarios excepcionales.', instructor: 'Chef René Redzepi', category: 'Ingredientes', tier: 'PRO', days_required: 6, readingTime: '45 min', publishedAt: '20/03/2026', modules: [] },
    { id: 'f12', title: 'Trufa Negra: El Diamante de la Gastronomía', description: 'Historia, variedades, conservación y técnicas de uso de la trufa negra melanosporum. La ciencia detrás de sus aromas.', instructor: 'Chef Joël Robuchon (Homenaje)', category: 'Ingredientes', tier: 'PREMIUM', days_required: 7, readingTime: '55 min', publishedAt: '21/03/2026', modules: [] },
    { id: 'f13', title: 'Técnicas de Corte y Cuchillería Japonesa', description: 'El arte del Kiri: filosofía japonesa del corte, tipos de cuchillos, ángulos de afilado y geometría del filo.', instructor: 'Chef Jiro Ono', category: 'Técnicas', tier: 'FREE', days_required: 8, readingTime: '22 min', publishedAt: '22/03/2026', modules: [] },
    { id: 'f14', title: 'El Umami: Quinto Sabor y Sinergias Moleculares', description: 'Glutamato, inosinato y guanilato. La sinergia del umami y cómo potenciar cada plato con ingredientes ricos en sabor.', instructor: 'Chef Yoshihiro Iizuka', category: 'Ingredientes', tier: 'PRO', days_required: 9, readingTime: '38 min', publishedAt: '23/03/2026', modules: [] },
    { id: 'f15', title: 'Destilación y Rotovapor: Aromas Puros', description: 'Uso del rotovaporizador a presión reducida para capturar esencias volátiles de ingredientes únicos. Cocina de autor.', instructor: 'Chef Albert Adrià', category: 'Técnicas', tier: 'PREMIUM', days_required: 10, readingTime: '65 min', publishedAt: '24/03/2026', modules: [] },
    { id: 'f16', title: 'Azúcar y Caramelización: Química del Dulce', description: 'Los 5 estadios del azúcar, la reacción de Maillard vs caramelización y técnicas de trabajado en caliente.', instructor: 'Chef Pierre Hermé', category: 'Técnicas', tier: 'FREE', days_required: 11, readingTime: '28 min', publishedAt: '25/03/2026', modules: [] },
    { id: 'f17', title: 'Caviar de Producción: Esferificación Avanzada', description: 'Protocolo de producción de "caviar sintético" en volumen. Estabilidad de las esferas, variables críticas.', instructor: 'Chef Ferran Adrià', category: 'Técnicas', tier: 'PRO', days_required: 12, readingTime: '42 min', publishedAt: '26/03/2026', modules: [] },
    { id: 'f18', title: 'Cocina Nórdica: Fermentos, Mar y Bosque', description: 'La revolución nórdica: forrajeo, fermentación y la estética del plato minimalista. El mundo de Noma.', instructor: 'Chef René Redzepi', category: 'Creatividad', tier: 'PREMIUM', days_required: 13, readingTime: '70 min', publishedAt: '27/03/2026', modules: [] },
    { id: 'f19', title: 'Especias: Historia, Química y Maridaje', description: 'De la Ruta de la Seda a la ciencia moderna. Perfil molecular de 20 especias fundamentales y sus combinaciones.', instructor: 'Chef Yotam Ottolenghi', category: 'Ingredientes', tier: 'FREE', days_required: 14, readingTime: '32 min', publishedAt: '28/03/2026', modules: [] },
    { id: 'f20', title: 'Cocina al Fuego Directo: Maillard Extremo', description: 'La ciencia del grill: temperatura, colágeno, grasa y la reacción de Maillard para costrificar en segundos.', instructor: 'Chef Francis Mallmann', category: 'Técnicas', tier: 'PRO', days_required: 15, readingTime: '33 min', publishedAt: '01/04/2026', modules: [] },
    { id: 'f21', title: 'Chocolate: Templado, Cristales y Couverture', description: 'Los 6 tipos de cristales del cacao, la curva de templado y técnicas avanzadas de moldeado y acabado.', instructor: 'Chef Cédric Grolet', category: 'Técnicas', tier: 'PREMIUM', days_required: 16, readingTime: '80 min', publishedAt: '02/04/2026', modules: [] },
    { id: 'f22', title: 'Plancton Marino: El Sabor del Océano', description: 'Propiedades del tetraselmis chuii, su composición nutricional y técnicas de uso en cocina de vanguardia.', instructor: 'Chef Ángel León', category: 'Ingredientes', tier: 'FREE', days_required: 17, readingTime: '24 min', publishedAt: '03/04/2026', modules: [] },
    { id: 'f23', title: 'Pastelería Molecular: Trompe-l\'oeil', description: 'El arte del engaño visual: cómo crear réplicas perfectas de frutas, piedras e insectos comestibles con técnica pura.', instructor: 'Chef Cédric Grolet', category: 'Creatividad', tier: 'PRO', days_required: 18, readingTime: '55 min', publishedAt: '04/04/2026', modules: [] },
    { id: 'f24', title: 'Bebidas y Cocktails Moleculares', description: 'Aplicación de técnicas de vanguardia a la coctelería: esferas de Negroni, niebla de bergamota y gelatinas de Gin Tonic.', instructor: 'Chef Albert Adrià', category: 'Creatividad', tier: 'PREMIUM', days_required: 19, readingTime: '60 min', publishedAt: '05/04/2026', modules: [] },
    { id: 'f25', title: 'Carne: Maduración Seca y Húmeda', description: 'La ciencia de la maduración: proteolisis, lipolisis, hongos proteolíticos y cómo lograr el mejor sabor.', instructor: 'Chef Heston Blumenthal', category: 'Ingredientes', tier: 'FREE', days_required: 20, readingTime: '27 min', publishedAt: '06/04/2026', modules: [] },
    { id: 'f26', title: 'Sabores del Mundo: Mapa Molecular Global', description: 'Un atlas de perfiles de sabor regionales. Por qué la cocina mexicana combina perfectamente con ciertas especias.', instructor: 'Chef Nobu Matsuhisa', category: 'Creatividad', tier: 'PRO', days_required: 21, readingTime: '48 min', publishedAt: '07/04/2026', modules: [] },
    { id: 'f27', title: 'Algas: El Futuro Verde de la Cocina', description: 'Kombu, wakame, nori y espirulina. Cocina con algas: maridaje, texturas y beneficios nutricionales.', instructor: 'Chef Ángel León', category: 'Ingredientes', tier: 'PREMIUM', days_required: 22, readingTime: '58 min', publishedAt: '08/04/2026', modules: [] },
    { id: 'f28', title: 'Deshidratación y Crispy: Texturas Crujientes', description: 'Deshidratadores, liofilización y horno de convección. Cómo conseguir el crujiente perfecto y preservar aromas.', instructor: 'Chef René Redzepi', category: 'Técnicas', tier: 'FREE', days_required: 23, readingTime: '21 min', publishedAt: '09/04/2026', modules: [] },
    { id: 'f29', title: 'Pain de Cuisine: Pan Artesano y Fermentación', description: 'La microbiología de la masa madre, fermentación lenta y técnicas de horneado para cortezas perfectas.', instructor: 'Chef Eric Kayser', category: 'Técnicas', tier: 'PRO', days_required: 24, readingTime: '44 min', publishedAt: '10/04/2026', modules: [] },
    { id: 'f30', title: 'Fotografía Culinaria y Plating de Alta Cocina', description: 'Geometría del plato, uso del espacio negativo, paleta cromática y técnicas de fotografía gastronómica profesional.', instructor: 'Chef Grant Achatz', category: 'Creatividad', tier: 'PREMIUM', days_required: 25, readingTime: '75 min', publishedAt: '11/04/2026', modules: [] },
    { id: 'f31', title: 'Gestión Culinaria: Diseño de Menú y Costes', description: 'Cómo diseñar un menú degustación rentable. Food cost, escandallos y la psicología de precios en restaurantes Michelin.', instructor: 'Chef Joël Robuchon (Homenaje)', category: 'Gestión', tier: 'FREE', days_required: 26, readingTime: '30 min', publishedAt: '12/04/2026', modules: [] },
  ];

  const userLevel = getEffectiveLevel();

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      const supabase = getSupabase();
      if (!supabase) {
        setDbCourses(localCourses);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('days_required', { ascending: true });
        
        if (error || !data || data.length === 0) {
          // Fallback to local data when Supabase is unavailable or empty
          setDbCourses(localCourses);
        } else {
          const mapped = data.map((c: any) => ({
            ...c,
            readingTime: c.reading_time,
            publishedAt: new Date(c.created_at).toLocaleDateString()
          }));
          setDbCourses(mapped);
        }
      } catch {
        setDbCourses(localCourses);
      }
      setLoading(false);
    }
    fetchCourses();
  }, []);

  const filteredCourses = filter === 'All' 
    ? dbCourses 
    : dbCourses.filter(c => c.category === filter);

  return (
    <div className="courses-page container">
      <header className="courses-hero">
        <h1 className="neon-text">Omniscience MasterClass</h1>
        <p className="subtitle">Enciclopedia técnica y especializada de vanguardia culinaria basada en la biblioteca GrandChef.</p>
        <div className="daily-badge">
          <span className="dot animate-pulse"></span>
          DÍA {displayAge} DE TU ENTRENAMIENTO
        </div>
      </header>

      <nav className="filter-nav">
        {['All', 'Técnicas', 'Ingredientes', 'Gestión', 'Creatividad'].map(cat => (
          <button 
            key={cat} 
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>

      <div className="courses-grid">
        {loading ? (
           <div className="loading-state">Cargando biblioteca...</div>
        ) : filteredCourses.map(course => {
          const daysReq = course.days_required || 0;
          const isReleased = daysReq <= displayAge;
          const hasTierAccess = isAdmin ||
                               userLevel === 'ADMIN' || 
                               (course.tier === 'FREE') || 
                               (course.tier === 'PRO' && (userLevel === 'PRO' || userLevel === 'PREMIUM')) ||
                               (course.tier === 'PREMIUM' && userLevel === 'PREMIUM');
          
          const lockedByTier = isReleased && !hasTierAccess;
          const comingSoon = !isReleased;

          return (
            <div 
              key={course.id} 
              className={`course-card glass ${lockedByTier ? 'locked-tier' : ''} ${comingSoon ? 'coming-soon' : ''}`} 
              onClick={() => {
                if (comingSoon) {
                  alert(`Este contenido se desbloqueará el Día ${daysReq} de tu entrenamiento. ¡Sigue aprendiendo!`);
                  return;
                }
                if (lockedByTier) {
                  if (!authState.isRegistered) openAuthModal();
                  else window.location.href = '/pricing';
                  return;
                }
                setSelectedCourse(course);
              }}
            >
              {comingSoon && (
                <div className="coming-soon-overlay">
                  <div className="timer-box">
                    <Timer size={24} className="mb-2" />
                    <span>Día {daysReq}</span>
                  </div>
                </div>
              )}
              {lockedByTier && (
                <LockedOverlay
                  requiredTier={(course.tier === 'PREMIUM' ? 'PREMIUM' : 'PRO') as 'PRO' | 'PREMIUM'}
                  onUnlock={() => { if (!authState.isRegistered) openAuthModal(); else window.location.href = '/pricing'; }}
                />
              )}

              <div className="card-top">
                <span className={`tier-pill ${course.tier.toLowerCase()}`}>{course.tier}</span>
                <span className="reading-time">📖 {course.readingTime}</span>
              </div>
              
              <div className="course-main">
                <div className="flex justify-between items-start">
                  <span className="instructor">{course.instructor}</span>
                </div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>

              <div className="card-footer">
                <span className="published">Liberado el Día {daysReq}</span>
                {lockedByTier ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!authState.isRegistered) openAuthModal();
                      else window.location.href = '/pricing';
                    }}
                    className="lock-link flex items-center gap-2"
                  >
                    <Sparkles size={14} /> Desbloquear Plan
                  </button>
                ) : comingSoon ? (
                  <span className="wait-badge">Próximamente</span>
                ) : (
                  <button className="read-btn">Iniciar Lectura <ChevronRight size={16} /> </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedCourse && (
        <div className="reader-overlay animate-fadeIn" onClick={() => setSelectedCourse(null)}>
          <div className="reader-modal glass neon-border animate-slideUp" onClick={e => e.stopPropagation()}>
            <button className="close-reader" onClick={() => setSelectedCourse(null)}>×</button>
            
            <article className="reading-content">
              <header className="reader-header">
                <div className="header-top">
                  <span className="reader-cat">{selectedCourse.category}</span>
                  <div className="action-buttons">
                    {(userLevel === 'PRO' || userLevel === 'PREMIUM' || userLevel === 'ADMIN') && (
                      <button 
                        className="export-btn print-btn" 
                        onClick={() => {
                          document.body.classList.add('print-authorized');
                          window.print();
                          setTimeout(() => document.body.classList.remove('print-authorized'), 1000);
                        }}
                      >
                        <span>🖨️ Imprimir</span>
                      </button>
                    )}
                    {(userLevel === 'PREMIUM' || userLevel === 'ADMIN') && (
                      <button className="export-btn" onClick={() => alert('Generando PDF corporativo encriptado...')}>
                        <span>📄 Exportar a PDF</span>
                      </button>
                    )}
                  </div>
                </div>
                <h2>{selectedCourse.title}</h2>
                <div className="reader-meta">
                  <span>Por {selectedCourse.instructor}</span>
                  <span className="separator">|</span>
                  <span>Lectura estimada: {selectedCourse.readingTime}</span>
                </div>
              </header>

              {selectedCourse.modules.map(module => (
                <section key={module.id} className="reader-section">
                  <h3>{module.title}</h3>
                  <div className="text-block">
                    {module.content.split('\n\n').map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </section>
              ))}

              <footer className="reader-footer">
                <button className="finish-btn" onClick={() => setSelectedCourse(null)}>Finalizar Lección</button>
              </footer>
            </article>
          </div>
        </div>
      )}

      <style jsx>{`
        .loading-state { text-align: center; font-size: 1.5rem; color: var(--primary); grid-column: 1 / -1; padding: 100px; opacity: 0.5; }

        .courses-page { padding: 120px 20px; min-height: 100vh; }
        .courses-hero { text-align: center; margin-bottom: 80px; position: relative; }
        .neon-text { font-size: 4rem; margin-bottom: 15px; }
        .subtitle { font-size: 1.2rem; opacity: 0.6; letter-spacing: 1px; }
        
        .daily-badge { 
          display: inline-flex; 
          align-items: center; 
          gap: 10px; 
          margin-top: 30px; 
          padding: 8px 20px; 
          background: rgba(var(--primary-rgb), 0.1); 
          border: 1px solid var(--primary); 
          border-radius: 50px; 
          font-size: 1rem; 
          font-weight: 900; 
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 2px;
          box-shadow: var(--neon-shadow);
        }
        .dot { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 10px var(--primary); }

        .filter-nav { display: flex; justify-content: center; gap: 15px; margin-bottom: 60px; }
        .filter-btn { background: none; border: 1px solid var(--border); color: var(--foreground); padding: 10px 30px; border-radius: 50px; cursor: pointer; transition: 0.3s; font-weight: 600; font-size: 0.9rem; }
        .filter-btn:hover, .filter-btn.active { border-color: var(--primary); background: rgba(var(--primary-rgb), 0.05); color: var(--primary); }

        .courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 30px; }
        .course-card { border-radius: 30px; border: 1px solid var(--border); padding: 40px; transition: 0.4s; cursor: pointer; position: relative; display: flex; flex-direction: column; overflow: hidden; }
        .course-card:hover { transform: translateY(-10px); border-color: var(--primary); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
        
        .course-card.locked-tier { opacity: 0.7; border-color: rgba(255, 255, 255, 0.1); }
        .course-card.coming-soon { opacity: 0.4; filter: grayscale(0.5); }

        .coming-soon-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        .timer-box {
          background: rgba(8, 8, 8, 0.9);
          border: 1px solid var(--primary);
          padding: 20px 30px;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--primary);
          font-weight: 900;
          text-transform: uppercase;
          box-shadow: var(--neon-shadow);
        }

        .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .tier-pill { font-size: 0.7rem; font-weight: 900; padding: 4px 12px; border-radius: 5px; text-transform: uppercase; }
        .tier-pill.free { background: rgba(0,255,136,0.1); color: #00ff88; }
        .tier-pill.pro { background: rgba(0,242,255,0.1); color: #00f2ff; }
        .tier-pill.premium { background: rgba(255,0,85,0.1); color: #ff0055; }
        .reading-time { font-size: 0.85rem; opacity: 0.5; font-weight: 600; }

        .course-main { flex: 1; }
        .instructor { font-size: 0.75rem; color: var(--primary); font-weight: 800; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 12px; }
        .course-card h3 { font-size: 1.8rem; margin-bottom: 20px; line-height: 1.2; font-weight: 900; }
        .course-card p { font-size: 1rem; opacity: 0.6; line-height: 1.6; margin-bottom: 30px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

        .card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 25px; margin-top: auto; }
        .published { font-size: 0.8rem; opacity: 0.3; }
        .read-btn { background: none; border: 1px solid var(--primary); color: var(--primary); padding: 10px 25px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 8px; }
        .read-btn:hover { background: var(--primary); color: black; box-shadow: var(--neon-shadow); }
        .lock-link { color: var(--primary); font-weight: 900; text-decoration: none; font-size: 0.9rem; text-transform: uppercase; background: none; border: none; cursor: pointer; padding: 0; }
        .lock-link:hover { text-shadow: var(--neon-shadow); }
        .wait-badge { font-size: 0.8rem; font-weight: 900; color: white; opacity: 0.5; text-transform: uppercase; }

        /* Reader Mode */
        .reader-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.95); backdrop-filter: blur(20px); z-index: 2000; display: flex; justify-content: center; padding: 0; }
        .reader-modal { width: 100%; max-width: 900px; height: 100vh; overflow-y: auto; background: #080808; position: relative; padding: 100px 80px; border-inline: 1px solid rgba(255,255,255,0.05); }
        .close-reader { position: fixed; top: 40px; right: 40px; background: rgba(255,255,255,0.05); border: none; color: white; width: 60px; height: 60px; border-radius: 50%; font-size: 2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; z-index: 2100; }
        .close-reader:hover { background: var(--primary); color: black; transform: rotate(90deg); }

        .reading-content { max-width: 700px; margin-inline: auto; }
        .reader-header { margin-bottom: 80px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 40px; }
        .header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .action-buttons { display: flex; gap: 10px; }
        .export-btn { background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: white; padding: 8px 15px; border-radius: 8px; cursor: pointer; transition: 0.3s; font-size: 0.8rem; font-weight: bold; }
        .export-btn:hover { background: var(--primary); color: black; border-color: var(--primary); }
        .print-btn:hover { background: #00f2ff; border-color: #00f2ff; }
        .reader-cat { font-size: 0.9rem; color: var(--primary); font-weight: 800; text-transform: uppercase; letter-spacing: 4px; display: block; }
        .reader-header h2 { font-size: 4rem; font-weight: 900; margin-bottom: 30px; line-height: 1.1; color: white; }
        .reader-meta { display: flex; gap: 20px; font-size: 1.1rem; opacity: 0.5; font-style: italic; color: white; }
        .separator { opacity: 0.2; }

        .reader-section { margin-bottom: 80px; }
        .reader-section h3 { font-size: 2rem; color: white; margin-bottom: 30px; font-weight: 800; }
        .text-block p { font-size: 1.4rem; line-height: 1.8; opacity: 0.85; margin-bottom: 30px; text-align: justify; color: white; }
        .text-block p::first-letter { font-size: 3rem; color: var(--primary); float: left; margin-right: 15px; font-weight: 900; line-height: 1; margin-top: 5px; }

        .reader-footer { margin-top: 100px; padding-top: 60px; border-top: 2px solid var(--primary); text-align: center; }
        .reader-footer p { font-size: 0.9rem; opacity: 0.4; font-style: italic; margin-bottom: 40px; max-width: 500px; margin-inline: auto; }
        .finish-btn { padding: 20px 60px; border-radius: 50px; background: var(--primary); color: black; font-weight: 900; font-size: 1.2rem; border: none; cursor: pointer; transition: 0.3s; }
        .finish-btn:hover { transform: scale(1.05); box-shadow: var(--neon-shadow); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
        .animate-fadeIn { animation: fadeIn 0.4s ease; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-pulse { animation: pulse 2s infinite; }

        @media (max-width: 900px) {
          .reader-modal { padding: 80px 30px; }
          .reader-header h2 { font-size: 2.5rem; }
          .text-block p { font-size: 1.1rem; }
          .neon-text { font-size: 2.5rem; }
          .courses-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
