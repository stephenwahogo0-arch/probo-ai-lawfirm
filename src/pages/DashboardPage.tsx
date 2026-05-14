import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Scale, Zap, Clock, ShieldCheck, ChevronRight, 
  Briefcase, Shield, Heart, CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [functions, setFunctions] = useState<string[]>([]);
  const userFirm = localStorage.getItem('user_firm') || 'Corporate';

  useEffect(() => {
    fetch('http://localhost:8000/dossiers')
      .then(res => res.json())
      .then(data => {
        setCases(data);
        setLoading(false);
      });
      
    fetch('http://localhost:8000/hangar/stats?code=5795')
      .then(res => res.json())
      .then(data => {
        setFunctions(data.firm_functions[userFirm] || []);
      });
  }, [userFirm]);

  const firmConfig = {
    'Corporate': { icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    'Criminal Defense': { icon: Shield, color: 'text-red-500', bg: 'bg-red-500/10' },
    'Family Law': { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-500/10' }
  }[userFirm as keyof typeof firmConfig] || { icon: Scale, color: 'text-primary', bg: 'bg-primary/10' };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
           <div className={`w-14 h-14 rounded-2xl ${firmConfig.bg} flex items-center justify-center border border-border/50`}>
              <firmConfig.icon className={`h-8 w-8 ${firmConfig.color}`} />
           </div>
           <div>
              <h1 className="text-3xl font-display font-bold">{userFirm} Hub</h1>
              <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Synchronized Swarm: 3,334,000 Agents</p>
           </div>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/consult"><Zap className="h-4 w-4" /> Consult Counsel</Link>
          </Button>
          <Button asChild className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            <Link to="/cases/new"><Plus className="h-4 w-4" /> Submit Vector</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
              <Scale className="h-4 w-4" /> Core Firm Functions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {functions.map((fn, i) => {
                 const [title, desc] = fn.split(':');
                 return (
                   <Card key={i} className="p-4 bg-card/30 border-border/50 hover:border-primary/30 transition-colors">
                      <p className="text-xs font-bold text-primary mb-1 flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3" /> {title}
                      </p>
                      <p className="text-[10px] leading-relaxed opacity-70">{desc}</p>
                   </Card>
                 );
               })}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Recent Swarm Analysis
            </h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-24 w-full bg-muted animate-pulse rounded-2xl" />)}
              </div>
            ) : cases.length === 0 ? (
              <Card className="border-dashed py-20 text-center bg-transparent border-2">
                <p className="text-muted-foreground italic font-medium">No cases currently entangled in the {userFirm} mesh.</p>
                <Button asChild variant="link" className="mt-2"><Link to="/cases/new">Initialize First Vector</Link></Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {cases.map((c) => (
                  <Link key={c.id} to={`/cases/${c.id}`}>
                    <Card className="p-5 hover:border-primary/50 transition-all group cursor-pointer bg-card/50 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-xl">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{c.title}</h3>
                            {c.payment_committed && <ShieldCheck className="h-4 w-4 text-green-500" />}
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="text-[10px] uppercase font-bold py-0">{c.case_type}</Badge>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold border-l border-border pl-3">{c.jurisdiction}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-6 w-6 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
        
        <div className="space-y-6">
           <Card className="h-fit border-border/50 bg-muted/20">
              <div className="p-6 border-b border-border bg-card/30">
                 <h3 className="font-display font-bold text-lg mb-1">Leadership Node</h3>
                 <p className="text-[10px] uppercase tracking-widest opacity-60">Synchronized Counsel</p>
              </div>
              <div className="p-6 space-y-6">
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">M</div>
                    <div>
                       <p className="text-xs font-bold uppercase tracking-tighter">Managing Partner</p>
                       <p className="text-[10px] leading-relaxed opacity-70 mt-1 italic">
                          "Overseeing the absolute victory of all {userFirm} dossiers with quantum precision."
                       </p>
                    </div>
                 </div>
                 <div className="space-y-3 pt-4 border-t border-border">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Mesh Capabilities</p>
                    <div className="grid grid-cols-2 gap-2">
                       {['Supersedeas', 'Certiorari', 'Discovery', 'Litigation'].map(cap => (
                          <div key={cap} className="px-2 py-1 bg-background border border-border rounded text-[9px] font-bold text-center opacity-70">{cap}</div>
                       ))}
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="p-6 border-primary/20 bg-primary/5">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Quantum Win Strategy</h3>
              <p className="text-[10px] leading-relaxed opacity-80 mb-4">
                Our {userFirm} swarm uses "Superposition Mapping" to explore every possible procedural path simultaneously.
              </p>
              <div className="space-y-2">
                 <div className="flex justify-between text-[9px] font-bold uppercase tracking-tighter">
                    <span>Probability</span>
                    <span className="text-primary">100%</span>
                 </div>
                 <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
