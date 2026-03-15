'use client';

import { useState } from 'react';
import { ingredients, Ingredient } from '@/data/ingredients';
import { techniques, Technique } from '@/data/techniques';
import { ACCESS_CONFIGS, AccessLevel } from '@/data/access';
import Link from 'next/link';
import { useUserAuth } from '@/context/UserAuthContext';
import DetailModal from '@/components/DetailModal';

export default function Encyclopedia() {
  const { getEffectiveLevel } = useUserAuth();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'techniques'>('ingredients');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<Ingredient | Technique | null>(null);
  
  const userLevel = getEffectiveLevel();
  const config = ACCESS_CONFIGS[userLevel];

  const filteredIngredients = ingredients.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.family.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTechniques = techniques.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const families = Array.from(new Set(filteredIngredients.map(i => i.family)));

  const handleItemClick = (item: Ingredient | Technique, isLocked: boolean) => {
    if (!isLocked) {
      setSelectedItem(item);
    }
  };

  return (
    <div className="encyclopedia-page container">
      <header className="library-header">
        <div className="user-tier-badge">{userLevel === 'ADMIN' ? 'FULL MASTER ACCESS' : `${userLevel} ACCESS`}</div>
        <h1 className="neon-text">Omniscience Library</h1>
        <p className="description">
          Sinergias moleculares y protocolos de vanguardia. 
          {userLevel === 'FREE' && ' Actualiza a PRO para desbloquear el archivo completo.'}
        </p>

        <div className="search-bar-wrapper">
          <input 
            type="text" 
            placeholder={`Buscar en ${activeTab === 'ingredients' ? 'ingredientes...' : 'técnicas...'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input glass neon-border"
          />
        </div>

        <nav className="library-nav">
          <button className={`nav-btn ${activeTab === 'ingredients' ? 'active' : ''}`} onClick={() => setActiveTab('ingredients')}>
            INGREDIENTES ({config.features.ingredientsLimit === -1 ? ingredients.length : `${config.features.ingredientsLimit}/${ingredients.length}`})
          </button>
          <button className={`nav-btn ${activeTab === 'techniques' ? 'active' : ''}`} onClick={() => setActiveTab('techniques')}>
            TÉCNICAS ({config.features.techniquesLimit === -1 ? techniques.length : `${config.features.techniquesLimit}/${techniques.length}`})
          </button>
        </nav>
      </header>

      {activeTab === 'ingredients' ? (
        <div className="ingredients-view">
          {families.map(family => (
            <section key={family} className="family-section">
              <h2 className="section-divider">{family}</h2>
              <div className="grid">
                {filteredIngredients.filter(i => i.family === family).map((ingredient, index) => {
                  const isLocked = config.features.ingredientsLimit !== -1 && index >= config.features.ingredientsLimit;
                  
                  return (
                    <div 
                      key={ingredient.id} 
                      className={`card glass ${isLocked ? 'locked' : 'clickable'}`}
                      onClick={() => handleItemClick(ingredient, isLocked)}
                    >
                      {isLocked ? (
                        <div className="lock-overlay">
                          <span className="lock-icon">🔒</span>
                          <p>Disponible en PRO</p>
                          <Link href="/pricing" className="unlock-link">Desbloquear</Link>
                        </div>
                      ) : (
                        <>
                          <div className="card-head">
                            <span className="cat-tag">{ingredient.category}</span>
                            <h3>{ingredient.name}</h3>
                          </div>
                          <p className="desc">{ingredient.description}</p>
                          <div className="pairings-box">
                            <strong>Afinidades:</strong>
                            <div className="pill-container">
                              {ingredient.pairingNotes.slice(0, 3).map(p => <span key={p} className="pill">{p}</span>)}
                              {ingredient.pairingNotes.length > 3 && <span className="pill-more">+{ingredient.pairingNotes.length - 3}</span>}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="techniques-view">
          <div className="grid">
            {filteredTechniques.map((tech, index) => {
              const isLocked = config.features.techniquesLimit !== -1 && index >= config.features.techniquesLimit;

              return (
                <div 
                  key={tech.id} 
                  className={`card tech-card glass ${isLocked ? 'locked' : 'clickable'}`}
                  onClick={() => handleItemClick(tech, isLocked)}
                >
                   {isLocked ? (
                    <div className="lock-overlay">
                      <span className="lock-icon">🔒</span>
                      <p>Protocolo Premium</p>
                      <Link href="/pricing" className="unlock-link">Mejorar Cuenta</Link>
                    </div>
                  ) : (
                    <>
                      <div className="card-head">
                        <span className={`diff-tag ${tech.difficulty.toLowerCase()}`}>{tech.difficulty}</span>
                        <h3>{tech.name}</h3>
                      </div>
                      <p className="desc">{tech.description}</p>
                      <div className="pairing-notes">
                        <strong>Especialidad:</strong>
                        <div className="pill-container">
                          {tech.pairingNotes.map(n => <span key={n} className="pill primary">{n}</span>)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedItem && (
        <DetailModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}

      <style jsx>{`
        .encyclopedia-page { padding: 80px 20px; }
        .library-header { text-align: center; margin-bottom: 80px; position: relative; }
        .library-header h1 { font-size: 5rem; margin-bottom: 15px; }

        .tier-switcher { position: absolute; top: 0; right: 0; padding: 10px; border-radius: 15px; display: flex; gap: 10px; align-items: center; border: 1px solid var(--border); }
        .tier-switcher button { background: none; border: 1px solid var(--border); color: white; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.7rem; }
        .tier-switcher button.active { background: var(--primary); border-color: var(--primary); }
        .tier-switcher small { font-size: 0.6rem; opacity: 0.5; font-weight: 800; }

        .user-tier-badge { display: inline-block; background: var(--primary); color: white; padding: 4px 15px; border-radius: 20px; font-size: 0.7rem; font-weight: 800; margin-bottom: 20px; box-shadow: var(--neon-shadow); }
        .description { opacity: 0.6; max-width: 800px; margin: 0 auto 50px; font-size: 1.2rem; line-height: 1.6; }
        
        .search-input { width: 100%; max-width: 800px; padding: 25px 40px; border-radius: 50px; font-size: 1.2rem; color: white; outline: none; transition: var(--transition); background: rgba(255,255,255,0.03); }
        .search-input:focus { box-shadow: 0 0 40px var(--primary-glow); border-color: var(--primary); }
        
        .library-nav { display: flex; justify-content: center; gap: 30px; margin-top: 50px; }
        .nav-btn { background: none; border: 1px solid var(--border); color: var(--foreground); padding: 15px 35px; border-radius: 40px; font-weight: 800; letter-spacing: 1px; cursor: pointer; transition: var(--transition); }
        .nav-btn.active { background: var(--primary); color: white; border-color: var(--primary); box-shadow: var(--neon-shadow); }
        
        .section-divider { font-size: 1.8rem; margin: 60px 0 30px; text-transform: uppercase; letter-spacing: 5px; color: var(--primary); border-bottom: 1px solid var(--border); padding-bottom: 15px; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 30px; }
        .card { padding: 40px; border-radius: 30px; border: 1px solid var(--border); transition: var(--transition); display: flex; flex-direction: column; position: relative; min-height: 320px; }
        .clickable { cursor: pointer; }
        .card:not(.locked):hover { transform: translateY(-10px); border-color: var(--primary); box-shadow: var(--neon-shadow); }
        
        .locked { filter: grayscale(1) opacity(0.5); overflow: hidden; }
        .lock-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.8); z-index: 10; padding: 20px; text-align: center; }
        .lock-icon { font-size: 2.5rem; margin-bottom: 15px; display: block; }
        .unlock-link { margin-top: 15px; color: var(--primary) !important; text-decoration: underline; font-weight: 700; cursor: pointer; pointer-events: auto; }

        .cat-tag { font-size: 0.7rem; font-weight: 900; text-transform: uppercase; opacity: 0.5; letter-spacing: 2px; }
        h3 { font-size: 2.2rem; margin: 10px 0 20px; }
        .desc { font-size: 1.05rem; line-height: 1.7; opacity: 0.8; margin-bottom: 30px; }
        
        h4 { font-size: 0.8rem; letter-spacing: 2px; color: var(--primary); margin-bottom: 20px; }
        .pill-container, .full-pill-grid { display: flex; flex-wrap: wrap; gap: 10px; }
        .pill { padding: 6px 14px; border-radius: 30px; background: rgba(255,255,255,0.05); font-size: 0.85rem; border: 1px solid var(--border); }
        .pill.large { padding: 10px 20px; font-size: 1rem; }
        .pill.primary { border-color: var(--primary); color: var(--primary); }
        .pill-more { font-size: 0.8rem; opacity: 0.5; align-self: center; }
        
        .diff-tag { font-size: 0.7rem; padding: 4px 12px; border-radius: 5px; font-weight: 900; display: inline-block; margin-top: 10px; }
        .maestro { background: #ff0055; color: white; }
        .avanzado { background: #ff4d00; color: white; }
        .intermedio { background: #00f2ff; color: #000; }
        .basico { background: #00ff88; color: #000; }

        @media (max-width: 768px) {
          .library-header h1 { font-size: 3rem; }
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
