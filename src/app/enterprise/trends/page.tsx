'use client';

import React, { useEffect, useState } from 'react';
import { useUserAuth } from '@/context/UserAuthContext';
import { getSupabase } from '@/lib/supabaseClient';

export default function TrendsDashboard() {
  const { getEffectiveLevel } = useUserAuth();
  const [trends, setTrends] = useState<any[]>([]);

  useEffect(() => {
    const bus = getSupabase('BUSINESS');
    if (!bus) return;

    bus.from('market_trends')
      .select('*')
      .order('search_volume_index', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setTrends(data);
        else {
          // Fallback trends for demo if DB is empty
          setTrends([
            { topic_name: 'Fermentación en Frío', growth_percentage: 124, category: 'Rising' },
            { topic_name: 'Emulsiones de Cítricos', growth_percentage: 85, category: 'Rising' },
            { topic_name: 'Sustitutos Lácteos Veganos', growth_percentage: 210, category: 'Exploding' },
            { topic_name: 'Cocina de Aprovechamiento', growth_percentage: 45, category: 'Stable' }
          ]);
        }
      });
  }, []);

  return (
    <div className="container py-10 min-h-screen">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black mb-2 tracking-tighter uppercase italic">Predictive <span className="text-primary text-6xl">Trends</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Análisis de Mercado Gastronómico en Tiempo Real</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-600 font-black uppercase mb-1">Update Frequency</div>
          <div className="text-primary font-bold">Every 15 min</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 glass p-8 rounded-[40px] border-white/10 min-h-[400px] flex flex-col justify-between">
           <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Volumen de Búsqueda Global</h2>
              <div className="flex gap-2">
                {['1D', '1W', '1M', '3M'].map(p => (
                  <button key={p} className={`px-4 py-1 rounded-full text-[10px] font-black ${p === '1M' ? 'bg-primary text-black' : 'bg-white/5 border border-white/5'}`}>{p}</button>
                ))}
              </div>
           </div>
           
           <div className="flex-1 flex items-end gap-2 py-10">
              {[40, 60, 30, 90, 100, 70, 80, 50, 110, 130, 120, 150].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-gradient-to-t from-primary/50 to-primary rounded-t-lg transition-all hover:scale-x-125 hover:brightness-125" 
                  style={{ height: `${h}px` }} 
                />
              ))}
           </div>

           <div className="flex justify-between text-[10px] uppercase font-black text-zinc-600 border-t border-white/5 pt-4">
              <span>Mar 21</span>
              <span>Mar 22</span>
              <span>Mar 23</span>
              <span>Mar 24</span>
              <span>Today</span>
           </div>
        </div>

        {/* Top Trending List */}
        <div className="lg:col-span-1 glass p-8 rounded-[40px] border-white/10 space-y-6">
           <h2 className="text-xl font-bold">Tendencias Explosivas</h2>
           {trends.map((t, i) => (
             <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all">
                <div>
                   <div className="font-bold text-sm">{t.name}</div>
                   <div className={`text-[10px] font-black uppercase mt-1 ${t.status === 'Exploding' ? 'text-red-500' : 'text-primary'}`}>{t.status}</div>
                </div>
                <div className="text-right">
                   <div className="text-lg font-black">{t.growth}</div>
                   <div className="w-10 h-1 bg-primary/20 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-primary" style={{ width: t.growth }} />
                   </div>
                </div>
             </div>
           ))}
           
           <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl">
              <p className="text-xs text-primary font-bold">Insight AI: "Se detecta un aumento crítico en el interés por la técnica de Clarificación de Caldos en Madrid."</p>
           </div>
        </div>

      </div>

      <style jsx>{`
        .glass { background: rgba(0,0,0,0.5); backdrop-filter: blur(50px); }
      `}</style>
    </div>
  );
}
