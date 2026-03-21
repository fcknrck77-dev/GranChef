'use client';

import React from 'react';
import { useUserAuth } from '@/context/UserAuthContext';
import Link from 'next/link';

export const TrialBlockedModal = () => {
  const { isBlocked } = useUserAuth();

  if (!isBlocked) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="max-w-md w-full p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black text-center shadow-2xl space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
          Prueba de 7 Días Finalizada
        </h2>
        
        <p className="text-zinc-400 leading-relaxed">
          Tu periodo de descubrimiento evolutivo ha concluido. Para continuar explorando los secretos de GrandChef y mantener el acceso a tus experimentos, es necesario activar un plan.
        </p>

        <div className="pt-4 flex flex-col gap-3">
          <Link 
            href="/pricing"
            className="w-full py-4 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all transform hover:scale-[1.02]"
          >
            Ver Planes y Ofertas ANUALES
          </Link>
          <p className="text-xs text-zinc-500">
            Ahorra hasta un 20% con la suscripción anual
          </p>
        </div>
      </div>
    </div>
  );
};
