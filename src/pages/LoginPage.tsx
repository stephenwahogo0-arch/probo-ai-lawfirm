import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Zap, Shield, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const FIRMS = [
  { id: 'Corporate', label: 'Corporate Law Firm', icon: Briefcase },
  { id: 'Criminal Defense', label: 'Criminal Defense', icon: Shield },
  { id: 'Family Law', label: 'Family Law Firm', icon: Scale }
];

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [selectedFirm, setSelectedFirm] = useState('Corporate');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user_firm', selectedFirm);
    
    if (phone === '5795') {
      localStorage.setItem('creator_access', 'true');
      localStorage.setItem('user_email', 'stephenwahogoka0@gmail.com');
      navigate('/hangar');
    } else {
      localStorage.setItem('user_email', 'user@example.com');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
          <Scale className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl tracking-tighter">PROBO</h1>
          <p className="text-xs text-primary/70 uppercase tracking-[0.2em] font-bold">Vortex Law Singularity</p>
        </div>
      </div>

      <Card className="w-full max-w-lg p-8 space-y-8 backdrop-blur-sm border-border/50 shadow-2xl">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold tracking-tight">Onboard Your Agent Mesh</h2>
          <p className="text-sm text-muted-foreground italic">"Choose your legal vector. Initialize the swarm."</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest opacity-60">1. Select Firm Division</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {FIRMS.map((firm) => (
                <button
                  key={firm.id}
                  type="button"
                  onClick={() => setSelectedFirm(firm.id)}
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                    selectedFirm === firm.id ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10' : 'border-border hover:border-primary/40 opacity-60'
                  }`}
                >
                  <firm.icon className="h-5 w-5" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter leading-tight">{firm.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest opacity-60">2. Secure Mobile Entry</label>
            <input
              type="text"
              placeholder="+254 ..."
              className="w-full bg-muted/50 border border-border px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center text-xl font-mono tracking-widest"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full h-14 gap-3 text-xl font-bold">
            <Zap className="h-6 w-6" /> INITIALIZE SWARM
          </Button>
        </form>

        <div className="pt-6 border-t border-border flex justify-between items-center text-[10px] uppercase tracking-widest opacity-40 font-bold">
          <div className="flex items-center gap-1"><Shield className="h-3 w-3" /> Encrypted Mesh</div>
          <div>Vortex V1.2.5-Stable</div>
        </div>
      </Card>
      
      <p className="mt-8 text-[10px] text-muted-foreground uppercase tracking-widest opacity-30 font-bold">
        Managed by VORTEX Leadership Nodes · All 195 Jurisdictions Active
      </p>
    </div>
  );
}
