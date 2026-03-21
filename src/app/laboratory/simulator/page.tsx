'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useUserAuth } from '@/context/UserAuthContext';

export default function MolecularSimulator() {
  const { authState, getEffectiveLevel } = useUserAuth();
  const [activeAtom, setActiveAtom] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const atoms = [
    { id: 'C', name: 'Carbono', color: '#1a1a1a', info: 'Base de las moléculas orgánicas.' },
    { id: 'H', name: 'Hidrógeno', color: '#ffffff', info: 'Presente en todas las grasas y azúcares.' },
    { id: 'O', name: 'Oxígeno', color: '#ff4444', info: 'Crucial para la oxidación y frescura.' },
    { id: 'N', name: 'Nitrógeno', color: '#3366ff', info: 'Base de las proteínas y aromas complejos.' }
  ];

  if (getEffectiveLevel() === 'FREE') {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-3xl font-black mb-4">Módulo de Simulación 3D Retenido</h2>
        <p className="text-zinc-500 mb-8">Este nivel de precisión molecular requiere una cuenta PRO o PREMIUM.</p>
        <button className="px-10 py-4 bg-primary text-black font-black rounded-full uppercase tracking-widest shadow-2xl">
          Subir de Nivel
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="container relative z-10 py-10">
        <header className="mb-12">
          <h1 className="text-6xl font-black tracking-tighter mb-2 italic">Ubi-Sim <span className="text-primary">3D</span></h1>
          <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Simulación de Geometría Molecular Gastronómica</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[70vh]">
          
          {/* Controls Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="glass p-6 rounded-3xl border-white/10">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-6">Componentes Atómicos</h3>
              <div className="grid grid-cols-2 gap-4">
                {atoms.map(atom => (
                  <button 
                    key={atom.id}
                    onClick={() => setActiveAtom(atom.id)}
                    className={`h-24 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 ${
                      activeAtom === atom.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl font-black">{atom.id}</span>
                    <span className="text-[10px] uppercase font-bold opacity-60">{atom.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass p-6 rounded-3xl border-white/10">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-4">Información del Enlace</h3>
              {activeAtom ? (
                <div className="animate-in fade-in duration-500">
                  <div className="text-primary font-black text-lg mb-2">{atoms.find(a => a.id === activeAtom)?.name}</div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{atoms.find(a => a.id === activeAtom)?.info}</p>
                </div>
              ) : (
                <p className="text-xs text-zinc-600 italic">Selecciona un elemento para ver su impacto molecular.</p>
              )}
            </div>

            <button className="w-full py-5 bg-primary text-black font-black rounded-3xl uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform active:scale-95">
              Generar Isómeros
            </button>
          </aside>

          {/* Canvas Area */}
          <div className="lg:col-span-3 glass rounded-[40px] border-white/10 relative overflow-hidden group">
            {/* Mocked 3D Scene */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-96 h-96 animate-slow-spin">
                {/* Nucleus */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary blur-md rounded-full shadow-[0_0_80px_rgba(200,255,0,0.5)]" />
                
                {/* Orbit 1 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/10 rounded-full rotate-45 transform-style-3d">
                   <div className="absolute top-0 left-1/2 w-4 h-4 bg-white rounded-full -translate-x-1/2 shadow-[0_0_15px_white]" />
                </div>

                {/* Orbit 2 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/5 rounded-full -rotate-12 transform-style-3d">
                   <div className="absolute bottom-0 left-1/2 w-6 h-6 bg-primary rounded-full -translate-x-1/2 shadow-[0_0_20px_var(--primary)]" />
                </div>
              </div>

              {/* HUD UI */}
              <div className="absolute top-10 left-10 pointer-events-none">
                 <div className="text-[10px] font-black tracking-widest text-primary/50 mb-2 uppercase">Rendering Engine</div>
                 <div className="flex gap-1">
                   {[...Array(10)].map((_, i) => <div key={i} className="w-1 h-3 bg-primary/20 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />)}
                 </div>
              </div>
            </div>

            {/* Interactions */}
            <div className="absolute bottom-10 left-10 flex gap-4">
              <div className="px-4 py-2 bg-white/5 rounded-full text-[10px] border border-white/10 uppercase tracking-widest font-black">Escala: 1:1,000,000</div>
              <div className="px-4 py-2 bg-white/5 rounded-full text-[10px] border border-white/10 uppercase tracking-widest font-black">Estabilidad: 98.4%</div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .glass { background: rgba(255,255,255,0.02); backdrop-filter: blur(40px); }
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-slow-spin { animation: slow-spin 20s linear infinite; }
        .transform-style-3d { transform-style: preserve-3d; }
      `}</style>
    </div>
  );
}
