'use client';

import React, { useState, useEffect } from 'react';
import { useUserAuth } from '@/context/UserAuthContext';
import { getSupabase } from '@/lib/supabaseClient';

export default function FichasTecnicasPage() {
  const { authState, getEffectiveLevel } = useUserAuth();
  const [ficha, setFicha] = useState({
    title: '',
    description: '',
    prep_time: 20,
    cook_time: 15,
    serving_temp: 'Caliente',
    storage: 'Refrigerado 3-5 días',
    allergens: [] as string[],
    steps: ['']
  });
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const level = getEffectiveLevel();
  const ALLERGEN_LIST = ['Gluten', 'Crustáceos', 'Huevos', 'Pescado', 'Cacahuetes', 'Soja', 'Lácteos', 'Frutos de cáscara', 'Apio', 'Mostaza', 'Sésamo', 'Sulfitos', 'Altramuces', 'Moluscos'];

  useEffect(() => {
    if (authState.id) fetchHistory();
  }, [authState.id]);

  const fetchHistory = async () => {
    const bus = getSupabase('BUSINESS');
    if (!bus) return;
    const { data } = await bus.from('technical_sheets').select('*').eq('user_id', authState.id).order('created_at', { ascending: false });
    if (data) setHistory(data);
  };

  const addStep = () => setFicha({ ...ficha, steps: [...ficha.steps, ''] });
  const updateStep = (i: number, val: string) => {
    const s = [...ficha.steps]; s[i] = val;
    setFicha({ ...ficha, steps: s });
  };
  const toggleAllergen = (a: string) => {
    const s = ficha.allergens.includes(a) ? ficha.allergens.filter(x => x !== a) : [...ficha.allergens, a];
    setFicha({ ...ficha, allergens: s });
  };

  const save = async () => {
    if (!ficha.title) return alert('Ponle un título a la ficha');
    setIsLoading(true);
    const bus = getSupabase('BUSINESS');
    if (bus && authState.id) {
       await bus.from('technical_sheets').insert({
         user_id: authState.id,
         title: ficha.title,
         description: ficha.description,
         prep_time_minutes: ficha.prep_time,
         cooking_time_minutes: ficha.cook_time,
         serving_temp: ficha.serving_temp,
         storage_notes: ficha.storage,
         allergens: ficha.allergens,
         steps: ficha.steps
       });
       fetchHistory();
       alert('Ficha Técnica guardada');
    }
    setIsLoading(false);
  };

  if (level === 'FREE') {
    return (
      <div className="container py-20 text-center">
         <h1 className="text-4xl font-black mb-4">Herramienta Profesional</h1>
         <p className="text-zinc-500 max-w-md mx-auto mb-10">La creación de fichas técnicas profesionales es una función exclusiva para usuarios <span className="text-primary">PRO</span> y <span className="text-primary">PREMIUM</span>.</p>
         <button className="px-10 py-4 bg-primary text-black font-black rounded-full uppercase tracking-tighter shadow-2xl hover:scale-105 transition-all">Mejorar Cuenta</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-10 print:bg-white print:text-black">
      <div className="container">
        
        <header className="mb-12 flex justify-between items-center print:hidden">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter">Ficha Técnica <span className="text-primary">PRO</span></h1>
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mt-1">Estandarización de Procesos Culinaros</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all">🖨️ Imprimir / PDF</button>
            <button onClick={save} disabled={isLoading} className="px-8 py-2 bg-primary text-black font-black rounded-xl hover:scale-105 transition-all disabled:opacity-50">💾 Guardar Perfil</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-8 rounded-[40px] border-white/10">
               <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Nombre de la Receta</label>
                    <input 
                      type="text" 
                      value={ficha.title} 
                      onChange={e => setFicha({...ficha, title: e.target.value})}
                      placeholder="Ej: Brioche de Mantequilla Noisette"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold focus:border-primary outline-none"
                    />
                 </div>

                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Prep. (min)</label>
                      <input type="number" value={ficha.prep_time} onChange={e => setFicha({...ficha, prep_time: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Cocción (min)</label>
                      <input type="number" value={ficha.cook_time} onChange={e => setFicha({...ficha, cook_time: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Temperatura</label>
                      <input type="text" value={ficha.serving_temp} onChange={e => setFicha({...ficha, serving_temp: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Conservación</label>
                      <input type="text" value={ficha.storage} onChange={e => setFicha({...ficha, storage: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-bold" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Alérgenos</label>
                    <div className="flex flex-wrap gap-2">
                      {ALLERGEN_LIST.map(a => (
                        <button 
                          key={a}
                          onClick={() => toggleAllergen(a)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black border transition-all ${ficha.allergens.includes(a) ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-zinc-500'}`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Proceso de Elaboración (Pasos)</label>
                    {ficha.steps.map((s, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-black text-primary border border-white/10">{i+1}</span>
                        <textarea 
                          value={s} 
                          onChange={e => updateStep(i, e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 font-bold focus:border-primary outline-none h-24"
                        />
                      </div>
                    ))}
                    <button onClick={addStep} className="w-full py-3 border border-dashed border-white/5 rounded-2xl text-zinc-600 text-xs font-bold hover:text-primary transition-all">+ Añadir Paso</button>
                 </div>
               </div>
            </div>
          </div>

          <aside className="lg:col-span-1 space-y-6">
             <div className="glass p-8 rounded-[40px] border-white/10">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-6">Mis Fichas Técnicas</h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                   {history.map(sc => (
                     <div key={sc.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 cursor-pointer transition-all">
                        <div className="font-bold text-sm tracking-tight">{sc.title}</div>
                        <div className="text-[10px] text-zinc-500 mt-1 uppercase font-black">{sc.prep_time_minutes + sc.cooking_time_minutes} min total</div>
                     </div>
                   ))}
                   {history.length === 0 && <p className="text-xs text-zinc-600 italic">No tienes fichas guardadas.</p>}
                </div>
             </div>
          </aside>

        </div>
      </div>

      <style jsx>{`
        .glass { background: rgba(255,255,255,0.02); backdrop-filter: blur(40px); }
        @media print {
          .glass { background: none; border: 1px solid #eee; backdrop-filter: none; }
          body { background: white; color: black; }
        }
      `}</style>
    </div>
  );
}
