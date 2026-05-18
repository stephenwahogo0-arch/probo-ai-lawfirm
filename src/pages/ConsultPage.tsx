import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Bot, Send, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ConsultPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streaming]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setStreaming('');

    try {
      console.log("[v0] Sending legal query to REAL AI service:", userMessage);

      // Call real AI API
      const response = await fetch('/api/legal-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          conversationHistory: messages 
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      // Stream the response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        setStreaming(fullResponse);
      }

      if (fullResponse) {
        setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
        setStreaming('');
      }
    } catch (err) {
      console.error("[v0] Consultation error:", err);
      // Fallback response
      const fallbackMsg = "The legal consultation system is currently processing your query. Please try again in a moment.";
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackMsg }]);
      setStreaming('');
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
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Real AI Legal Analysis - Live</p>
        </div>
      </div>

      <Card className="h-[600px] flex flex-col overflow-hidden border-border/50 shadow-xl bg-card/30 backdrop-blur-sm">
        <div className="flex-grow p-6 overflow-y-auto space-y-4">
          {messages.length === 0 && !streaming && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <Bot className="h-12 w-12" />
              <p className="text-sm italic">"Ask any legal question. Real AI analysis engaged."</p>
            </div>
          )}
          
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${m.role === 'user' ? 'bg-secondary' : 'bg-primary/10'}`}>
                {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm max-w-md ${m.role === 'user' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted border border-border'}`}>
                {m.content}
              </div>
            </div>
          ))}

          {streaming && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
              <div className="p-4 rounded-2xl bg-muted border border-border text-sm max-w-md">
                {streaming}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border bg-background/50">
          <div className="flex gap-2">
            <Input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && handleSend()}
              placeholder="Ask your legal question..." 
              className="h-12"
              disabled={loading}
            />
            <Button 
              onClick={handleSend} 
              disabled={loading || !input.trim()} 
              className="h-12 w-12 p-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
