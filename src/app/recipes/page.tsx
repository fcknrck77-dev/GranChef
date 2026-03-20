'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { recipes as localRecipes, Recipe, recipeDetailedSteps, recipeTotalTimeLabel } from '@/data/recipes';
import { ingredients as localIngredients, Ingredient } from '@/data/ingredients';
import { techniques as localTechniques, Technique } from '@/data/techniques';
import { ACCESS_CONFIGS } from '@/data/access';
import { useUserAuth } from '@/context/UserAuthContext';
import { useAdminAuth } from '@/context/AdminAuthContext';
import DetailModal from '@/components/DetailModal';
import { getSupabase } from '@/lib/supabaseClient';

function canAccessRecipe(userLevel: 'FREE' | 'PRO' | 'PREMIUM' | 'ADMIN', tier: 'FREE' | 'PRO' | 'PREMIUM') {
  if (userLevel === 'ADMIN') return true;
  if (tier === 'FREE') return true;
  if (tier === 'PRO') return userLevel === 'PRO' || userLevel === 'PREMIUM';
  if (tier === 'PREMIUM') return userLevel === 'PREMIUM';
  return false;
}

function findIngredientByName(list: Ingredient[], name: string) {
  const n = name.trim().toLowerCase();
  return list.find((i) => i.name.trim().toLowerCase() === n) || null;
}

function findTechniqueById(list: Technique[], id: string) {
  return list.find((t) => t.id === id) || null;
}

export default function RecipesPage() {
  const { getEffectiveLevel, requireAuth } = useUserAuth();
  const { isAdmin } = useAdminAuth();
  const params = useSearchParams();

  const [recipesData, setRecipesData] = useState<Recipe[]>(localRecipes);
  const [ingredientsData, setIngredientsData] = useState<Ingredient[]>(localIngredients);
  const [techniquesData, setTechniquesData] = useState<Technique[]>(localTechniques);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedItem, setSelectedItem] = useState<Ingredient | Technique | null>(null);
  const [query, setQuery] = useState('');

  const userLevel = isAdmin ? 'ADMIN' : getEffectiveLevel();
  const config = ACCESS_CONFIGS[userLevel];

  useEffect(() => {
    const supabase = getSupabase('AI_BRAIN');
    if (!supabase) return;

    (async () => {
      try {
        const [recipesRes, ingRes, techRes] = await Promise.all([
          supabase.from('recipes').select('*').order('created_at', { ascending: false }).limit(300),
          supabase.from('ingredients').select('*').order('family', { ascending: true }).order('name', { ascending: true }).limit(300),
          supabase.from('techniques').select('*').order('category', { ascending: true }).order('name', { ascending: true }).limit(300),
        ]);

        if (!recipesRes.error && recipesRes.data && recipesRes.data.length > 0) {
          const mapped: Recipe[] = recipesRes.data.map((r: any) => ({
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

          // Merge DB recipes on top of local, unique by id.
          const byId = new Map<string, Recipe>();
          for (const rr of localRecipes) byId.set(rr.id, rr);
          for (const rr of mapped) byId.set(rr.id, rr);
          setRecipesData(Array.from(byId.values()));
        }

        if (!ingRes.error && ingRes.data && ingRes.data.length > 0) {
          const mapped = ingRes.data.map((row: any) => ({
            id: String(row.id),
            name: String(row.name),
            category: String(row.category),
            family: String(row.family),
            description: String(row.description),
            pairingNotes: Array.isArray(row.pairing_notes) ? row.pairing_notes.map(String) : [],
            stories: row.stories && typeof row.stories === 'object' ? row.stories : undefined,
          }));
          setIngredientsData(mapped);
        }

        if (!techRes.error && techRes.data && techRes.data.length > 0) {
          const mapped = techRes.data.map((row: any) => ({
            id: String(row.id),
            name: String(row.name),
            category: String(row.category) as any,
            description: String(row.description),
            difficulty: String(row.difficulty) as any,
            equipment: Array.isArray(row.equipment) ? row.equipment.map(String) : [],
            reagents: Array.isArray(row.reagents) ? row.reagents.map(String) : [],
            pairingNotes: Array.isArray(row.pairing_notes) ? row.pairing_notes.map(String) : [],
          }));
          setTechniquesData(mapped);
        }
      } catch {
        // Keep local fallback
      }
    })();
  }, []);

  useEffect(() => {
    const q = (params.get('q') || '').trim();
    if (q) setQuery(q);
  }, [params]);

  useEffect(() => {
    const open = (params.get('open') || '').trim();
    if (!open) return;
    if (selectedRecipe) return;
    const r = recipesData.find((x) => x.id === open) || null;
    if (r && canAccessRecipe(userLevel, r.tier)) requireAuth(() => setSelectedRecipe(r));
  }, [params, recipesData, selectedRecipe, userLevel, requireAuth]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? recipesData.filter((r) => {
          if (r.title.toLowerCase().includes(q)) return true;
          if (r.tags.some((t) => t.toLowerCase().includes(q))) return true;
          if (r.ingredients.some((i) => i.name.toLowerCase().includes(q))) return true;
          return false;
        })
      : recipesData;

    const limit = userLevel === 'ADMIN' ? -1 : config.features.recipesLimit;
    return limit === -1 ? list : list.slice(0, limit);
  }, [query, recipesData, userLevel, config.features.recipesLimit]);

  const hasMore = userLevel !== 'ADMIN' && config.features.recipesLimit !== -1 && recipesData.length > config.features.recipesLimit;

  return (
    <div className="recipes-page container">
      <header className="page-header">
        <h1 className="neon-text">Recetas y Protocolos</h1>
        <p className="subtitle">Recetas completas con pesos, tiempos, utensilios y técnicas.</p>

        <div className="search-row">
          <input
            className="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por receta, ingrediente o etiqueta..."
          />
          <div className="badge">{userLevel}</div>
        </div>
      </header>

      <div className="recipes-grid">
        {filtered.map((r) => {
          const locked = !canAccessRecipe(userLevel, r.tier);
          return (
            <div
              key={r.id}
              className={`recipe-card glass ${locked ? 'locked' : ''}`}
              onClick={() => {
                if (locked) {
                  requireAuth(() => { window.location.href = '/pricing'; });
                  return;
                }
                requireAuth(() => setSelectedRecipe(r));
              }}
            >
              <div className="card-head">
                <span className={`tier ${r.tier.toLowerCase()}`}>{r.tier}</span>
                <span className="meta">{r.servings} raciones | {recipeTotalTimeLabel(r)}</span>
              </div>
              <h3>{r.title}</h3>
              <p className="desc">{r.description}</p>
              <div className="tags">
                {r.tags.slice(0, 3).map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
              {locked ? (
                <div className="locked-cta">
                  <Link href="/pricing" className="unlock-link">Activar plan {r.tier}</Link>
                </div>
              ) : (
                <button className="open-btn">Ver receta</button>
              )}
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="more-lock glass">
          <h2>Contenido adicional bloqueado</h2>
          <p>Tu plan actual muestra {config.features.recipesLimit} recetas. Sube a PRO o PREMIUM para ver todo.</p>
          <Link href="/pricing" className="upgrade">Ver planes</Link>
        </div>
      )}

      {selectedRecipe && (
        <div className="recipe-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="recipe-modal glass neon-border" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setSelectedRecipe(null)}>X</button>
            <header className="modal-head">
              <span className={`tier ${selectedRecipe.tier.toLowerCase()}`}>{selectedRecipe.tier}</span>
              <h2>{selectedRecipe.title}</h2>
              <div className="modal-meta">
                <span>Dificultad: {selectedRecipe.difficulty}</span>
                <span>Tiempo total: {recipeTotalTimeLabel(selectedRecipe)}</span>
                <span>Raciones: {selectedRecipe.servings}</span>
              </div>
              <p className="modal-desc">{selectedRecipe.description}</p>
            </header>

            <div className="modal-grid">
              <section>
                <h4>Utensilios</h4>
                <ul>
                  {selectedRecipe.utensils.map((u) => <li key={u}>{u}</li>)}
                </ul>
              </section>

              <section>
                <h4>Ingredientes</h4>
                <ul className="ings">
                  {selectedRecipe.ingredients.map((ing) => (
                    <li
                        key={`${ing.name}-${ing.amount}-${ing.unit}`}
                        className="ing"
                        onClick={() => {
                        const item = findIngredientByName(ingredientsData, ing.name);
                        if (item) setSelectedItem(item);
                      }}
                      title="Ver ingrediente"
                    >
                      <span>{ing.name}{ing.notes ? ` (${ing.notes})` : ''}</span>
                      <span className="amt">{ing.amount}{ing.unit}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="steps">
                <h4>Elaboracion</h4>
                <ol>
                  {recipeDetailedSteps(selectedRecipe).map((s, idx) => <li key={idx}>{s}</li>)}
                </ol>
              </section>

              <section>
                <h4>Tecnicas</h4>
                <div className="techs">
                  {selectedRecipe.techniques.map((id) => {
                    const t = findTechniqueById(techniquesData, id);
                    if (!t) return null;
                    return (
                      <button key={id} className="tech" onClick={() => setSelectedItem(t)} title="Ver tecnica">
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}

      <style jsx>{`
        .page-header { margin: 40px 0 30px; }
        .subtitle { opacity: 0.6; max-width: 900px; }
        .search-row { display: flex; gap: 12px; align-items: center; margin-top: 20px; }
        .search { flex: 1; padding: 14px 18px; border-radius: 14px; border: 1px solid var(--border); background: var(--card-bg); color: var(--foreground); outline: none; }
        .badge { padding: 10px 14px; border-radius: 14px; border: 1px solid var(--border); opacity: 0.8; font-weight: 800; letter-spacing: 1px; }

        .recipes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px; }
        .recipe-card { padding: 22px; border-radius: 22px; border: 1px solid var(--border); cursor: pointer; transition: 0.25s; }
        .recipe-card:hover { transform: translateY(-4px); border-color: var(--primary); box-shadow: var(--neon-shadow); }
        .recipe-card.locked { opacity: 0.6; filter: grayscale(1); cursor: default; }
        .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .tier { font-size: 0.7rem; font-weight: 900; padding: 4px 10px; border-radius: 8px; border: 1px solid var(--border); }
        .tier.free { opacity: 0.7; }
        .tier.pro { color: #00f2ff; border-color: rgba(0,242,255,0.4); }
        .tier.premium { color: #ff0055; border-color: rgba(255,0,85,0.4); }
        .meta { opacity: 0.5; font-size: 0.8rem; }
        h3 { margin: 8px 0; font-size: 1.1rem; }
        .desc { opacity: 0.65; line-height: 1.5; min-height: 48px; }
        .tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
        .tag { font-size: 0.75rem; padding: 6px 10px; border-radius: 999px; border: 1px solid var(--border); background: rgba(255,255,255,0.03); opacity: 0.8; }
        .open-btn { margin-top: 14px; width: 100%; padding: 12px; border-radius: 14px; border: 1px solid var(--border); background: rgba(var(--primary-rgb), 0.04); color: var(--foreground); font-weight: 800; cursor: pointer; }
        .locked-cta { margin-top: 12px; text-align: center; }
        .unlock-link { color: var(--primary); text-decoration: underline; font-weight: 800; }

        .more-lock { margin: 28px 0 0; padding: 22px; border-radius: 22px; border: 1px solid var(--border); text-align: center; }
        .upgrade { display: inline-block; margin-top: 12px; padding: 10px 16px; border-radius: 999px; background: var(--primary); color: white; font-weight: 900; text-decoration: none; }

        .recipe-overlay { position: fixed; inset: 0; background: var(--overlay-backdrop); backdrop-filter: blur(10px); z-index: 3000; display: flex; align-items: center; justify-content: center; padding: 16px; }
        .recipe-modal { width: 100%; max-width: 1100px; max-height: 90vh; overflow: auto; padding: 28px; border-radius: 24px; background: var(--modal-surface); color: var(--modal-text); position: relative; }
        .close { position: absolute; top: 14px; right: 14px; width: 42px; height: 42px; border-radius: 999px; border: 1px solid var(--modal-border); background: var(--modal-surface-2); color: var(--modal-text); cursor: pointer; font-size: 1.1rem; }
        .modal-head h2 { margin: 10px 0 6px; font-size: 2rem; }
        .modal-meta { display: flex; gap: 14px; flex-wrap: wrap; opacity: 0.7; font-size: 0.9rem; }
        .modal-desc { margin-top: 10px; opacity: 0.75; }
        .modal-grid { margin-top: 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .steps { grid-column: 1 / -1; }
        h4 { color: var(--primary); letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem; margin-bottom: 10px; }
        ul { margin: 0; padding-left: 18px; }
        .ings { padding-left: 0; list-style: none; }
        .ing { display: flex; justify-content: space-between; gap: 10px; padding: 10px 12px; border: 1px solid var(--modal-border); border-radius: 12px; margin-bottom: 8px; cursor: pointer; background: var(--modal-surface-2); }
        .ing:hover { border-color: rgba(var(--primary-rgb), 0.3); }
        .amt { opacity: 0.7; font-weight: 800; }
        .techs { display: flex; flex-wrap: wrap; gap: 10px; }
        .tech { padding: 10px 12px; border-radius: 999px; border: 1px solid rgba(var(--primary-rgb), 0.35); background: rgba(var(--primary-rgb), 0.1); color: var(--primary); font-weight: 900; cursor: pointer; }

        @media (max-width: 900px) {
          .modal-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
