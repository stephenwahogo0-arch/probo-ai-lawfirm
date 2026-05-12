
import { MessageSquare, Zap, Send, Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { aiService } from '@/services/AIService';
import { cn } from '@/lib/utils';
import React, { useState, useRef, useEffect } from 'react';

export default function ConsultPage() {
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setSending(true);

    let assistantMsg = '';
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
    
    for await (const chunk of aiService.streamResponse(userMsg, true)) {
      assistantMsg += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        return [...prev.slice(0, -1), { ...last, content: assistantMsg }];
      });
    }
    setSending(false);
  };

  const unlockAdmin = () => {
    aiService.unlock(adminCode).then(() => {
        alert("VORTEX: Admin protocols activated via code " + adminCode);
    }).catch(e => {
        alert(e.message);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
             <MessageSquare className="h-8 w-8 text-primary" /> Neural Link Consult
          </h1>
          <p className="text-muted-foreground">Direct interface with the 10,000,000 agent collective.</p>
        </div>
        <Card className="p-2 flex gap-2 items-center bg-secondary/20">
           <Input 
             placeholder="Admin Code" 
             type="password"
             value={adminCode}
             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdminCode(e.target.value)}
             className="h-8 w-24 text-[10px]"
           />
           <Button size="sm" variant="outline" className="h-8 px-2" onClick={unlockAdmin}>
              <ShieldAlert className="h-3 w-3" />
           </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
        <div className="md:col-span-3">
          <Card className="h-full flex flex-col overflow-hidden bg-card border-border/60">
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-20 space-y-6">
                   <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                      <Zap className="h-8 w-8 text-primary" />
                   </div>
                   <div className="max-w-xs mx-auto">
                      <p className="font-display font-bold text-xl">VORTEX SINGULARITY</p>
                      <p className="text-sm text-muted-foreground mt-2">
                         Initiate a legal consult. The collective intelligence of Probo Law Firm is ready to analyze your query across all 195 jurisdictions.
                      </p>
                   </div>
                   <div className="flex flex-wrap justify-center gap-2">
                      {["International Trade Law", "Constitutional Rights", "Quantum Policy", "IP Defense"].map(t => (
                        <span key={t} className="text-[10px] font-bold bg-muted px-3 py-1 rounded-full border border-border">
                           {t}
                        </span>
                      ))}
                   </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                   <div className={cn("max-w-[85%] rounded-2xl px-5 py-4 text-sm shadow-sm", 
                     m.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted border border-border text-foreground leading-relaxed")}>
                      {m.content}
                   </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </CardContent>
            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex gap-2">
                 <Input 
                   value={input} 
                   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                   onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
                   placeholder="Enter legal query for the VORTEX Council..." 
                   disabled={sending}
                   className="bg-background h-12"
                 />
                 <Button onClick={handleSend} disabled={sending || !input.trim()} className="h-12 w-12 rounded-xl">
                    {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                 </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="p-4 bg-primary/5 border-primary/20">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Network Status</p>
              <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <span className="text-xs">Uptime</span>
                    <span className="text-xs font-bold">99.999%</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs">Latency</span>
                    <span className="text-xs font-bold">&lt; 10ms</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs">Agents</span>
                    <span className="text-xs font-bold">10M Active</span>
                 </div>
              </div>
           </Card>

           <Card className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Lead Strategists</p>
              <div className="space-y-4">
                 {[1,2,3].map(i => (
                   <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-bold">
                         A{i}
                      </div>
                      <div>
                         <p className="text-xs font-bold">Vortex Agent {1000 + i}</p>
                         <p className="text-[10px] text-muted-foreground">Team Alpha</p>
                      </div>
                   </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
