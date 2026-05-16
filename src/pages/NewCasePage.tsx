import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Zap, Globe, Shield, ArrowRight, Briefcase, Heart, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CASE_TYPES = ['Criminal Law', 'Civil Law', 'Corporate Law', 'Constitutional Law', 'IP Law', 'Family Law'];

export default function NewCasePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  
  const userFirm = localStorage.getItem('user_firm') || 'Corporate';
  
  const [form, setForm] = useState({
    title: '',
    case_type: userFirm === 'Family Law' ? 'Family Law' : (userFirm === 'Criminal Defense' ? 'Criminal Law' : 'Corporate Law'),
    jurisdiction: '',
    description: ''
  });

  useEffect(() => {
    fetch(`/_/backend/agents?firm_type=${userFirm}`)
      .then(res => res.json())
      .then(data => {
        setAgents(data);
        if (data.length > 0) setSelectedAgent(data[0].id);
      });
  }, [userFirm]);

  const pollStatus = (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/_/backend/status/${jobId}\ Spectrum`);
        const data = await res.json();
        
        if (data.progress) setProgress(data.progress);
        if (data.logs) setLogs(data.logs);
        
        if (data.status === 'completed') {
          clearInterval(interval);
          navigate(`/cases/${jobId}`);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProgress(5);
    
    const isCreator = localStorage.getItem('user_email') === 'stephenwahogoka0@gmail.com';
    
    try {
      const res = await fetch('/_/backend/dossiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...form, 
          creator_bypass: isCreator,
          firm_division: userFirm,
          lead_agent_id: selectedAgent
        })
      });
      const data = await res.json();
      pollStatus(data.jobId);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const firmIcon = {
    'Corporate': Briefcase,
    'Criminal Defense': Shield,
    'Family Law': Heart
  }[userFirm as 'Corporate' | 'Criminal Defense' | 'Family Law'] || Scale;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-10 animate-in fade-in max-w-2xl mx-auto">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <Zap className="absolute inset-0 m-auto h-10 w-10 text-primary animate-pulse" />
        </div>
        <div className="text-center space-y-4 w-full">
          <h2 className="text-3xl font-display font-bold uppercase tracking-widest text-primary">
            Mesh Synchronization
          </h2>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden shadow-inner border border-border/50">
             <div className="h-full bg-primary transition-all duration-1000 shadow-[0_0_15px_rgba(var(--primary),0.5)]" style={{ width: `${progress}%` }} />
          </div>
          <div className="bg-black/5 p-6 rounded-2xl border border-border/50 text-left font-mono text-[10px] uppercase h-32 overflow-y-auto space-y-1">
             {logs.map((log, i) => (
                <div key={i} className="flex gap-3">
                   <span className="text-primary font-bold">✓</span>
                   <span className="opacity-70">{log}</span>
                </div>
             ))}
             <div className="animate-pulse">_ EXECUTION IN PROGRESS...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700 pb-24">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 shadow-lg">
           {React.createElement(firmIcon, { className: "h-8 w-8 text-primary" })}
        </div>
        <h1 className="text-4xl font-display font-bold">Initialize Legal Vector</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold opacity-60">
           Deploying {userFirm} Swarm Node 1.2
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="space-y-4">
           <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60">
              <UserCheck className="h-4 w-4" /> 1. Assign Lead Counsel
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {agents.map((agent) => (
                 <Card 
                    key={agent.id} 
                    onClick={() => setSelectedAgent(agent.id)}
                    className={`p-4 cursor-pointer transition-all border-2 ${selectedAgent === agent.id ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' : 'border-border/50 opacity-60 hover:opacity-100'}`}
                 >
                    <p className="text-[10px] font-bold uppercase text-primary mb-1">{agent.role}</p>
                    <p className="font-bold text-sm">{agent.name}</p>
                    <div className="mt-3 flex justify-between items-center text-[9px] font-bold uppercase tracking-tighter opacity-50">
                       <span>Win Rate: 100%</span>
                       <span>Active Mesh</span>
                    </div>
                 </Card>
              ))}
           </div>
        </section>

        <Card className="p-8 space-y-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-60">Case Title</label>
              <Input 
                placeholder="e.g. State vs. John Doe" 
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                required
                className="bg-background/50 h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-60">Legal Domain</label>
              <select 
                className="w-full bg-background/50 border border-border h-12 px-3 rounded-md text-sm font-medium"
                value={form.case_type}
                onChange={e => setForm({...form, case_type: e.target.value})}
              >
                {CASE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-60">Jurisdiction</label>
            <Input 
              placeholder="e.g. United Kingdom — High Court" 
              value={form.jurisdiction}
              onChange={e => setForm({...form, jurisdiction: e.target.value})}
              required
              className="bg-background/50 h-12"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-60">Case Description</label>
            <Textarea 
              placeholder="Provide exhaustive details for probability collapse..." 
              className="min-h-[250px] bg-background/50 leading-relaxed rounded-2xl"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              required
            />
          </div>
        </Card>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[10px] uppercase font-bold opacity-40">
             <div className="flex items-center gap-1"><Shield className="h-3 w-3" /> Encrypted</div>
             <div className="flex items-center gap-1"><Globe className="h-3 w-3" /> 195 Nations</div>
          </div>
          <Button type="submit" disabled={loading} className="px-12 h-16 gap-3 text-xl font-bold shadow-2xl shadow-primary/30 rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <Zap className="h-6 w-6" /> MOBILIZE COUNSEL <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
