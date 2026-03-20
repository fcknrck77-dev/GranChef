'use client';

import { Ingredient } from '@/data/ingredients';
import { Technique } from '@/data/techniques';
import { recipes as localRecipes, type Recipe } from '@/data/recipes';
import Link from 'next/link';
import { useUserAuth } from '@/context/UserAuthContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { getSupabase } from '@/lib/supabaseClient';
import { useEffect, useMemo, useState } from 'react';

interface DetailModalProps {
  item: Ingredient | Technique;
  onClose: () => void;
}

export default function DetailModal({ item, onClose }: DetailModalProps) {
  const { getEffectiveLevel } = useUserAuth();
  const { isAdmin } = useAdminAuth();
  const userLevel = isAdmin ? 'ADMIN' : getEffectiveLevel();

  const cssKey = (s: string) =>
    String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-]+/g, '');

  const canAccess = (tier: 'FREE' | 'PRO' | 'PREMIUM') => {
    if (userLevel === 'ADMIN') return true;
    if (tier === 'FREE') return true;
    if (tier === 'PRO') return userLevel === 'PRO' || userLevel === 'PREMIUM';
    if (tier === 'PREMIUM') return userLevel === 'PREMIUM';
    return false;
  };

  const norm = (s: string) => s.trim().toLowerCase();

  const localRelated: Recipe[] = useMemo(() => {
    if ('family' in item) {
      const name = norm(item.name);
      return localRecipes.filter((r) =>
        r.ingredients.some((ing) => {
          const iname = norm(ing.name);
          return iname === name || iname.includes(name) || name.includes(iname);
        })
      );
    }
    return localRecipes.filter((r) => r.techniques.includes(item.id));
  }, [item]);

  const [related, setRelated] = useState<Recipe[]>(localRelated.slice(0, 6));

  useEffect(() => {
    setRelated(localRelated.slice(0, 6));

    const supabase = getSupabase('AI_BRAIN');
    if (!supabase) return;

    (async () => {
      try {
        if ('family' in item) {
          // JSONB ingredient matching is hard to query precisely; fetch recent recipes and filter client-side.
          const res = await supabase.from('recipes').select('*').order('created_at', { ascending: false }).limit(250);
          if (res.error || !res.data) return;
          const needle = norm(item.name);
          const mapped = res.data
            .map((r: any) => ({
              id: String(r.id),
              title: String(r.title),
              source: String(r.source || 'Grand Chef'),
              tier: String(r.tier) as any,
              difficulty: String(r.difficulty || 'Basico') as any,
              servings: Number(r.servings || 2),
              times: (r.times && typeof r.times === 'object' ? r.times : { prepMin: 10, cookMin: 10 }) as any,
              description: String(r.description || ''),
              utensils: Array.isArray(r.utensils) ? r.utensils.map(String) : [],
              ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
              steps: Array.isArray(r.steps) ? r.steps.map(String) : [],
              techniques: Array.isArray(r.techniques) ? r.techniques.map(String) : [],
              tags: Array.isArray(r.tags) ? r.tags.map(String) : [],
            }))
            .filter((r: Recipe) =>
              r.ingredients.some((ing: any) => {
                const iname = norm(String(ing?.name || ''));
                return iname === needle || iname.includes(needle) || needle.includes(iname);
              })
            )
            .slice(0, 6);
          if (mapped.length > 0) setRelated(mapped);
        } else {
          const res = await supabase
            .from('recipes')
            .select('*')
            .contains('techniques', [item.id])
            .order('created_at', { ascending: false })
            .limit(50);
          if (res.error || !res.data) return;
          const mapped = res.data.slice(0, 6).map((r: any) => ({
            id: String(r.id),
            title: String(r.title),
            source: String(r.source || 'Grand Chef'),
            tier: String(r.tier) as any,
            difficulty: String(r.difficulty || 'Basico') as any,
            servings: Number(r.servings || 2),
            times: (r.times && typeof r.times === 'object' ? r.times : { prepMin: 10, cookMin: 10 }) as any,
            description: String(r.description || ''),
            utensils: Array.isArray(r.utensils) ? r.utensils.map(String) : [],
            ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
            steps: Array.isArray(r.steps) ? r.steps.map(String) : [],
            techniques: Array.isArray(r.techniques) ? r.techniques.map(String) : [],
            tags: Array.isArray(r.tags) ? r.tags.map(String) : [],
          }));
          if (mapped.length > 0) setRelated(mapped);
        }
      } catch {
        // keep fallback
      }
    })();
  }, [item, localRelated]);

  return (
    <div className="detail-modal-overlay animate-fadeIn" onClick={onClose}>
      <div className="detail-modal glass neon-border animate-slideUp" onClick={e => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>X</button>
        <div className="modal-content">
          <div className="modal-header">
            <span className="modal-category">
              {'family' in item ? item.family : item.category}
            </span>
            <h2 className="modal-title">{item.name}</h2>
            {'difficulty' in item && (
              <span className={`diff-tag ${cssKey(item.difficulty)}`}>
                Protocolo: {item.difficulty}
              </span>
            )}
          </div>

          <div className="modal-body">
            <section className="modal-section">
              <h4>DESCRIPCIÓN TÉCNICA</h4>
              <p className="full-desc">{item.description}</p>
            </section>

            <section className="modal-section">
              <h4>MATRIZ DE SINERGIA</h4>
              <div className="full-pill-grid">
                {item.pairingNotes.map(p => (
                  <span key={p} className="pill large">{p}</span>
                ))}
              </div>
            </section>

            {'equipment' in item && (
              <section className="modal-section">
                <h4>HARDWARE REQUERIDO</h4>
                <ul className="modal-list">
                  {item.equipment.map(e => <li key={e}>- {e}</li>)}
                </ul>
              </section>
            )}

            {'reagents' in item && item.reagents && item.reagents.length > 0 && (
              <section className="modal-section">
                <h4>REACTIVOS Y ADITIVOS</h4>
                <ul className="modal-list">
                  {item.reagents.map(r => <li key={r}>- {r}</li>)}
                </ul>
              </section>
            )}

            {'stories' in item && item.stories && Object.keys(item.stories).length > 0 && (
              <section className="modal-section">
                <h4>HISTORIAL DE MARIDAJE (THE FLAVOR MATRIX)</h4>
                <div className="stories-container">
                  {Object.entries(item.stories).map(([key, story]) => (
                    <div key={key} className="story-item glass">
                      <span className="story-with">Con {key}:</span>
                      <p className="story-text">{story}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {related.length > 0 && (
              <section className="modal-section">
                <h4>RECETAS RELACIONADAS</h4>
                <div className="related-grid">
                  {related.map((r) => {
                    const locked = !canAccess(r.tier);
                    return (
                      <div key={r.id} className={`related-card ${locked ? 'locked' : ''}`}>
                        <div className="related-head">
                          <span className={`tier ${r.tier.toLowerCase()}`}>{r.tier}</span>
                          <span className="rel-src">{r.source}</span>
                        </div>
                        <p className="rel-title">{r.title}</p>
                        {locked ? (
                          <Link href="/pricing" className="rel-link">Activar plan {r.tier}</Link>
                        ) : (
                          <Link href={`/recipes?open=${encodeURIComponent(r.id)}`} className="rel-link">Ver receta</Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .detail-modal-overlay {
          position: fixed;
          inset: 0;
          background: var(--overlay-backdrop);
          backdrop-filter: blur(10px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .detail-modal {
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          background: var(--modal-surface);
          border-radius: 40px;
          padding: 60px;
          position: relative;
          color: var(--modal-text);
          box-shadow: 0 0 100px rgba(0,0,0,0.25);
        }

        .close-modal {
          position: absolute;
          top: 30px;
          right: 30px;
          background: none;
          border: none;
          color: var(--modal-text);
          font-size: 2rem;
          cursor: pointer;
          opacity: 0.5;
          transition: 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .close-modal:hover { opacity: 1; transform: rotate(90deg); background: var(--modal-surface-2); }

        .modal-category { font-size: 0.8rem; letter-spacing: 4px; opacity: 0.5; text-transform: uppercase; color: var(--primary); font-weight: 800; }
        .modal-title { font-size: 4rem; margin: 10px 0; color: var(--modal-text); font-weight: 900; }
        .modal-section { margin-top: 50px; }
        .full-desc { font-size: 1.4rem; line-height: 1.6; opacity: 0.95; color: var(--modal-muted); }
        
        .full-pill-grid { display: flex; flex-wrap: wrap; gap: 10px; }
        .pill { padding: 6px 14px; border-radius: 30px; background: var(--modal-surface-2); font-size: 0.85rem; border: 1px solid var(--modal-border); }
        .pill.large { padding: 10px 20px; font-size: 1rem; }
        
        .modal-list { list-style: none; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .modal-list li { font-size: 1.1rem; opacity: 0.9; color: var(--modal-text); padding: 10px; background: var(--modal-surface-2); border-radius: 10px; border: 1px solid var(--modal-border); }

        .stories-container { display: flex; flex-direction: column; gap: 20px; }
        .story-item { padding: 25px; border-radius: 20px; background: var(--modal-surface-2); border: 1px solid var(--modal-border); }
        .story-with { font-weight: 900; color: var(--primary); font-size: 0.9rem; margin-bottom: 10px; display: block; }
        .story-text { font-size: 1.1rem; line-height: 1.6; opacity: 0.9; color: var(--modal-muted); }

        .related-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .related-card { padding: 16px; border-radius: 20px; background: var(--modal-surface-2); border: 1px solid var(--modal-border); }
        .related-card.locked { opacity: 0.6; filter: grayscale(1); }
        .related-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 8px; }
        .rel-src { font-size: 0.65rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 1px; }
        .rel-title { margin: 0 0 10px; font-size: 1.05rem; font-weight: 900; line-height: 1.35; }
        .rel-link { color: var(--primary) !important; font-weight: 900; text-decoration: underline; }
        .tier { font-size: 0.65rem; font-weight: 900; padding: 3px 8px; border-radius: 999px; border: 1px solid var(--border); }
        .tier.pro { color: #00f2ff; border-color: rgba(0,242,255,0.4); }
        .tier.premium { color: #ff0055; border-color: rgba(255,0,85,0.4); }

        h4 { font-size: 0.8rem; letter-spacing: 2px; color: var(--primary); margin-bottom: 20px; }

        .diff-tag { font-size: 0.7rem; padding: 4px 12px; border-radius: 5px; font-weight: 900; display: inline-block; margin-top: 10px; }
        .maestro { background: #ff0055; color: white; }
        .avanzado { background: #ff4d00; color: white; }
        .intermedio { background: #00f2ff; color: #000; }
        .basico { background: #00ff88; color: #000; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease; }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }

        @media (max-width: 768px) {
          .modal-title { font-size: 2.5rem; }
          .detail-modal { padding: 30px; }
          .modal-list { grid-template-columns: 1fr; }
          .related-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

