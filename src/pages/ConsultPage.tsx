import { useState } from 'react';
import { MessageSquare, Bot, Send, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { orchestrator } from '@/services/AgentOrchestrator';
import { voiceService } from '@/services/VoiceService';

export default function ConsultPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const prompt = input;
    const userFirm = localStorage.getItem('user_firm') || 'Corporate';
    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setInput('');
    setLoading(true);

    try {
      const packet = await orchestrator.buildDefensePacket({
        title: 'Live consultation',
        case_type: userFirm,
        jurisdiction: 'User selected jurisdiction',
        description: prompt,
        firm_division: userFirm,
      });
      const response = `${packet.major_agent.name} activated the VORTEX defense protocol and consulted ${packet.minor_agents_consulted.toLocaleString()} minor legal knowledge agents. ${packet.minor_feedback.map((item: any) => `${item.knowledge_cell}: ${item.feedback}`).join(' ')}`;
      setMessages(prev => [...prev, { role: 'assistant', content: response, voice: packet.major_agent.voice }]);
      voiceService.speak(response, packet.major_agent.voice);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'The live VORTEX agent endpoint is unavailable. Please retry after the backend deployment is online.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-display font-bold">Swarm Consultation</h1>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">9,999,999 Agents Connected</p>
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
              <div className={`p-4 rounded-2xl text-sm space-y-2 ${m.role === 'user' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted border border-border'}`}>
                <div>{m.content}</div>
                {m.role !== 'user' && (
                  <Button type="button" variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => voiceService.speak(m.content, m.voice)}>
                    Speak with Major Agent Voice
                  </Button>
                )}
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
            />
            <Button onClick={handleSend} disabled={loading || !input.trim()} className="h-12 w-12 p-0">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}