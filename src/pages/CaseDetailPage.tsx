
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, MessageSquare, Scale, Zap, Send, Loader2, ShieldCheck, DollarSign, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { dossierService, type Case } from '@/services/DossierService';
import { aiService } from '@/services/AIService';
import { cn } from '@/lib/utils';
import React, { useEffect, useState, useRef } from 'react';

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [activeTab, setActiveTab] = useState<'report' | 'chat' | 'payment'>('report');
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [committing, setCommitting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      dossierService.getCaseById(id).then(data => {
          if (data) setCaseData(data);
      });
    }
  }, [id]);

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
    
    for await (const chunk of aiService.streamResponse(userMsg, false)) {
      assistantMsg += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        return [...prev.slice(0, -1), { ...last, content: assistantMsg }];
      });
    }
    setSending(false);
  };

  const handleCommit = async () => {
    if (!id || committing) return;
    setCommitting(true);
    try {
        await dossierService.commitPayment(id);
        const updated = await dossierService.getCaseById(id);
        if (updated) setCaseData(updated);
    } catch (e) {
        console.error(e);
    } finally {
        setCommitting(false);
    }
  };

  if (!caseData) return <div className="text-center p-20">Dossier not found in VORTEX Network.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/dashboard">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-2">
           <Zap className="h-4 w-4 text-primary" />
           <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
              Neural Link Synchronized
           </span>
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-display font-bold">{caseData.title}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-bold text-primary">{caseData.case_type}</span>
          <span>•</span>
          <span>{caseData.jurisdiction}</span>
          <span>•</span>
          <span>Created {new Date(caseData.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
        <button 
          onClick={() => setActiveTab('report')}
          className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2", 
            activeTab === 'report' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
        >
          <FileText className="h-4 w-4" /> Strategic Report
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2", 
            activeTab === 'chat' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
        >
          <MessageSquare className="h-4 w-4" /> Neural Link
        </button>
        <button 
          onClick={() => setActiveTab('payment')}
          className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2", 
            activeTab === 'payment' ? (caseData.payment_committed ? "bg-green-600 text-white shadow-sm" : "bg-primary text-primary-foreground shadow-sm") : "text-muted-foreground hover:text-foreground")}
        >
          <DollarSign className="h-4 w-4" /> {caseData.payment_committed ? "Commitment Verified" : "Victory Commitment"}
        </button>
      </div>

      {activeTab === 'report' ? (
        <Card className="bg-card">
          <CardContent className="p-8 prose prose-sage max-w-none">
             <div className="whitespace-pre-wrap font-sans leading-relaxed text-foreground/90">
                {caseData.report}
             </div>
          </CardContent>
        </Card>
      ) : activeTab === 'chat' ? (
        <Card className="h-[600px] flex flex-col bg-card overflow-hidden border-border/60">
           <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-20 space-y-4">
                   <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mx-auto border border-primary/10">
                      <Scale className="h-6 w-6 text-primary" />
                   </div>
                   <div>
                      <p className="font-display font-bold">VORTEX NEURAL LINK</p>
                      <p className="text-sm text-muted-foreground">Ask questions about the dossier or request specific filings.</p>
                   </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                   <div className={cn("max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm", 
                     m.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted border border-border text-foreground")}>
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
                   placeholder="Message the VORTEX Council..." 
                   disabled={sending}
                   className="bg-background"
                 />
                 <Button onClick={handleSend} disabled={sending || !input.trim()}>
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                 </Button>
              </div>
           </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card className="bg-primary/5 border-primary/20 h-fit">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" /> Success Fee Agreement
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <p className="text-sm leading-relaxed">
                    By using the Probo Law Firm agent network, you agree to a **Victory Success Fee**. This fee is only payable **AFTER** your case is won using our strategic vectors.
                 </p>
                 <div className="p-4 bg-background border border-border rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold uppercase text-muted-foreground">Service Fee</span>
                       <span className="text-lg font-display font-bold">$90 USD</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold uppercase text-muted-foreground">Payment Window</span>
                       <span className="text-xs font-medium">Post-Victory (7 Days)</span>
                    </div>
                 </div>
                 {!caseData.payment_committed ? (
                    <div className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                        <button 
                          onClick={handleCommit}
                          disabled={committing}
                          className="w-full bg-primary text-primary-foreground py-2 rounded-md font-bold text-xs flex items-center justify-center gap-2"
                        >
                           {committing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
                           COMMIT TO $90 SUCCESS FEE
                        </button>
                    </div>
                 ) : (
                    <div className="flex items-center justify-center gap-2 p-3 bg-green-500/10 text-green-600 rounded-lg border border-green-500/20 font-bold text-xs">
                        <ShieldCheck className="h-4 w-4" /> COMMITMENT VERIFIED BY VORTEX
                    </div>
                 )}
                 <p className="text-[10px] text-muted-foreground text-center">
                    Note: Commitment is required to view payment instructions.
                 </p>
              </CardContent>
           </Card>

           <Card className={cn("transition-all h-fit", !caseData.payment_committed && "opacity-50 pointer-events-none")}>
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" /> Mobile Payment Instructions
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-1">
                    <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Recipient Mobile Number</p>
                    <p className="text-2xl font-mono font-bold text-foreground">0720975622</p>
                    <p className="text-[10px] text-muted-foreground">Region: Kenya · Network: MPESA/Mobile Money</p>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold">1</div>
                       <p className="text-xs font-medium">Wait for the case victory or favorable settlement.</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold">2</div>
                       <p className="text-xs font-medium">Transfer **$90** (or equivalent in KES) to the number above.</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold">3</div>
                       <p className="text-xs font-medium">Send a confirmation message to the Neural Link with the transaction ID.</p>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-border">
                    <p className="text-[10px] text-center italic text-muted-foreground">"Justice is a service. Integrity is our bond."</p>
                 </div>
              </CardContent>
           </Card>
        </div>
      )}
    </div>
  );
}
