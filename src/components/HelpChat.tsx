'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function HelpChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '¡Hola! Soy el asistente de GrandChef. ¿En qué puedo ayudarte profesionalmente hoy?' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mocking AI Response for help (Could call /api/ai/knowledge)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'He registrado tu consulta. Para asistencia técnica inmediata, también puedes consultar la sección de Ayuda en tu perfil enterprise.' 
      }]);
    }, 1000);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-10 right-10 z-[1000]">
      {isOpen ? (
        <div className="w-80 h-96 glass rounded-3xl border border-white/10 flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <header className="p-4 bg-primary text-black flex justify-between items-center font-bold">
            <span>Asistencia GrandChef</span>
            <button onClick={() => setIsOpen(false)}>×</button>
          </header>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${m.role === 'user' ? 'bg-zinc-800' : 'bg-primary/20 text-primary border border-primary/20'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          <footer className="p-3 border-t border-white/5 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Pregunta algo..."
              className="flex-1 bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs outline-none"
            />
            <button onClick={handleSend} className="p-2 bg-primary text-black rounded-xl">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </footer>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-primary text-black rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 transition-transform active:scale-95 border-4 border-black group"
        >
          <span className="group-hover:rotate-12 transition-transform">🤖</span>
        </button>
      )}

      <style jsx>{`
        .glass { background: rgba(0,0,0,0.8); backdrop-filter: blur(20px); }
      `}</style>
    </div>
  );
}
