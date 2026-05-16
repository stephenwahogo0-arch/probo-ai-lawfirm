import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Scale, ShieldCheck, Zap, Globe, 
  CreditCard, Wallet, Landmark, Bitcoin, Loader2, Send, Bot, User, Briefcase, Shield, Heart 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface CaseData {
  id: string;
  title: string;
  case_type: string;
  jurisdiction: string;
  payment_committed: boolean;
  report: string;
}

export default function CaseDetailPage() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [committing, setCommitting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const creatorEmail = 'stephenwahogoka0@gmail.com';
  const isCreator = localStorage.getItem('user_email') === creatorEmail;
  const userFirm = localStorage.getItem('user_firm') || 'Corporate';

  useEffect(() => {
    fetch(`http://localhost:8000/dossiers`)
      .then(res => res.json())
      .then((data: CaseData[]) => {
        const c = data.find((x) => x.id === id);
        setCaseData(c || null);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCommit = async () => {
    setCommitting(true);
    const email = localStorage.getItem('user_email');
    await fetch(`http://localhost:8000/dossiers/${id}/commit?email=${email}`, { method: 'POST' });
    if (caseData) {
      setCaseData({ ...caseData, payment_committed: true });
    }
    setCommitting(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setSending(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `VORTEX ${userFirm.toUpperCase()} COUNCIL: Our Managing Partner has reviewed your query. Based on the specialized protocols for ${userFirm}, we have identified a high-leverage ent[...]`
      }]);
      setSending(false);
    }, 1500);
  };

  const firmIconMap: Record<string, typeof Briefcase> = {
    'Corporate': Briefcase,
    'Criminal Defense': Shield,
    'Family Law': Heart
  };
  const firmIcon = firmIconMap[userFirm] || Scale;

  if (loading) return <div className="p-20 text-center animate-pulse font-display text-xl uppercase tracking-widest">Entangling {userFirm} Nodes...</div>;
  if (!caseData) return <div className="p-20 text-center">Vector not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="text-sm flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity uppercase font-bold tracking-tighter">
          <ArrowLeft className="h-4 w-4" /> {userFirm} Hub
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5">{caseData.case_type}</Badge>
          <Badge variant="outline" className="bg-primary/5">{caseData.jurisdiction}</Badge>
        </div>
      </div>

      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold tracking-tight">{caseData.title}</h1>
          <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
            Vector ID: {caseData.id} <span className="opacity-30">|</span> 
            <Zap className="h-3 w-3 text-primary" /> Mesh: {userFirm} 3.3M
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
           {(() => {
             const Icon = firmIcon;
             return <Icon className="h-6 w-6 text-primary" />;
           })()}
        </div>
      </div>

      {(caseData.payment_committed || isCreator) ? (
        <Card className="overflow-hidden border-border/50 shadow-2xl bg-card/30 backdrop-blur-xl">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <CardTitle className="text-sm font-display font-bold flex items-center gap-3 uppercase tracking-widest">
              <Bot className="h-5 w-5 text-primary" /> {userFirm} Swarm Consultation
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[500px] overflow-y-auto p-6 space-y-4 font-sans custom-scrollbar">
             <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl text-sm leading-relaxed shadow-inner">
                <p className="font-bold mb-3 flex items-center gap-2 uppercase tracking-tighter text-primary">
                  <ShieldCheck className="h-4 w-4" /> Managed Partner Strategic Report
                </p>
                <div className="opacity-80 whitespace-pre-wrap">{caseData.report}</div>
             </div>
             {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-3 max-w-[80%]", m.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
                   <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 border", m.role === 'user' ? "bg-secondary border-secondary-foreground/20" : "bg-primary/10")}>
                      {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
                   </div>
                   <div className={cn("p-4 rounded-2xl text-sm shadow-sm", m.role === 'user' ? "bg-primary text-primary-foreground font-medium" : "bg-muted border border-border text-foreground")}>
                      {m.content}
                   </div>
                </div>
              ))}
              {sending && (
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                  <div className="p-4 rounded-2xl bg-muted border border-border text-[10px] uppercase font-bold opacity-40">
                    Synchronizing {userFirm} Sub-Agents...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
           </CardContent>
           <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex gap-2">
                 <Input 
                   value={input} 
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                   placeholder="Query the Division Counsel..." 
                   disabled={sending}
                   className="bg-background h-12"
                 />
                 <Button onClick={handleSend} disabled={sending || !input.trim()} className="h-12 w-12 p-0">
                    {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                 </Button>
              </div>
           </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <Card className="bg-primary/5 border-primary/20 border-2">
              <CardHeader>
                 <CardTitle className="flex items-center gap-3 font-display uppercase tracking-widest text-lg">
                    <ShieldCheck className="h-6 w-6 text-primary" /> VICTORY COMMITMENT
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                    To unlock the full {userFirm} Strategic Report and mobilize 3,334,000 agents, a **Victory Commitment** of 0 is required.
                 </p>
                 <div className="p-6 bg-background border border-border rounded-2xl space-y-4 shadow-xl border-t-4 border-t-primary">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold uppercase opacity-50">Success Fee</span>
                       <span className="text-3xl font-display font-bold">0</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                       <span className="text-xs font-bold uppercase opacity-50">M-Pesa / Remitly</span>
                       <span className="text-lg font-mono font-bold text-primary">0720975622</span>
                    </div>
                 </div>
                 <Button 
                   onClick={handleCommit}
                   disabled={committing}
                   className="w-full h-14 gap-3 text-xl font-bold shadow-lg shadow-primary/30"
                 >
                    {committing ? <Loader2 className="h-6 w-6 animate-spin" /> : <Zap className="h-6 w-6" />}
                    COMMIT TO VICTORY
                 </Button>
                 <div className="text-[9px] text-center opacity-40 uppercase tracking-widest space-y-1">
                   <p>* Non-refundable for malicious intent.</p>
                   <p>* VORTEX Mesh ensures 100% legal defensibility.</p>
                 </div>
              </CardContent>
           </Card>

           <div className="space-y-4">
              <h3 className="font-display font-bold flex items-center gap-2 uppercase tracking-widest text-xs opacity-60">
                <Globe className="h-4 w-4 text-primary" /> GLOBAL REMITTANCE CHANNELS
              </h3>
              <div className="grid grid-cols-2 gap-4">
                 {[
                   { icon: CreditCard, label: "Remitly", color: "blue" },
                   { icon: Wallet, label: "Sendwave", color: "orange" },
                   { icon: Landmark, label: "WorldRemit", color: "green" },
                   { icon: Bitcoin, label: "Binance P2P", color: "yellow" }
                 ].map((pay, i) => {
                   const PayIcon = pay.icon;
                   return (
                     <Card key={i} className="p-4 flex items-center gap-3 border-border/50 hover:border-primary/50 transition-all cursor-pointer hover:bg-primary/5 group">
                        <PayIcon className={cn("h-5 w-5", `text-${pay.color}-500`)} />
                        <span className="text-[10px] font-bold uppercase tracking-tighter group-hover:text-primary">{pay.label}</span>
                     </Card>
                   );
                 })}
              </div>
              <Card className="p-5 bg-muted/40 border-border/50 border-l-4 border-l-primary">
                 <p className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-3 text-primary">Mobile Money Instructions</p>
                 <ol className="text-[10px] leading-relaxed font-bold space-y-2 opacity-70">
                   <li>1. Select <span className="text-foreground">Kenya</span> as destination.</li>
                   <li>2. Method: <span className="text-foreground">Mobile Money (M-Pesa)</span>.</li>
                   <li>3. Recipient: <span className="text-foreground">0720975622</span>.</li>
                   <li>4. Amount: <span className="text-foreground">0 USD</span>.</li>
                   <li>5. Enter <span className="text-foreground">{id?.slice(0,8)}</span> as reference.</li>
                 </ol>
              </Card>
           </div>
        </div>
      )}
    </div>
  );
}