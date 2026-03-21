'use client';

import React, { useEffect, useState } from 'react';
import { useUserAuth } from '@/context/UserAuthContext';
import { getSupabase } from '@/lib/supabaseClient';

export default function JobMarket() {
  const { authState, getEffectiveLevel } = useUserAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const net = getSupabase('NETWORKING');
    if (!net) return;

    let query = net.from('job_postings').select('*, company_profiles(*)').eq('status', 'active');
    
    if (filter !== 'all') {
      query = query.eq('type', filter);
    }

    query.then(({ data }) => {
      setJobs(data || []);
      setLoading(false);
    });
  }, [filter]);

  const handleApply = async (jobId: string) => {
    if (!authState.isRegistered) return alert('Debes iniciar sesión para postular.');
    const net = getSupabase('NETWORKING');
    if (!net) return;

    const { error } = await net.from('job_applications').insert({
      posting_id: jobId,
      user_id: authState.id,
      status: 'pending'
    });

    if (error) alert('Error al postular: ' + error.message);
    else alert('¡Postulación enviada con éxito!');
  };

  return (
    <div className="container py-20 min-h-screen">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
          Mercado Laboral Gastronómico
        </h1>
        <p className="text-zinc-500 text-lg">Conectando el mejor talento con las mejores cocinas del mundo.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Filters Sidebar */}
        <aside className="lg:w-64 space-y-6">
          <div className="glass p-6 rounded-3xl border-white/10">
            <h3 className="font-bold mb-4 uppercase text-xs tracking-widest opacity-40">Tipo de Empleo</h3>
            <div className="space-y-2">
              {['all', 'Full-time', 'Part-time', 'Internship'].map(t => (
                <button 
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${
                    filter === t ? 'bg-primary text-black font-bold' : 'hover:bg-white/5'
                  }`}
                >
                  {t === 'all' ? 'Todos' : t}
                </button>
              ))}
            </div>
          </div>

          {getEffectiveLevel() === 'ENTERPRISE' && (
            <div className="bg-primary/10 p-6 rounded-3xl border border-primary/20">
              <h3 className="font-bold text-primary mb-2">Panel de Empresa</h3>
              <p className="text-xs text-zinc-400 mb-4">Como miembro Enterprise, puedes publicar nuevas vacantes.</p>
              <button className="w-full py-3 bg-primary text-black font-black rounded-xl text-xs uppercase transition-transform hover:scale-105">
                Publicar Oferta
              </button>
            </div>
          )}
        </aside>

        {/* Job List */}
        <div className="flex-1 space-y-6">
          {loading ? (
            <div className="text-center py-20 opacity-20">Cargando oportunidades...</div>
          ) : jobs.length === 0 ? (
            <div className="glass p-20 rounded-3xl text-center border-white/5">
              <span className="text-5xl block mb-4">🍳</span>
              <h2 className="text-xl font-bold">No hay ofertas activas en este momento.</h2>
              <p className="text-zinc-500">Prueba ajustando los filtros o vuelve más tarde.</p>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="glass p-8 rounded-3xl border-white/10 hover:border-primary/50 transition-all group flex flex-col md:flex-row justify-between gap-6">
                <div className="flex gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5">
                    {job.company_profiles?.logo_url ? (
                      <img src={job.company_profiles.logo_url} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🏢</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-zinc-400">
                      <span className="flex items-center gap-1">📍 {job.location}</span>
                      <span className="flex items-center gap-1">💼 {job.type}</span>
                      <span className="flex items-center gap-1">💰 {job.salary_range}</span>
                    </div>
                    <p className="mt-4 text-zinc-500 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                </div>
                
                <div className="md:text-right flex flex-col justify-between items-end gap-4">
                  <span className="px-4 py-1 bg-white/5 rounded-full text-[10px] font-black tracking-widest uppercase opacity-40">
                    Hace {Math.floor(Math.random() * 5) + 1} días
                  </span>
                  <button 
                    onClick={() => handleApply(job.id)}
                    className="px-8 py-3 bg-white text-black font-black rounded-2xl hover:bg-primary transition-all transform hover:scale-105"
                  >
                    Postular Ahora
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      <style jsx>{`
        .glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
