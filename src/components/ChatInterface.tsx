
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { aiService } from '../services/AIService';
import { Button, Textarea, ScrollArea } from './ui';

export default function ChatInterface({ caseContext }: { caseContext?: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const txt = input.trim();
    setInput('');
    setSending(true);

    const uMsg = { id: Date.now(), role: 'user', content: txt };
    const aiMsg = { id: 'streaming', role: 'assistant', content: '', streaming: true };
    setMessages(p => [...p, uMsg, aiMsg]);

    try {
      const prompt = caseContext ? `CONTEXT: ${caseContext}\nQUERY: ${txt}` : txt;
      const stream = aiService.streamResponse(prompt, true);
      let full = '';
      for await (const chunk of stream) {
        full += chunk;
        setMessages(p => p.map(m => m.id === 'streaming' ? { ...m, content: full } : m));
      }
      setMessages(p => p.map(m => m.id === 'streaming' ? { ...m, id: Date.now() + 1, streaming: false } : m));
    } catch {
      setMessages(p => p.filter(m => m.id !== 'streaming'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <ScrollArea className="flex-1 p-8">
        {messages.length === 0 && (
          <div className="text-center py-20 opacity-30 uppercase font-black tracking-[0.3em] font-display">Neural Interface Initialized</div>
        )}
        <div className="space-y-8">
          {messages.map(m => (
            <div key={m.id} className={`flex gap-6 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role !== 'user' && <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0"><Bot className="h-5 w-5 text-primary" /></div>}
              <div className={`max-w-[85%] rounded-2xl px-6 py-5 text-sm leading-relaxed ${m.role === 'user' ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20' : 'bg-muted/50 border border-border'}`}>
                <p className="whitespace-pre-wrap">{m.content}</p>
                {m.streaming && <Loader2 className="h-4 w-4 animate-spin mt-4 text-primary" />}
              </div>
              {m.role === 'user' && <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0"><User className="h-5 w-5 text-muted-foreground" /></div>}
            </div>
          ))}
        </div>
        <div ref={bottomRef} className="h-4" />
      </ScrollArea>
      <div className="p-8 border-t border-border bg-muted/20">
        <div className="flex gap-4">
          <Textarea value={input} onChange={(e: any) => setInput(e.target.value)} onKeyDown={(e: any) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())} placeholder="Inquire Neural Network..." className="bg-card border-border rounded-2xl p-6 font-bold focus:ring-primary min-h-[80px]" disabled={sending} aria-label="Chat message" />
          <Button onClick={handleSend} disabled={sending || !input.trim()} className="bg-primary text-primary-foreground h-20 w-20 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform" aria-label="Send message"><Send className="h-6 w-6" /></Button>
        </div>
      </div>
    </div>
  );
}
