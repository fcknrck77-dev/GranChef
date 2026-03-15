'use client';

import { useState } from 'react';
import { ingredients, Ingredient } from '@/data/ingredients';
import { techniques, Technique } from '@/data/techniques';
import { ACCESS_CONFIGS, AccessLevel } from '@/data/access';
import Link from 'next/link';
import DetailModal from '@/components/DetailModal';
import LockedOverlay from '@/components/LockedOverlay';
import { useUserAuth } from '@/context/UserAuthContext';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function Laboratory() {
  const { getEffectiveLevel, authState, openAuthModal } = useUserAuth();
  const [slotA, setSlotA] = useState<Ingredient | null>(null);
  const [slotB, setSlotB] = useState<Ingredient | null>(null);
  const [slotTech, setSlotTech] = useState<Technique | null>(null);
  const [isMixing, setIsMixing] = useState(false);
  const [result, setResult] = useState<{ title: string; text: string; type: 'success' | 'experiment' | 'discovery' | 'fiasco' } | null>(null);
  const [selectedItem, setSelectedItem] = useState<Ingredient | Technique | null>(null);
  
  const userLevel = getEffectiveLevel();
  const { isAdmin } = useAdminAuth();
  const config = ACCESS_CONFIGS[isAdmin ? 'PREMIUM' : userLevel];
  const ingLimit = isAdmin ? 999 : config.features.ingredientsLimit;
  const techLimit = isAdmin ? 999 : config.features.techniquesLimit;

  // Show ALL items but mark which are locked
  const availableIngredients = ingredients;
  const availableTechniques = techniques;

  const handleMix = () => {
    if (!slotA || !slotB) return;
    setIsMixing(true);
    setResult(null);
    
    setTimeout(() => {
      setIsMixing(false);
      
      const storyA = slotA.stories?.[slotB.name];
      const storyB = slotB.stories?.[slotA.name];
      const story = storyA || storyB;

      const isCompatible = slotA.pairingNotes.includes(slotB.name) || slotB.pairingNotes.includes(slotA.name);
      
      const techBonus = slotTech ? slotTech.pairingNotes.some(p => 
        slotA.name.toLowerCase().includes(p.toLowerCase()) || 
        slotB.name.toLowerCase().includes(p.toLowerCase()) ||
        slotA.family.toLowerCase().includes(p.toLowerCase())
      ) : false;

      if (slotTech && !techBonus && Math.random() > 0.7) {
        setResult({
          title: "¡Inestabilidad Molecular!",
          text: `La técnica de ${slotTech.name} ha colapsado. La estructura de ${slotA.name} no ha soportado el proceso químico. Resultado inestable.`,
          type: 'fiasco'
        });
        return;
      }

      if (story) {
        setResult({
          title: techBonus ? "¡Obra Maestra Vanguardista!" : "¡Sinergia Descubierta!",
          text: techBonus 
            ? `Elevando la combinación: ${story}. Los equipos de ${slotTech?.equipment.join(' y ')} han optimizado la textura.`
            : story,
          type: 'discovery'
        });
      } else if (isCompatible) {
        setResult({
          title: techBonus ? "Textura Revolucionaria" : "Afinidad Confirmada",
          text: techBonus
            ? `La técnica ${slotTech?.name} ha servido como puente perfecto. Una ejecución técnica impecable.`
            : `${slotA.name} y ${slotB.name} presentan una alta compatibilidad aromática.`,
          type: 'success'
        });
      } else {
        setResult({
          title: "Anomalía de Sabor",
          text: `${slotA.name} y ${slotB.name} presentan perfiles discordantes. Requieres un agente de puente molecular.`,
          type: 'experiment'
        });
      }
    }, 2000);
  };

  return (
    <div className="laboratory-page container">
      <header className="lab-header">
        <h1 className="neon-text">Precision Lab</h1>
        <p className="subtitle">Simulador de Sinergias Moleculares ({userLevel})</p>
      </header>

      <div className="lab-interface">
        <div className="simulation-zone">
          <div className="slots-wrapper">
            <div className={`slot ingredient-slot ${slotA ? 'filled' : ''}`} onClick={() => slotA ? setSlotA(null) : null}>
              {slotA ? (
                <div className="node active animate-pop">
                  <span className="node-family">{slotA.family}</span>
                  <span className="node-name">{slotA.name}</span>
                  <button className="info-icon-btn" onClick={(e) => { e.stopPropagation(); setSelectedItem(slotA); }}>ℹ️</button>
                </div>
              ) : (
                <div className="placeholder">Ingrediente A</div>
              )}
            </div>

            <div className="mix-column">
              <div className={`tech-slot ${slotTech ? 'filled' : ''}`} onClick={() => slotTech ? setSlotTech(null) : null}>
                {slotTech ? (
                  <div className="tech-node active animate-pop">
                    <span className="tech-cat">{slotTech.category}</span>
                    <div className="tech-name">{slotTech.name}</div>
                    <button className="info-icon-btn small" onClick={(e) => { e.stopPropagation(); setSelectedItem(slotTech); }}>ℹ️</button>
                  </div>
                ) : (
                  <div className="placeholder-tech">¿Técnica?</div>
                )}
              </div>

              <div className={`mix-controller ${isMixing ? 'is-active' : ''}`}>
                <button 
                  className={`mix-core ${isMixing ? 'reacting' : ''}`} 
                  onClick={handleMix}
                  disabled={!slotA || !slotB || isMixing}
                >
                  {isMixing ? '⚛️' : 'MIX'}
                </button>
              </div>
            </div>

            <div className={`slot ingredient-slot ${slotB ? 'filled' : ''}`} onClick={() => slotB ? setSlotB(null) : null}>
              {slotB ? (
                <div className="node active animate-pop">
                  <span className="node-family">{slotB.family}</span>
                  <span className="node-name">{slotB.name}</span>
                  <button className="info-icon-btn" onClick={(e) => { e.stopPropagation(); setSelectedItem(slotB); }}>ℹ️</button>
                </div>
              ) : (
                <div className="placeholder">Ingrediente B</div>
              )}
            </div>
          </div>

          {(slotA && slotB) && (
            <div className="stability-predictor animate-fadeIn">
              <div className="predictor-header">
                <span>ESTABILIDAD MOLECULAR ESTIMADA</span>
                <span className="stability-value">
                  {slotTech ? (
                    slotTech.pairingNotes.some(p => 
                      slotA.name.toLowerCase().includes(p.toLowerCase()) || 
                      slotB.name.toLowerCase().includes(p.toLowerCase()) ||
                      slotA.family.toLowerCase().includes(p.toLowerCase())
                    ) ? 'ÓPTIMA' : 'RIESGO'
                  ) : (
                    (slotA.pairingNotes.includes(slotB.name) || slotB.pairingNotes.includes(slotA.name)) ? 'ESTABLE' : 'INCIERTA'
                  )}
                </span>
              </div>
              <div className="stability-bar-bg">
                <div className={`stability-bar ${
                  slotTech ? (
                    slotTech.pairingNotes.some(p => 
                      slotA.name.toLowerCase().includes(p.toLowerCase()) || 
                      slotB.name.toLowerCase().includes(p.toLowerCase()) ||
                      slotA.family.toLowerCase().includes(p.toLowerCase())
                    ) ? 'optimal' : 'risk'
                  ) : (
                    (slotA.pairingNotes.includes(slotB.name) || slotB.pairingNotes.includes(slotA.name)) ? 'stable' : 'uncertain'
                  )
                }`}></div>
              </div>
            </div>
          )}
        </div>

        {result && (
          <div className={`analysis-panel glass neon-border ${result.type}`}>
            <div className="panel-badge">{result.type.toUpperCase()} REPORT</div>
            <h3>{result.title}</h3>
            <p className="analysis-text">{result.text}</p>
            <div className="panel-footer">
              <span className="timestamp">ID_LAB_{Math.floor(Math.random()*9999)}</span>
              <button className="save-btn">Guardar en Cuaderno</button>
            </div>
          </div>
        )}

        <div className="inventory-tabs">
          <div className="tab-section">
            <h3 className="tab-title">
              INGREDIENTES ({ingLimit}/{ingredients.length}) — NIVEL {userLevel}
            </h3>
            <div className="inventory-grid">
              {availableIngredients.map((ing, idx) => {
                const isLocked = idx >= ingLimit;
                const requiredTier = idx < 25 ? 'PRO' : 'PREMIUM';
                return (
                  <div key={ing.id} className="inv-btn-container" style={{ position: 'relative' }}>
                    <button
                      className={`inv-btn ${slotA?.id === ing.id || slotB?.id === ing.id ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                      style={isLocked ? { pointerEvents: 'none', userSelect: 'none' } : {}}
                      onClick={() => {
                        if (!slotA) setSlotA(ing);
                        else if (!slotB) setSlotB(ing);
                        else { setSlotA(ing); setSlotB(null); setResult(null); }
                      }}
                    >
                      <span className="dot"></span>
                      {ing.name}
                    </button>
                    {!isLocked && <button className="inv-info-btn" onClick={() => setSelectedItem(ing)}>ℹ️</button>}
                    {isLocked && <LockedOverlay requiredTier={requiredTier as 'PRO' | 'PREMIUM'} onUnlock={() => !authState.isRegistered ? openAuthModal() : window.location.href='/pricing'} />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="tab-section special">
            <h3 className="tab-title">TÉCNICAS ({techLimit}/{techniques.length}) — NIVEL {userLevel}</h3>
            <div className="inventory-grid">
              {availableTechniques.map((tech, idx) => {
                const isLocked = idx >= techLimit;
                return (
                  <div key={tech.id} className="inv-btn-container" style={{ position: 'relative' }}>
                    <button
                      className={`tech-btn ${slotTech?.id === tech.id ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
                      style={isLocked ? { pointerEvents: 'none', userSelect: 'none' } : {}}
                      onClick={() => setSlotTech(tech)}
                    >
                      {tech.name}
                    </button>
                    {!isLocked && <button className="inv-info-btn" onClick={() => setSelectedItem(tech)}>ℹ️</button>}
                    {isLocked && <LockedOverlay requiredTier="PREMIUM" onUnlock={() => !authState.isRegistered ? openAuthModal() : window.location.href='/pricing'} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {selectedItem && (
        <DetailModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}

      <style jsx>{`
        .laboratory-page { padding: 80px 20px; position: relative; }
        .lab-header { text-align: center; margin-bottom: 80px; position: relative; }
        
        .tier-switcher { position: absolute; top: 0; left: 0; padding: 10px; border-radius: 15px; display: flex; gap: 10px; align-items: center; border: 1px solid var(--border); }
        .tier-switcher button { background: none; border: 1px solid var(--border); color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.7rem; }
        .tier-switcher button.active { background: var(--primary); border-color: var(--primary); }
        .tier-switcher small { font-size: 0.6rem; opacity: 0.5; font-weight: 800; }

        .subtitle { opacity: 0.5; letter-spacing: 4px; font-size: 0.8rem; text-transform: uppercase; margin-top: 10px; }
        .slots-wrapper { display: flex; align-items: center; justify-content: center; gap: 40px; }
        
        .slot, .tech-slot { border-radius: 20px; border: 1px solid var(--border); background: rgba(255,255,255,0.02); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
        .ingredient-slot { width: 220px; height: 220px; }
        .tech-slot { width: 180px; height: 100px; margin-bottom: 30px; }
        .filled { border-color: var(--primary); box-shadow: var(--neon-shadow); }
        
        .node.active .node-name { font-size: 1.5rem; font-weight: 900; color: var(--primary); display: block; }
        .node-family, .tech-cat { display: block; font-size: 0.7rem; opacity: 0.5; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 5px; }
        .node-name, .tech-name { font-size: 1.4rem; font-weight: 900; color: var(--primary); display: block; line-height: 1.1; }

        .mix-column { display: flex; flex-direction: column; align-items: center; }
        .mix-core { width: 100px; height: 100px; border-radius: 50%; border: 4px solid var(--primary); background: none; color: white; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: all 0.5s ease; box-shadow: 0 0 20px var(--primary-glow); }
        .mix-core:disabled { opacity: 0.3; filter: grayscale(1); }

        .stability-predictor { margin-top: 40px; width: 100%; max-width: 600px; margin-inline: auto; }
        .predictor-header { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 0.75rem; font-weight: 800; letter-spacing: 2px; }
        .stability-value { color: var(--primary); }
        .stability-bar-bg { width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
        .stability-bar { height: 100%; width: 0; transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .stability-bar.optimal { width: 100%; background: #00ff88; box-shadow: 0 0 15px #00ff88; }
        .stability-bar.stable { width: 75%; background: var(--primary); }
        .stability-bar.uncertain { width: 40%; background: #ffaa00; }
        .stability-bar.risk { width: 20%; background: #ff0000; box-shadow: 0 0 15px #ff0000; }

        .analysis-panel { margin-top: 60px; padding: 40px; border-radius: 30px; border: 1px solid var(--border); animation: slideUp 0.5s ease out; }
        .panel-badge { font-size: 0.7rem; font-weight: 900; color: var(--primary); margin-bottom: 20px; letter-spacing: 2px; }
        .analysis-text { line-height: 1.8; opacity: 0.8; font-size: 1.1rem; }

        .inventory-tabs { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; margin-top: 80px; }
        .tab-title { font-size: 0.8rem; letter-spacing: 2px; margin-bottom: 30px; opacity: 0.5; }
        .inventory-grid { display: flex; flex-wrap: wrap; gap: 10px; }
        
        .inv-btn-container { display: flex; gap: 5px; align-items: stretch; }
        .inv-btn, .tech-btn { padding: 12px 25px; border-radius: 12px; border: 1px solid var(--border); background: var(--card-bg); color: var(--foreground); cursor: pointer; font-size: 0.9rem; transition: var(--transition); font-weight: 600; flex: 1; text-align: left; }
        .inv-btn:hover, .tech-btn:hover { border-color: var(--primary); transform: translateY(-3px); background: rgba(var(--primary-rgb), 0.05); }
        .inv-btn.active, .tech-btn.active { background: var(--primary); border-color: var(--primary); color: white; box-shadow: var(--neon-shadow); }

        .inv-info-btn { 
          background: rgba(255,255,255,0.05); 
          border: 1px solid var(--border); 
          color: white; 
          border-radius: 10px; 
          width: 40px; 
          cursor: pointer; 
          transition: 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }
        .inv-info-btn:hover { background: var(--primary); border-color: var(--primary); color: white; }

        .info-icon-btn {
          position: absolute;
          top: -15px;
          right: -15px;
          background: var(--primary);
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          box-shadow: 0 0 10px var(--primary-glow);
          z-index: 5;
        }
        .info-icon-btn.small { top: -10px; right: -10px; width: 25px; height: 25px; }
        .info-icon-btn:hover { transform: scale(1.1); }

        .upgrade-inv-btn { padding: 12px 25px; border-radius: 12px; border: 1px dashed var(--primary); color: var(--primary); cursor: pointer; font-size: 0.9rem; text-decoration: none; font-weight: 800; display: flex; align-items: center; background: none; }
        .upgrade-inv-btn:hover { background: rgba(var(--primary-rgb), 0.05); }

        @keyframes pop {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .slots-wrapper { flex-direction: column; }
          .inventory-tabs { grid-template-columns: 1fr; }
          .tier-switcher { position: static; margin-bottom: 20px; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
