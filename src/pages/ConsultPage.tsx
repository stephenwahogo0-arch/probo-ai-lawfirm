import { useState } from 'react';
import { MessageSquare, Bot, Send, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function ConsultPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "The VORTEX Swarm has processed your query. Our consensus suggests that under the current democratic bedrock and rule of law, your position remains defensible through procedural i[...]"
      }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-display font-bold">Swarm Consultation</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">10,002,000 Agents Connected</p>
        </div>
      </div>

      <Card className="h-[600px] flex flex-col overflow-hidden border-border/50 shadow-xl bg-card/30 backdrop-blur-sm">
        <div className="flex-grow p-6 overflow-y-auto space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <Bot className="h-12 w-12" />
              <p className="text-sm italic">"Ask any legal question. The entire mesh is listening."</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${m.role === 'user' ? 'bg-secondary' : 'bg-primary/10'}`}>
                {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted border border-border'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
              <div className="p-4 rounded-2xl bg-muted border border-border text-xs italic opacity-50">
                Major agent synchronizing with sub-network...
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-border bg-background/50">
          <div className="flex gap-2">
            <Input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Query the Singularity..." 
              className="h-12"
              aria-label="Legal query input"
            />
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="h-12 w-12 p-0"
              aria-label="Send query"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}