'use client';

import { Ingredient } from '@/data/ingredients';
import { Technique } from '@/data/techniques';

interface DetailModalProps {
  item: Ingredient | Technique;
  onClose: () => void;
}

export default function DetailModal({ item, onClose }: DetailModalProps) {
  return (
    <div className="detail-modal-overlay animate-fadeIn" onClick={onClose}>
      <div className="detail-modal glass neon-border animate-slideUp" onClick={e => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>×</button>
        <div className="modal-content">
          <div className="modal-header">
            <span className="modal-category">
              {'family' in item ? item.family : item.category}
            </span>
            <h2 className="modal-title">{item.name}</h2>
            {'difficulty' in item && (
              <span className={`diff-tag ${item.difficulty.toLowerCase()}`}>
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
                  {item.equipment.map(e => <li key={e}>🛠️ {e}</li>)}
                </ul>
              </section>
            )}

            {'reagents' in item && item.reagents && item.reagents.length > 0 && (
              <section className="modal-section">
                <h4>REACTIVOS Y ADITIVOS</h4>
                <ul className="modal-list">
                  {item.reagents.map(r => <li key={r}>🧪 {r}</li>)}
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
          </div>
        </div>
      </div>

      <style jsx>{`
        .detail-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.9);
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
          background: #050505;
          border-radius: 40px;
          padding: 60px;
          position: relative;
          color: white;
          box-shadow: 0 0 100px rgba(0,0,0,0.5);
        }

        .close-modal {
          position: absolute;
          top: 30px;
          right: 30px;
          background: none;
          border: none;
          color: white;
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
        .close-modal:hover { opacity: 1; transform: rotate(90deg); background: rgba(255,255,255,0.05); }

        .modal-category { font-size: 0.8rem; letter-spacing: 4px; opacity: 0.5; text-transform: uppercase; color: var(--primary); font-weight: 800; }
        .modal-title { font-size: 4rem; margin: 10px 0; color: white; font-weight: 900; }
        .modal-section { margin-top: 50px; }
        .full-desc { font-size: 1.4rem; line-height: 1.6; opacity: 0.9; color: #ccc; }
        
        .full-pill-grid { display: flex; flex-wrap: wrap; gap: 10px; }
        .pill { padding: 6px 14px; border-radius: 30px; background: rgba(255,255,255,0.05); font-size: 0.85rem; border: 1px solid var(--border); }
        .pill.large { padding: 10px 20px; font-size: 1rem; }
        
        .modal-list { list-style: none; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .modal-list li { font-size: 1.1rem; opacity: 0.8; color: white; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 10px; }

        .stories-container { display: flex; flex-direction: column; gap: 20px; }
        .story-item { padding: 25px; border-radius: 20px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); }
        .story-with { font-weight: 900; color: var(--primary); font-size: 0.9rem; margin-bottom: 10px; display: block; }
        .story-text { font-size: 1.1rem; line-height: 1.6; opacity: 0.8; }

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
        }
      `}</style>
    </div>
  );
}
