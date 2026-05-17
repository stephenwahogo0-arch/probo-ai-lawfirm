import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Zap, Globe, Shield, Loader2, ArrowRight, Briefcase, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CASE_TYPES = ['Criminal Law', 'Civil Law', 'Corporate Law', 'Constitutional Law', 'IP Law', 'Family Law'];

export default function NewCasePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userFirm = localStorage.getItem('user_firm') || 'Corporate';
  
  const [form, setForm] = useState({
    title: '',
    case_type: userFirm === 'Family Law' ? 'Family Law' : (userFirm === 'Criminal Defense' ? 'Criminal Law' : 'Corporate Law'),
    jurisdiction: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const isCreator = localStorage.getItem('user_email') === 'stephenwahogoka0@gmail.com';
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/dossiers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...form, 
          creator_bypass: isCreator,
          firm_division: userFirm 
        })
      });
      const data = await res.json();
      navigate(`/cases/${data.id}`);
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

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
           {React.createElement(firmIcon, { className: "h-8 w-8 text-primary" })}
        </div>
        <h1 className="text-4xl font-display font-bold">{userFirm} Intake</h1>
        <p className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
           Initializing {userFirm === 'Corporate' ? '3.3M' : '3.3M'} nodes for specialized legal vectoring
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-8 space-y-6 bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-60">Case Title / Reference</label>
              <Input 
                placeholder="e.g. Acme Corp Merger" 
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                required
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest opacity-60">Legal Domain</label>
              <select 
                className="w-full bg-background/50 border border-border h-10 px-3 rounded-md text-sm font-medium"
                value={form.case_type}
                onChange={e => setForm({...form, case_type: e.target.value})}
              >
                {CASE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-60">Jurisdiction (Target Court)</label>
            <Input 
              placeholder="e.g. Kenya — High Court" 
              value={form.jurisdiction}
              onChange={e => setForm({...form, jurisdiction: e.target.value})}
              required
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest opacity-60">Full Case Description</label>
            <Textarea 
              placeholder="Provide exhaustive details. The VORTEX mesh requires precise data for probability collapse..." 
              className="min-h-[250px] bg-background/50 leading-relaxed"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              required
            />
          </div>
        </Card>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[10px] uppercase font-bold opacity-40">
             <div className="flex items-center gap-1"><Shield className="h-3 w-3" /> Encrypted Transmission</div>
             <div className="flex items-center gap-1"><Globe className="h-3 w-3" /> Global Node Mesh</div>
          </div>
          <Button type="submit" disabled={loading} className="px-10 h-14 gap-3 text-lg font-bold shadow-xl shadow-primary/20">
            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Zap className="h-6 w-6" />}
            MOBILIZE {userFirm.toUpperCase()} SWARM <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
