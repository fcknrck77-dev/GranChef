'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useUserAuth } from '@/context/UserAuthContext';
import { getSupabase } from '@/lib/supabaseClient';
import { CryptoService } from '@/lib/crypto_service';

export default function MessengerPage() {
  const { authState } = useUserAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Derivation of a "Shared Secret" for this demo (In production, use PGP or DH)
  const sharedSecret = authState.id ? `grandchef_secret_${authState.id}` : 'guest';

  useEffect(() => {
    if (!authState.id) return;
    const net = getSupabase('NETWORKING');
    if (!net) return;

    // Fetch conversations (unique senders/receivers)
    net.from('messages_encrypted')
      .select('sender_id, receiver_id')
      .or(`sender_id.eq.${authState.id},receiver_id.eq.${authState.id}`)
      .then(({ data }) => {
         // Transform into a unique list of participants
         const participants = new Set();
         data?.forEach(m => {
           if (m.sender_id !== authState.id) participants.add(m.sender_id);
           if (m.receiver_id !== authState.id) participants.add(m.receiver_id);
         });
         // Mocking names/avatars for this demo
         setConversations(Array.from(participants).map(id => ({ id, name: 'Contacto Profesional', avatar: '🏢' })));
      });
  }, [authState.id]);

  useEffect(() => {
    if (!selectedUser) return;
    const net = getSupabase('NETWORKING');
    if (!net) return;
    
    // Fetch and DECRYPT messages
    const fetchMsgs = async () => {
      const { data } = await net.from('messages_encrypted')
        .select('*')
        .or(`and(sender_id.eq.${authState.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${authState.id})`)
        .order('created_at', { ascending: true });

      if (data) {
        const decrypted = await Promise.all(data.map(async m => ({
          ...m,
          text: await CryptoService.decrypt(m.encrypted_payload, sharedSecret)
        })));
        setMessages(decrypted);
      }
    };

    fetchMsgs();
    const interval = setInterval(fetchMsgs, 5000);
    return () => clearInterval(interval);
  }, [selectedUser, authState.id]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return;
    const net = getSupabase('NETWORKING');
    if (!net) return;
    
    const encrypted = await CryptoService.encrypt(input, sharedSecret);
    
    await net.from('messages_encrypted').insert({
      sender_id: authState.id,
      receiver_id: selectedUser.id,
      encrypted_payload: encrypted
    });

    setInput('');
  };

  return (
    <div className="container py-10 h-[calc(100vh-120px)] flex gap-4">
      
      {/* Sidebar: Conv List */}
      <div className="w-80 glass rounded-3xl border-white/10 p-6 flex flex-col gap-4 overflow-y-auto">
        <h2 className="font-bold text-xl mb-4">Mensajes</h2>
        {conversations.map(c => (
          <button 
            key={c.id} 
            onClick={() => setSelectedUser(c)}
            className={`p-4 rounded-2xl flex items-center gap-4 transition-all ${selectedUser?.id === c.id ? 'bg-primary text-black' : 'hover:bg-white/5'}`}
          >
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">{c.avatar}</div>
            <div className="text-left">
              <div className="font-bold text-sm">{c.name}</div>
              <div className="text-[10px] opacity-60">ID: {c.id.slice(0, 8)}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 glass rounded-3xl border-white/10 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-primary/5 to-transparent h-40" />
        
        {selectedUser ? (
          <>
            <header className="p-6 border-b border-white/5 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold">{selectedUser.avatar}</div>
               <div>
                 <h3 className="font-bold">{selectedUser.name}</h3>
                 <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Cifrado de Extremo a Extremo (AES-256)</p>
               </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender_id === authState.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${m.sender_id === authState.id ? 'bg-primary text-black font-medium' : 'bg-white/5 border border-white/5'}`}>
                    {m.text}
                    <div className="text-[9px] mt-2 opacity-50 uppercase tracking-tighter">
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <footer className="p-6 border-t border-white/5 flex gap-3">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe un mensaje seguro..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all"
              />
              <button 
                onClick={sendMessage}
                className="bg-primary text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all"
              >
                Enviar
              </button>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-600 flex-col gap-4">
            <span className="text-6xl grayscale opacity-20">🛡️</span>
            <p className="font-medium">Selecciona una conversación cifrada</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .glass { background: rgba(0,0,0,0.4); backdrop-filter: blur(40px); }
      `}</style>
    </div>
  );
}
