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
  const { getEffectiveLevel, accountAgeInDays, requireAuth } = useUserAuth();
  const { isAdmin } = useAdminAuth();
  const displayAge = Math.max(1, accountAgeInDays);
  const [filter, setFilter] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCourseLoading, setSelectedCourseLoading] = useState(false);
  const [dbCourses, setDbCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const userLevel = getEffectiveLevel();

  const effectiveLevel: AccessLevel = isAdmin ? 'ADMIN' : userLevel;

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      const supabase = getSupabase('COURSES');
      if (!supabase) {
        setDbCourses(localCourses);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('courses')
          // Do not fetch modules on initial load: seeded courses are long (thousands of words).
          .select('id,title,description,instructor,category,tier,days_required,created_at')
          .order('days_required', { ascending: true });
        
        if (error || !data || data.length === 0) {
          // Fallback to local data when Supabase is unavailable or empty
          setDbCourses(localCourses);
        } else {
          const mapped = data.map((c: any) => ({
            ...c,
            publishedAt: new Date(c.created_at).toLocaleDateString('es-ES'),
            modules: []
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

  async function ensureCourseModules(course: Course): Promise<Course> {
    if (course.modules && course.modules.length > 0) return course;
    const supabase = getSupabase('COURSES');
    if (!supabase) return course;
    const { data, error } = await supabase.from('courses').select('modules').eq('id', course.id).maybeSingle();
    if (error || !data) return course;
    return { ...course, modules: Array.isArray((data as any).modules) ? (data as any).modules : [] };
  }

  async function exportCoursePdf(course: Course) {
    const modules = course.modules || [];
    const rawText = modules
      .map((m) => `${m.title}\n\n${m.content}`)
      .join('\n\n\n')
      .replace(/\r/g, '');

    // Lazy-load dependency only when needed.
    const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const mono = await pdfDoc.embedFont(StandardFonts.Courier);

    const pageMargin = 48;
    const fontSizeTitle = 18;
    const fontSizeBody = 10;
    const lineHeight = 14;

    const wrapText = (text: string, maxWidth: number, fnt: any, size: number) => {
      const words = text.split(/\s+/).filter(Boolean);
      const lines: string[] = [];
      let line = '';
      for (const w of words) {
        const candidate = line ? `${line} ${w}` : w;
        const width = fnt.widthOfTextAtSize(candidate, size);
        if (width <= maxWidth) {
          line = candidate;
          continue;
        }
        if (line) lines.push(line);
        line = w;
      }
      if (line) lines.push(line);
      return lines;
    };

    const addPage = () => pdfDoc.addPage([595.28, 841.89]); // A4
    let page = addPage();
    let y = page.getHeight() - pageMargin;
    const x = pageMargin;
    const maxWidth = page.getWidth() - pageMargin * 2;

    const drawLine = (text: string, fnt: any, size: number, color = rgb(0.1, 0.1, 0.1)) => {
      page.drawText(text, { x, y, size, font: fnt, color });
      y -= lineHeight;
      if (y < pageMargin) {
        page = addPage();
        y = page.getHeight() - pageMargin;
      }
    };

    // Header
    drawLine(course.title, font, fontSizeTitle, rgb(0, 0, 0));
    drawLine(`Plan: ${course.tier}  |  Categoria: ${course.category}  |  Por Grand Chef`, mono, 10, rgb(0.2, 0.2, 0.2));
    drawLine(`Exportado: ${new Date().toLocaleString('es-ES')}`, mono, 10, rgb(0.2, 0.2, 0.2));
    y -= 10;

    // Body
    for (const block of rawText.split(/\n{2,}/)) {
      const trimmed = block.trim();
      if (!trimmed) continue;
      const lines = wrapText(trimmed, maxWidth, font, fontSizeBody);
      for (const ln of lines) drawLine(ln, font, fontSizeBody, rgb(0.05, 0.05, 0.05));
      y -= 6;
    }

    const bytes = await pdfDoc.save();
    // pdf-lib returns Uint8Array; convert to a real ArrayBuffer slice for DOM Blob typing.
    const ab = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    const blob = new Blob([ab as unknown as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.title.replace(/[\\/:*?"<>|]+/g, '').slice(0, 80) || 'curso'}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

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
          // Admin should be able to review any day/course immediately.
          const isReleased = isAdmin ? true : daysReq <= displayAge;
          const hasTierAccess = isAdmin ||
                               userLevel === 'ADMIN' || 
                               (course.tier === 'FREE') || 
                               (course.tier === 'PRO' && (userLevel === 'PRO' || userLevel === 'PREMIUM' || userLevel === 'ENTERPRISE')) ||
                               (course.tier === 'PREMIUM' && (userLevel === 'PREMIUM' || userLevel === 'ENTERPRISE'));
          
          const lockedByTier = isReleased && !hasTierAccess;
          const comingSoon = !isReleased;

          return (
            <div 
              key={course.id} 
              className={`course-card glass ${lockedByTier ? 'locked-tier' : ''} ${comingSoon ? 'coming-soon' : ''}`} 
              onClick={async () => {
                if (!requireAuth()) return;
                if (comingSoon) {
                  alert(`Este contenido se desbloqueará el Día ${daysReq} de tu entrenamiento. Sigue aprendiendo.`);
                  return;
                }
                if (lockedByTier) {
                  requireAuth(() => { window.location.href = '/pricing'; });
                  return;
                }
                setSelectedCourseLoading(true);
                setSelectedCourse(course);
                try {
                  const full = await ensureCourseModules(course);
                  setSelectedCourse(full);
                } finally {
                  setSelectedCourseLoading(false);
                }
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
                  onUnlock={() => requireAuth(() => { window.location.href = '/pricing'; })}
                />
              )}

              <div className="card-top">
                <span className={`tier-pill ${course.tier.toLowerCase()}`}>{course.tier}</span>
              </div>
               
              <div className="course-main">
                <div className="flex justify-between items-start">
                  <span className="instructor">Por Grand Chef</span>
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
                      requireAuth(() => { window.location.href = '/pricing'; });
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
            <button className="close-reader" onClick={() => setSelectedCourse(null)}>X</button>
            
            <article className="reading-content">
              <header className="reader-header">
                <div className="header-top">
                  <span className="reader-cat">{selectedCourse.category}</span>
                  <div className="action-buttons">
                    {(effectiveLevel === 'PREMIUM' || effectiveLevel === 'ADMIN') && (
                      <button
                        className="export-btn print-btn"
                        onClick={() => {
                          document.body.classList.add('print-authorized');
                          window.print();
                          setTimeout(() => document.body.classList.remove('print-authorized'), 1000);
                        }}
                      >
                        <span>Imprimir</span>
                      </button>
                    )}
                    {(effectiveLevel === 'PRO' || effectiveLevel === 'PREMIUM' || effectiveLevel === 'ADMIN') && (
                      <button
                        className="export-btn"
                        onClick={async () => {
                          const full = await ensureCourseModules(selectedCourse);
                          if (!full.modules || full.modules.length === 0) {
                            alert('Este curso aun no tiene contenido cargado.');
                            return;
                          }
                          await exportCoursePdf(full);
                        }}
                      >
                        <span>Exportar PDF</span>
                      </button>
                    )}
                  </div>
                </div>
                <h2>{selectedCourse.title}</h2>
                <div className="reader-meta">
                  <span>Por Grand Chef</span>
                </div>
              </header>

              {selectedCourseLoading ? (
                <section className="reader-section">
                  <div className="text-block">
                    <p>Cargando contenido...</p>
                  </div>
                </section>
              ) : (selectedCourse.modules || []).map(module => (
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
        .wait-badge { font-size: 0.8rem; font-weight: 900; color: var(--foreground); opacity: 0.6; text-transform: uppercase; }

        /* Reader Mode */
        .reader-overlay { position: fixed; inset: 0; background: var(--overlay-backdrop); backdrop-filter: blur(20px); z-index: 2000; display: flex; justify-content: center; padding: 0; }
        .reader-modal { width: 100%; max-width: 900px; height: 100vh; overflow-y: auto; background: var(--modal-surface); color: var(--modal-text); position: relative; padding: 100px 80px; border-inline: 1px solid var(--modal-border); }
        .close-reader { position: fixed; top: 40px; right: 40px; background: var(--modal-surface-2); border: 1px solid var(--modal-border); color: var(--modal-text); width: 60px; height: 60px; border-radius: 50%; font-size: 2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; z-index: 2100; }
        .close-reader:hover { background: var(--primary); color: black; transform: rotate(90deg); }

        .reading-content { max-width: 700px; margin-inline: auto; }
        .reader-header { margin-bottom: 80px; border-bottom: 1px solid var(--modal-border); padding-bottom: 40px; }
        .header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .action-buttons { display: flex; gap: 10px; }
        .export-btn { background: var(--modal-surface-2); border: 1px solid var(--modal-border); color: var(--modal-text); padding: 8px 15px; border-radius: 8px; cursor: pointer; transition: 0.3s; font-size: 0.8rem; font-weight: bold; }
        .export-btn:hover { background: var(--primary); color: black; border-color: var(--primary); }
        .print-btn:hover { background: #00f2ff; border-color: #00f2ff; }
        .reader-cat { font-size: 0.9rem; color: var(--primary); font-weight: 800; text-transform: uppercase; letter-spacing: 4px; display: block; }
        .reader-header h2 { font-size: 4rem; font-weight: 900; margin-bottom: 30px; line-height: 1.1; color: var(--modal-text); }
        .reader-meta { display: flex; gap: 20px; font-size: 1.1rem; opacity: 0.85; font-style: italic; color: var(--modal-muted); }
        .separator { opacity: 0.2; }

        .reader-section { margin-bottom: 80px; }
        .reader-section h3 { font-size: 2rem; color: var(--modal-text); margin-bottom: 30px; font-weight: 800; }
        .text-block p { font-size: 1.4rem; line-height: 1.8; opacity: 0.95; margin-bottom: 30px; text-align: justify; color: var(--modal-text); }

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

