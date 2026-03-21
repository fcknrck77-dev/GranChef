'use client';

import React, { useState, useRef, useEffect } from 'react';

import { MessageSquareCode, Send, X, Bot, User as UserIcon } from 'lucide-react';

export default function HelpChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '¡Bienvenido a la Central de Inteligencia GrandChef! ¿Cómo puedo asistir a su equipo hoy?' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'He registrado su consulta técnica. Un consultor de GrandChef revisará su caso. Recuerde que el Soporte Enterprise está activo 24/7.' 
      }]);
    }, 1200);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-8 right-8 z-[10000]">
      {isOpen ? (
        <div className="w-80 h-[450px] chat-popup rounded-2xl border border-white/10 flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <header className="p-4 bg-zinc-900 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Soporte Corporativo</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
               <X size={18} />
            </button>
          </header>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-xl text-[11px] leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-primary text-black font-bold ml-8 rounded-tr-none' 
                    : 'bg-zinc-800 text-zinc-100 mr-8 rounded-tl-none border border-white/5'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          <footer className="p-4 bg-zinc-900 border-t border-white/5 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Asistencia técnica..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] outline-none text-white placeholder:text-zinc-600 focus:border-primary/40 transition-colors"
            />
            <button onClick={handleSend} className="p-2 bg-primary text-black rounded-lg hover:scale-105 active:scale-95 transition-all">
              <Send size={14} />
            </button>
          </footer>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-zinc-900 text-primary border border-primary/20 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:border-primary/50 transition-all active:scale-95 group relative"
        >
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping group-hover:bg-primary/20" />
          <MessageSquareCode size={24} className="relative z-10" />
        </button>
      )}

      <style jsx>{`
        .chat-popup { 
          background: rgba(10,10,12,0.95); 
          backdrop-filter: blur(20px); 
          box-shadow: 0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(var(--primary-rgb), 0.05);
        }
      `}</style>
    </div>
  );
}
