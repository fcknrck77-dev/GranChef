'use client';

import { useState } from 'react';
import { recipes, Recipe } from '@/data/recipes';
import { ingredients, Ingredient } from '@/data/ingredients';
import { techniques, Technique } from '@/data/techniques';
import { ACCESS_CONFIGS, AccessLevel } from '@/data/access';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Link from 'next/link';
import DetailModal from '@/components/DetailModal';

export default function RecipesPage() {
  const { isAdmin } = useAdminAuth();
  const [simulatedLevel, setSimulatedLevel] = useState<AccessLevel>('FREE');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedItem, setSelectedItem] = useState<Ingredient | Technique | null>(null);

  const userLevel = isAdmin ? 'ADMIN' : simulatedLevel;
  const config = ACCESS_CONFIGS[userLevel];
  const recipesLimit = isAdmin ? -1 : config.features.recipesLimit;
  const visibleRecipes = recipesLimit === -1 ? recipes : recipes.slice(0, recipesLimit);
  const hasMoreRecipes = recipesLimit !== -1 && recipes.length > recipesLimit;

  const canAccess = (tier: 'FREE' | 'PRO' | 'PREMIUM') => {
    if (userLevel === 'ADMIN') return true;
    if (tier === 'FREE') return true;
    if (tier === 'PRO') return userLevel === 'PRO' || userLevel === 'PREMIUM';
    if (tier === 'PREMIUM') return userLevel === 'PREMIUM';
    return false;
  };

  const findIngredient = (name: string) => ingredients.find(i => i.name.toLowerCase() === name.toLowerCase());
  const findTechnique = (id: string) => techniques.find(t => t.id === id);

  return (
    <div className="recipes-page container">
      <header className="page-header">
        {!isAdmin && (
          <div className="tier-switcher glass">
            <small>MODO DEMO:</small>
            <button onClick={() => setSimulatedLevel('FREE')} className={simulatedLevel === 'FREE' ? 'active' : ''}>FREE</button>
            <button onClick={() => setSimulatedLevel('PRO')} className={simulatedLevel === 'PRO' ? 'active' : ''}>PRO</button>
            <button onClick={() => setSimulatedLevel('PREMIUM')} className={simulatedLevel === 'PREMIUM' ? 'active' : ''}>PREMIUM</button>
          </div>
        )}
        <h1 className="neon-text">Protocolos de Ejecución</h1>
        <p className="subtitle">Algoritmos culinarios extraídos de la biblioteca "Omniscience".</p>
      </header>

      <div className="recipes-grid">
        {visibleRecipes.map(recipe => {
          const locked = !canAccess(recipe.tier);
          return (
            <div key={recipe.id} className={`recipe-card glass ${locked ? 'locked' : ''}`} onClick={() => !locked && setSelectedRecipe(recipe)}>
              <div className="card-header">
                <span className={`tier-badge ${recipe.tier.toLowerCase()}`}>{recipe.tier}</span>
                <span className="source-label">{recipe.source}</span>
              </div>
              
              <div className="card-body">
                <h3>{recipe.title}</h3>
                <p className="recipe-desc">{recipe.description}</p>
                
                <div className="recipe-meta">
                  <span>Dificultad: {recipe.difficulty}</span>
                  <span>Tiempo: {recipe.prepTime}</span>
                </div>

                {locked ? (
                  <div className="locked-action">
                    <span className="lock-mini">🔒</span>
                    <Link href="/pricing" className="unlock-link">Desbloquear Nivel {recipe.tier}</Link>
                  </div>
                ) : (
                  <button className="view-recipe-btn">Ver Protocolo Completo</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasMoreRecipes && (
        <div className="lock-overlay glass animate-fadeIn" style={{ marginTop: 40 }}>
          <div className="lock-content">
            <span className="lock-icon">🔒</span>
            <h2>CONTENIDO ADICIONAL BLOQUEADO</h2>
            <p>Tu plan actual muestra <strong>{recipesLimit}</strong> protocolos. Evoluciona a <strong>PRO</strong> o <strong>PREMIUM</strong> para desbloquear el archivo completo.</p>
            <Link href="/pricing" className="upgrade-btn">Evolucionar Cuenta</Link>
          </div>
        </div>
      )}

      {selectedRecipe && (
        <div className="recipe-detail-overlay animate-fadeIn" onClick={() => setSelectedRecipe(null)}>
          <div className="recipe-detail-modal glass neon-border animate-slideUp" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedRecipe(null)}>×</button>
            
            <div className="recipe-modal-header">
              <span className="recipe-source">{selectedRecipe.source}</span>
              <h2 className="recipe-title">{selectedRecipe.title}</h2>
              <div className="recipe-meta-row">
                <span className="meta-pill">{selectedRecipe.difficulty}</span>
                <span className="meta-pill">{selectedRecipe.prepTime}</span>
              </div>
            </div>

            <div className="recipe-modal-grid">
              <div className="recipe-col">
                <section className="recipe-section">
                  <h4>MATERIA PRIMA (CLIC PARA INFO)</h4>
                  <ul className="ingredient-list">
                    {selectedRecipe.ingredients.map((ing, idx) => {
                      const ingData = findIngredient(ing.name);
                      return (
                        <li key={idx} className={ingData ? 'clickable' : ''} onClick={() => ingData && setSelectedItem(ingData)}>
                          <span className="ing-amount">{ing.amount}</span>
                          <span className="ing-name">{ing.name} {ingData && 'ℹ️'}</span>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                <section className="recipe-section">
                  <h4>TECNOLOGÍAS APLICADAS</h4>
                  <div className="tech-pills">
                    {selectedRecipe.techStack.map(techId => {
                      const tech = findTechnique(techId);
                      return tech ? (
                        <span key={techId} className="tech-pill clickable" onClick={() => setSelectedItem(tech)}>
                          {tech.name} ℹ️
                        </span>
                      ) : null;
                    })}
                  </div>
                </section>
              </div>

              <div className="recipe-col">
                <section className="recipe-section">
                  <h4>ALGORITMO DE PREPARACIÓN</h4>
                  <ol className="step-list">
                    {selectedRecipe.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      <style jsx>{`
        .recipes-page { padding: 120px 20px; min-height: 100vh; }
        .page-header { text-align: center; margin-bottom: 80px; }
        .neon-text { font-size: 3.5rem; margin-bottom: 10px; }
        .subtitle { opacity: 0.6; font-size: 1.2rem; letter-spacing: 1px; }

        .tier-switcher { display: inline-flex; align-items: center; gap: 10px; padding: 10px 20px; border-radius: 50px; margin-bottom: 30px; }
        .tier-switcher button { background: none; border: 1px solid transparent; color: white; padding: 5px 15px; border-radius: 20px; cursor: pointer; transition: 0.3s; font-size: 0.8rem; font-weight: 800; }
        .tier-switcher button.active { background: var(--primary); border-color: var(--primary); box-shadow: var(--neon-shadow); }

        .recipes-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px; transition: 0.5s; }
        .recipes-grid.blurred { filter: blur(10px); pointer-events: none; }

        .lock-overlay { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 10; background: rgba(0,0,0,0.4); backdrop-filter: blur(5px); }
        .lock-content { text-align: center; padding: 60px; border-radius: 40px; border: 1px solid var(--border); max-width: 500px; }
        .lock-icon { font-size: 4rem; display: block; margin-bottom: 20px; }
        .upgrade-btn { display: inline-block; margin-top: 30px; padding: 15px 40px; background: var(--primary); color: white; border-radius: 50px; text-decoration: none; font-weight: 900; box-shadow: var(--neon-shadow); }

        .recipe-card { border-radius: 30px; border: 1px solid var(--border); overflow: hidden; transition: 0.3s; cursor: pointer; position: relative; }
        .recipe-card:hover:not(.locked) { transform: translateY(-10px); border-color: var(--primary); box-shadow: 0 10px 30px rgba(0, 242, 255, 0.1); }
        .recipe-card.locked { opacity: 0.6; grayscale: 1; filter: grayscale(1); }

        .card-header { padding: 25px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); }
        .tier-badge { font-size: 0.7rem; font-weight: 900; padding: 4px 10px; border-radius: 5px; }
        .tier-badge.pro { background: rgba(0,242,255,0.1); color: #00f2ff; }
        .tier-badge.premium { background: rgba(255,0,85,0.1); color: #ff0055; }
        .source-label { font-size: 0.7rem; opacity: 0.4; text-transform: uppercase; letter-spacing: 1px; }

        .card-body { padding: 30px; }
        h3 { font-size: 1.4rem; margin-bottom: 15px; }
        .recipe-desc { font-size: 0.9rem; opacity: 0.6; line-height: 1.6; height: 80px; overflow: hidden; margin-bottom: 25px; }
        
        .recipe-meta { display: flex; gap: 20px; font-size: 0.8rem; font-weight: 700; opacity: 0.4; margin-bottom: 30px; }

        .view-recipe-btn { width: 100%; padding: 15px; border-radius: 15px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: white; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .view-recipe-btn:hover { background: var(--primary); border-color: var(--primary); }

        .locked-action { text-align: center; padding-top: 10px; }
        .unlock-link { color: var(--primary); font-size: 0.8rem; font-weight: 800; text-decoration: underline; }
        .lock-mini { margin-right: 8px; }

        /* Recipe Modal */
        .recipe-detail-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(15px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .recipe-detail-modal { width: 100%; max-width: 1100px; max-height: 90vh; overflow-y: auto; background: #050505; border-radius: 40px; padding: 60px; position: relative; color: white; }
        
        .close-modal { position: absolute; top: 30px; right: 30px; background: none; border: none; color: white; font-size: 2rem; cursor: pointer; opacity: 0.5; transition: 0.3s; }
        .close-modal:hover { opacity: 1; transform: rotate(90deg); }

        .recipe-source { font-size: 0.8rem; opacity: 0.5; letter-spacing: 3px; text-transform: uppercase; }
        .recipe-title { font-size: 3rem; margin: 15px 0; font-weight: 900; line-height: 1.1; }
        .recipe-meta-row { display: flex; gap: 15px; margin-bottom: 40px; }
        .meta-pill { padding: 5px 15px; border-radius: 20px; border: 1px solid var(--border); font-size: 0.8rem; font-weight: 700; opacity: 0.6; }

        .recipe-modal-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 60px; }
        .recipe-section h4 { font-size: 0.8rem; letter-spacing: 2px; color: var(--primary); margin-bottom: 25px; }

        .ingredient-list { list-style: none; padding: 0; }
        .ingredient-list li { padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; font-size: 1.1rem; }
        .clickable { cursor: pointer; transition: 0.2s; }
        .clickable:hover { color: var(--primary); padding-left: 5px; }
        .ing-amount { opacity: 0.5; font-weight: 300; }

        .tech-pills { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px; }
        .tech-pill { padding: 8px 18px; border-radius: 30px; background: rgba(var(--primary-rgb), 0.1); border: 1px solid var(--primary); color: var(--primary); font-size: 0.9rem; font-weight: 700; }
        .tech-pill:hover { background: var(--primary); color: black; }

        .step-list { padding-left: 20px; }
        .step-list li { margin-bottom: 20px; font-size: 1.1rem; line-height: 1.7; opacity: 0.8; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease; }
        .animate-slideUp { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }

        @media (max-width: 900px) {
          .recipe-modal-grid { grid-template-columns: 1fr; }
          .recipe-detail-modal { padding: 30px; }
          .recipe-title { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
}
