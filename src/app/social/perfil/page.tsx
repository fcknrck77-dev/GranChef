'use client';

import React, { useEffect, useState } from 'react';
import { useUserAuth } from '@/context/UserAuthContext';
import { getSupabase } from '@/lib/supabaseClient';

export default function SocialProfile() {
  const { authState, getEffectiveLevel } = useUserAuth();
  const [awards, setAwards] = useState<any[]>([]);
  const [jobApps, setJobApps] = useState<any[]>([]);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (!authState.id) return;
    const net = getSupabase('NETWORKING');
    if (!net) return;

    // Fetch Awards
    net.from('user_awards')
      .select('*')
      .eq('user_id', authState.id)
      .then(({ data }) => setAwards(data || []));

    // Fetch Applications
    net.from('job_applications')
      .select('*, job_postings(*)')
      .eq('user_id', authState.id)
      .then(({ data }) => setJobApps(data || []));
  }, [authState.id]);

  if (!authState.isRegistered) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold">Inicia sesión para ver tu perfil social</h2>
      </div>
    );
  }

  return (
    <div className="container py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 rounded-3xl text-center border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="px-3 py-1 bg-primary text-black text-xs font-black rounded-full shadow-lg">
                {getEffectiveLevel()}
              </span>
            </div>
            
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-primary to-zinc-800 p-1 mb-6">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden border-4 border-black">
                {authState.profile?.email ? (
                  <img src={`https://ui-avatars.com/api/?name=${authState.profile.firstName}+${authState.profile.lastName}&background=transparent&color=fff&size=200`} alt="Avatar" />
                ) : (
                  <span className="text-4xl">👨‍🍳</span>
                )}
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-1">{authState.profile?.firstName} {authState.profile?.lastName}</h1>
            <p className="text-zinc-500 mb-6">{authState.profile?.professionalSector || 'Explorador Gastronómico'}</p>
            
            <div className="flex justify-center gap-4 border-t border-white/5 pt-6">
              <div className="text-center">
                <div className="text-xl font-bold">{awards.length}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest">Premios</div>
              </div>
              <div className="text-center px-6 border-x border-white/5">
                <div className="text-xl font-bold">{jobApps.length}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest">Postulaciones</div>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border-white/10 space-y-4">
            <h3 className="font-bold text-sm tracking-widest uppercase opacity-40">Privacidad</h3>
            <div className="flex items-center justify-between">
              <span>Perfil Público</span>
              <button 
                onClick={() => setIsPublic(!isPublic)}
                className={`w-12 h-6 rounded-full transition-all relative ${isPublic ? 'bg-primary' : 'bg-zinc-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isPublic ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              {isPublic 
                ? 'Las empresas pueden ver tu perfil completo y CV.' 
                : 'Tu perfil es privado. Solo las empresas a las que postules podrán verte.'}
            </p>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Awards Section */}
          <section className="glass p-8 rounded-3xl border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-primary text-3xl">🏆</span> Galardones de la Academia
            </h2>
            {awards.length === 0 ? (
              <div className="p-10 border-2 border-dashed border-white/5 rounded-2xl text-center text-zinc-600">
                Aún no has recibido premios oficiales de la administración.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {awards.map(a => (
                  <div key={a.id} className="bg-white/5 p-4 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-2xl">
                      {a.icon_url || '🥘'}
                    </div>
                    <div>
                      <div className="font-bold">{a.award_name}</div>
                      <div className="text-xs text-zinc-500">{new Date(a.issued_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* CV & Professional Section */}
          <section className="glass p-8 rounded-3xl border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Currículum Vitae</h2>
              <button className="px-6 py-2 bg-white text-black rounded-xl font-bold text-sm hover:invert transition-all">
                Subir Nuevo CV
              </button>
            </div>
            <div className="bg-zinc-900 rounded-2xl p-6 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500 text-xl font-bold">PDF</div>
                <div>
                  <div className="font-bold">GrandChef_CV_2026.pdf</div>
                  <div className="text-xs text-zinc-500">Actualizado hace 2 días</div>
                </div>
              </div>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </section>

          {/* Applications */}
          <section className="glass p-8 rounded-3xl border-white/10">
            <h2 className="text-2xl font-bold mb-6">Mercado Laboral: Mis Postulaciones</h2>
            <div className="space-y-4">
              {jobApps.map(app => (
                <div key={app.id} className="p-5 border border-white/5 rounded-2xl hover:border-primary/50 transition-all flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-lg">{app.job_postings?.title}</h4>
                    <p className="text-zinc-500 text-sm">{app.job_postings?.location || 'Remoto'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                      app.status === 'accepted' ? 'bg-green-500/20 text-green-500' : 
                      app.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'
                    }`}>
                      {app.status}
                    </span>
                    <div className="text-[10px] text-zinc-600 mt-2">
                      Aplicado el {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

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
