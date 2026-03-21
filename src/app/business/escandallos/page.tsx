'use client';

import React, { useState, useEffect } from 'react';
import { useUserAuth } from '@/context/UserAuthContext';
import { getSupabase } from '@/lib/supabaseClient';

interface EscandalloItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
  price: number;
  waste: number;
}

export default function EscandallosPage() {
  const { authState, getEffectiveLevel } = useUserAuth();
  const [title, setTitle] = useState('');
  const [portions, setPortions] = useState(1);
  const [margin, setMargin] = useState(70);
  const [items, setItems] = useState<EscandalloItem[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const level = getEffectiveLevel();

  useEffect(() => {
    if (authState.id) fetchHistory();
  }, [authState.id]);

  const fetchHistory = async () => {
    const bus = getSupabase('BUSINESS');
    if (!bus) return;
    const { data } = await bus.from('escandallos').select('*').eq('user_id', authState.id).order('created_at', { ascending: false });
    if (data) setHistory(data);
  };

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), name: '', qty: 0, unit: 'kg', price: 0, waste: 0 }]);
  };

  const updateItem = (id: string, field: keyof EscandalloItem, val: any) => {
    setItems(items.map(it => it.id === id ? { ...it, [field]: val } : it));
  };

  const removeItem = (id: string) => setItems(items.filter(it => it.id !== id));

  const totalCost = items.reduce((acc, it) => {
    const realQty = it.qty / (1 - (it.waste / 100));
    return acc + (realQty * it.price);
  }, 0);

  const costPerPortion = totalCost / Math.max(1, portions);
  const pvps = costPerPortion / (1 - (margin / 100));

  const save = async () => {
    if (!title) return alert('Ponle un título al escandallo');
    setIsLoading(true);
    const bus = getSupabase('BUSINESS');
    if (bus && authState.id) {
       await bus.from('escandallos').insert({
         user_id: authState.id,
         title,
         portions,
         margin_percentage: margin,
         items
       });
       fetchHistory();
       alert('Escandallo guardado en tu perfil');
    }
    setIsLoading(false);
  };

  if (level === 'FREE') {
    return (
      <div className="container py-20 text-center">
         <h1 className="text-4xl font-black mb-4">Herramienta Profesional</h1>
         <p className="text-zinc-500 max-w-md mx-auto mb-10">El cálculo de escandallos y gestión de costes es una función exclusiva para usuarios <span className="text-primary">PRO</span> y <span className="text-primary">PREMIUM</span>.</p>
         <button className="px-10 py-4 bg-primary text-black font-black rounded-full uppercase tracking-tighter shadow-2xl hover:scale-105 transition-all">Mejorar Cuenta</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-10 print:bg-white print:text-black">
      <div className="container">
        
        <header className="mb-12 flex justify-between items-center print:hidden">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter">Escandallo <span className="text-primary">PRO</span></h1>
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mt-1">Gestión de Costes y Rentabilidad</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all">🖨️ Imprimir / PDF</button>
            <button onClick={save} disabled={isLoading} className="px-8 py-2 bg-primary text-black font-black rounded-xl hover:scale-105 transition-all disabled:opacity-50">💾 Guardar Perfil</button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-8 rounded-[40px] border-white/10">
               <div className="grid grid-cols-2 gap-6 mb-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Nombre del Plato / Receta</label>
                    <input 
                      type="text" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Ej: Risotto de Setas Silvestres"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold focus:border-primary outline-none"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Raciones</label>
                      <input 
                        type="number" 
                        value={portions} 
                        onChange={e => setPortions(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold focus:border-primary outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Margen (%)</label>
                      <input 
                        type="number" 
                        value={margin} 
                        onChange={e => setMargin(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-bold focus:border-primary outline-none"
                      />
                    </div>
                 </div>
               </div>

               <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 px-4 text-[10px] font-black uppercase text-zinc-600 tracking-widest">
                    <div className="col-span-5">Ingrediente</div>
                    <div className="col-span-2 text-center">Cant.</div>
                    <div className="col-span-2 text-center">Precio Unit. (€)</div>
                    <div className="col-span-2 text-center">Merma (%)</div>
                    <div className="col-span-1"></div>
                  </div>
                  
                  {items.map(it => (
                    <div key={it.id} className="grid grid-cols-12 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 items-center group">
                       <input 
                         className="col-span-5 bg-transparent outline-none font-bold" 
                         placeholder="Ingrediente..." 
                         value={it.name}
                         onChange={e => updateItem(it.id, 'name', e.target.value)}
                       />
                       <input 
                         type="number" 
                         className="col-span-2 bg-black/40 rounded-xl py-2 px-3 text-center outline-none" 
                         value={it.qty}
                         onChange={e => updateItem(it.id, 'qty', Number(e.target.value))}
                       />
                       <input 
                         type="number" 
                         className="col-span-2 bg-black/40 rounded-xl py-2 px-3 text-center outline-none" 
                         value={it.price}
                         onChange={e => updateItem(it.id, 'price', Number(e.target.value))}
                       />
                       <input 
                         type="number" 
                         className="col-span-2 bg-black/40 rounded-xl py-2 px-3 text-center outline-none" 
                         value={it.waste}
                         onChange={it.waste > 99 ? () => {} : e => updateItem(it.id, 'waste', Number(e.target.value))}
                       />
                       <button onClick={() => removeItem(it.id)} className="col-span-1 text-zinc-700 hover:text-red-500 transition-colors">✕</button>
                    </div>
                  ))}

                  <button 
                    onClick={addItem}
                    className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-zinc-500 font-bold hover:border-primary hover:text-primary transition-all"
                  >
                    + Añadir Ingrediente
                  </button>
               </div>
            </div>
          </div>

          {/* Results Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
             <div className="glass p-8 rounded-[40px] border-primary/20 bg-primary/5 sticky top-10">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-8 text-center">Resumen de Costes</h3>
                
                <div className="space-y-6">
                   <div className="flex justify-between items-end border-b border-white/5 pb-4">
                      <span className="text-zinc-500 text-sm">Coste Total Materia</span>
                      <span className="text-2xl font-black">{totalCost.toFixed(2)}€</span>
                   </div>
                   <div className="flex justify-between items-end border-b border-white/5 pb-4">
                      <span className="text-zinc-500 text-sm">Coste por Ración</span>
                      <span className="text-2xl font-black">{costPerPortion.toFixed(2)}€</span>
                   </div>
                   <div className="flex flex-col items-center py-6 bg-black/40 rounded-3xl border border-white/5">
                      <span className="text-xs font-black text-primary uppercase tracking-widest mb-2">PVP Recomendado (S/I)</span>
                      <span className="text-5xl font-black">{pvps.toFixed(2)}€</span>
                   </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 text-[10px] text-zinc-500 leading-relaxed italic">
                  * El PVP recomendado incluye el margen del {margin}% introducido. No incluye IVA ni gastos operativos variables.
                </div>
             </div>
             
             <div className="glass p-8 rounded-[40px] border-white/10 print:hidden">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-6">Mis Escandallos</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                   {history.map(sc => (
                     <div key={sc.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 cursor-pointer transition-all">
                        <div className="font-bold text-sm">{sc.title}</div>
                        <div className="text-[10px] text-zinc-500 mt-1">{new Date(sc.created_at).toLocaleDateString()}</div>
                     </div>
                   ))}
                   {history.length === 0 && <p className="text-xs text-zinc-600 italic">No tienes escandallos guardados.</p>}
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
