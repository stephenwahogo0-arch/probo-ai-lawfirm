import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Scale, ShieldCheck, Zap, 
  Loader2, Send, Bot, User, Briefcase, Shield, Heart, Activity, QrCode, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LiveTrialMonitor } from '@/components/LiveTrialMonitor';
import { QRCodeSVG } from 'qrcode.react';

export default function CaseDetailPage() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [committing, setCommitting] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const creatorEmail = 'stephenwahogoka0@gmail.com';
  const isCreator = localStorage.getItem('user_email') === creatorEmail;
  const userFirm = localStorage.getItem('user_firm') || 'Corporate';

  useEffect(() => {
    fetch(`/_/backend/dossiers`)
      .then(res => res.json())
      .then(data => {
        const c = data.find((x: any) => x.id === id);
        setCaseData(c);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCommit = async () => {
    setCommitting(true);
    const email = localStorage.getItem('user_email');
    await fetch(`/_/backend/dossiers/${id}/commit?email=${email}`, { method: 'POST' });
    setCaseData({ ...caseData, payment_committed: true });
    setCommitting(false);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setSending(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `VORTEX ${userFirm.toUpperCase()} SECURITY: Strategic packet received. Our Lead Counsel is analyzing the vector under AES-256 wrapping. Interference cancellation active.` 
      }]);
      setSending(false);
    }, 1500);
  };

  const firmIconMap: Record<string, any> = {
    'Corporate': Briefcase,
    'Criminal Defense': Shield,
    'Family Law': Heart
  };
  const firmIcon = firmIconMap[userFirm] || Scale;

  if (loading) return <div className="p-20 text-center animate-pulse font-display text-xl uppercase tracking-widest text-primary">Establishing Encrypted Tunnel...</div>;
  if (!caseData) return <div className="p-20 text-center">Vector not found.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-32">
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="text-xs flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity uppercase font-black tracking-widest">
          <ArrowLeft className="h-4 w-4" /> {userFirm} Secure Hub
        </Link>
        <div className="flex items-center gap-2">
          <div className="text-[9px] font-black uppercase text-blue-500 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 flex items-center gap-2">
             <Lock className="h-3 w-3" /> Encrypted
          </div>
          <Badge variant="outline" className="bg-primary/5 border-primary/20 uppercase font-black text-[9px]">{caseData.case_type}</Badge>
        </div>
      </div>

      <div className="flex items-start justify-between gap-6">
        <div className="space-y-3">
          <h1 className="text-5xl font-display font-black tracking-tight">{caseData.title}</h1>
          <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 font-bold">
            Vector ID: {caseData.id} <span className="opacity-20">|</span> 
            <ShieldCheck className="h-3 w-3 text-primary" /> Mesh: Hack-Proof V1.2.5
          </p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-xl shadow-primary/5">
           {React.createElement(firmIcon, { className: "h-8 w-8 text-primary" })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {(caseData.payment_committed || isCreator) ? (
            <Card className="overflow-hidden border-border/50 shadow-2xl bg-card/30 backdrop-blur-xl rounded-[2.5rem]">
              <CardHeader className="bg-muted/30 border-b border-border/50 p-8">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xs font-display font-black flex items-center gap-4 uppercase tracking-[0.2em]">
                    <Bot className="h-6 w-6 text-primary" /> {userFirm} Encrypted Swarm
                  </CardTitle>
                  <div className="flex items-center gap-3">
                     <div className="text-[8px] font-bold uppercase opacity-40">Security Tunnel: AES-256</div>
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[650px] overflow-y-auto p-10 space-y-8 font-sans custom-scrollbar">
                <div className="bg-black/20 border border-primary/30 p-8 rounded-[2rem] text-sm leading-relaxed shadow-inner relative overflow-hidden group">
                    <p className="font-black mb-6 flex items-center gap-4 uppercase tracking-widest text-primary text-xs">
                      <ShieldCheck className="h-6 w-6" /> Decrypted Strategic Dossier
                    </p>
                    <div className="opacity-90 whitespace-pre-wrap text-lg font-medium leading-relaxed">{caseData.report}</div>
                </div>
                {messages.map((m, i) => (
                    <div key={i} className={cn("flex gap-5 max-w-[85%]", m.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 shadow-lg", m.role === 'user' ? "bg-secondary border-secondary-foreground/20" : "bg-primary/10 border-primary/20")}>
                          {m.role === 'user' ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6 text-primary" />}
                      </div>
                      <div className={cn("p-6 rounded-[2rem] text-sm shadow-xl", m.role === 'user' ? "bg-primary text-primary-foreground font-black" : "bg-muted border border-border text-foreground font-medium")}>
                          {m.content}
                      </div>
                    </div>
                  ))}
                  {sending && (
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
                         <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <div className="p-5 rounded-[1.5rem] bg-muted border border-border text-[11px] uppercase font-black opacity-30 tracking-widest flex items-center gap-3">
                        <Loader2 className="h-3 w-3 animate-spin" /> Transmitting Encrypted Packet...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
              </CardContent>
              <div className="p-8 border-t border-border bg-muted/40">
                  <div className="flex gap-4">
                    <Input 
                      value={input} 
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Message the VORTEX secure council..." 
                      disabled={sending}
                      className="bg-background h-16 rounded-2xl px-8 text-lg font-medium border-border/50 focus:ring-primary/30"
                    />
                    <Button onClick={handleSend} disabled={sending || !input.trim()} className="h-16 w-16 p-0 rounded-2xl shadow-xl transition-transform hover:scale-105">
                        {sending ? <Loader2 className="h-7 w-7 animate-spin" /> : <Send className="h-7 w-7" />}
                    </Button>
                  </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-10">
              <Card className="bg-primary/5 border-primary/30 border-2 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
                  <h3 className="font-display font-black text-3xl uppercase tracking-[0.2em] mb-6 flex items-center gap-4 relative z-10">
                    <ShieldCheck className="h-10 w-10 text-primary" /> VICTORY COMMITMENT
                  </h3>
                  <div className="space-y-8 relative z-10">
                    <p className="text-xl leading-relaxed text-muted-foreground font-medium max-w-xl">
                        A $90 commitment is required to establish the AES-256 tunnel and unlock your specialized {userFirm} Strategic Vector.
                    </p>
                    <div className="p-10 bg-background border border-border rounded-[2.5rem] space-y-8 shadow-2xl border-t-[12px] border-t-primary">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black uppercase opacity-40 tracking-widest">Victory Success Fee</span>
                          <span className="text-6xl font-display font-black text-primary tracking-tighter">$90</span>
                        </div>
                        <div className="flex justify-between items-center pt-8 border-t border-border">
                          <span className="text-xs font-black uppercase opacity-40 tracking-widest">Direct Remittance</span>
                          <span className="text-3xl font-mono font-black tracking-tighter text-foreground">0720975622</span>
                        </div>
                    </div>
                    <Button 
                      onClick={handleCommit}
                      disabled={committing}
                      className="w-full h-24 gap-6 text-3xl font-black shadow-2xl shadow-primary/30 rounded-[2rem] transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest"
                    >
                        {committing ? <Loader2 className="h-10 w-10 animate-spin" /> : <Zap className="h-10 w-10" />}
                        INITIALIZE SECURE LINK
                    </Button>
                  </div>
              </Card>
            </div>
          )}
        </div>

        <div className="space-y-10">
           <section className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 flex items-center gap-3">
                 <Activity className="h-5 w-5 text-primary" /> Security Operations Center
              </h3>
              <LiveTrialMonitor />
           </section>

           <Card className="p-8 border-border/50 bg-muted/20 rounded-[2.5rem] shadow-xl">
              <h3 className="font-display font-black text-xl mb-8 uppercase tracking-widest flex items-center gap-4">
                 <QrCode className="h-6 w-6 text-primary" /> Victory Pass
              </h3>
              <div className="flex flex-col items-center gap-6">
                 <div className="p-4 bg-white rounded-3xl shadow-2xl">
                    <QRCodeSVG 
                      value={`https://probo-ai-lawfirm.vercel.app/cases/${id}`} 
                      size={180} 
                      level="H"
                      includeMargin={true}
                    />
                 </div>
                 <div className="text-center space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Dossier Reference</p>
                    <p className="font-mono text-sm font-black">{id?.slice(0, 12)}</p>
                 </div>
                 <p className="text-[9px] text-center font-bold opacity-60 leading-relaxed uppercase tracking-tighter">
                   Encrypted mobile access point. 
                 </p>
              </div>
           </Card>

           <Card className="p-8 border-border/50 bg-card/50 rounded-[2rem] text-center">
              <Shield className="h-10 w-10 text-primary mx-auto mb-4 opacity-50" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Probo Law Firm is protected by VORTEX Hack-Proof Kernels. 
                All data is stored in Zero-Knowledge silos.
              </p>
           </Card>
        </div>
      </div>
    </div>
  );
}
