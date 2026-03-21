import React, { useState, useRef } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import { useUserAuth } from '@/context/UserAuthContext';

export default function OcrScanner() {
  const { authState } = useUserAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    
    // Simulating OCR Processing
    setTimeout(async () => {
      const mockResult = {
        vendor: 'Distribuciones Gourmet S.L.',
        date: new Date().toLocaleDateString(),
        items: [
          { name: 'Solomillo de Ternera - 5kg', price: 125.50, category: 'Carnes' },
          { name: 'Aceite de Oliva Extra - 20L', price: 180.00, category: 'Despensa' },
          { name: 'Trufa Negra - 100g', price: 95.00, category: 'Materia Prima' }
        ],
        total: 400.50
      };

      // Save to BUSINESS Shard
      const bus = getSupabase('BUSINESS');
      if (bus && authState.id) {
        await bus.from('business_invoices').insert({
          company_id: authState.id,
          vendor_name: mockResult.vendor,
          total_amount: mockResult.total,
          items: mockResult.items
        });
      }

      setResult(mockResult);
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div className="glass p-8 rounded-[40px] border-white/10 relative overflow-hidden">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black italic">Vision <span className="text-primary">B2B</span></h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Escáner de Facturas e Inventario</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-white text-black px-8 py-3 rounded-2xl font-black text-sm hover:invert transition-all"
        >
          Subir Factura
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,.pdf" 
          onChange={handleScan}
        />
      </div>

      {!result && !isScanning && (
        <div className="py-20 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-zinc-600">
           <span className="text-5xl mb-4 opacity-20">📄</span>
           <p className="text-sm font-medium">Sube una imagen de tu factura para calcular escandallos automáticos.</p>
        </div>
      )}

      {isScanning && (
        <div className="py-20 flex flex-col items-center justify-center space-y-4 animate-pulse">
           <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin" />
           <p className="text-sm font-black text-primary uppercase tracking-widest">Digitalizando Archivo...</p>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-700">
           <div className="flex justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
             <div>
               <div className="text-xs text-zinc-500 uppercase font-black mb-1">Proveedor Detecado</div>
               <div className="text-xl font-bold">{result.vendor}</div>
             </div>
             <div className="text-right">
               <div className="text-xs text-zinc-500 uppercase font-black mb-1">Total Iva Inc.</div>
               <div className="text-2xl font-black text-primary">{result.total}€</div>
             </div>
           </div>

           <div className="space-y-3">
             <h3 className="text-xs font-black uppercase tracking-widest text-zinc-600 px-2">Desglose de Partidas</h3>
             {result.items.map((item: any, i: number) => (
               <div key={i} className="flex justify-between items-center p-4 bg-zinc-900/50 rounded-xl border border-white/5 hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-xs px-2 py-1 bg-white/5 rounded text-zinc-500">{item.category}</span>
                    <span className="font-bold">{item.name}</span>
                  </div>
                  <span className="font-black">{item.price}€</span>
               </div>
             ))}
           </div>

           <button className="w-full py-4 bg-primary/10 text-primary font-black rounded-2xl border border-primary/20 hover:bg-primary hover:text-black transition-all">
              Vincular a Escandallos del Restaurante
           </button>
        </div>
      )}

      <style jsx>{`
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(40px); }
      `}</style>
    </div>
  );
}
