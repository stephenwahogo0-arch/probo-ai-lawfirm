import React, { useState, useEffect } from 'react';
import { OctopusAgentMap } from '@/components/visualizations/OctopusAgentMap';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Zap, Users, Coins, 
  Server, Hammer, Clock, Wrench, Activity, ShieldCheck, Lock, AlertOctagon
} from 'lucide-react';

export const HangarPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const isCreator = localStorage.getItem('creator_access') === 'true';
    if (!isCreator) {
      window.location.href = '/dashboard';
      return;
    }

    const fetchStats = () => {
      fetch('/_/backend/hangar/stats?code=5795')
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error(err));
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div className="p-20 text-center animate-pulse text-primary font-display font-bold uppercase tracking-widest text-2xl">Establishing Secure Uplink...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-24 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-primary/20 pb-6">
        <div>
          <h1 className="text-4xl font-display font-bold flex items-center gap-4">
            <Shield className="h-10 w-10 text-primary" /> VORTEX HANGAR
          </h1>
          <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-bold mt-2">Creator Command Center — Restricted Zero-Knowledge Zone</p>
        </div>
        <div className="flex gap-6 text-right">
           <div>
              <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-50 mb-1">Security Status</div>
              <div className="flex items-center gap-2 text-green-500 font-mono font-black">
                 <ShieldCheck className="h-4 w-4" /> {stats.security.status}
              </div>
           </div>
           <div>
              <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-50 mb-1">Treasury Core</div>
              <div className="text-3xl font-mono text-primary font-black tracking-tighter">{stats.network_treasury} ETH</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-primary/5 border-primary/20 relative overflow-hidden group">
           <div className="flex items-center gap-3 mb-2">
              <AlertOctagon className="h-5 w-5 text-red-500" />
              <h2 className="font-bold text-xs uppercase tracking-widest">Blocked Attacks</h2>
           </div>
           <p className="text-3xl font-display font-bold">{stats.security.blocked_attacks.toLocaleString()}</p>
           <p className="text-[9px] opacity-40 font-bold uppercase mt-1">Intrusion Detection: ACTIVE</p>
        </Card>
        {[
          { label: "Live Swarm", val: stats.total_agents.toLocaleString(), sub: "10M+ ACTIVE NODES", icon: Users },
          { label: "Bittensor Yield", val: `${stats.bittensor.total_earned} TAO`, sub: `DAILY: ${stats.bittensor.daily_emission} TAO`, icon: Coins, color: "text-orange-400" },
          { label: "Encryption", val: stats.security.tunnel, sub: "AES-256-GCM TUNNEL", icon: Lock, color: "text-blue-400" }
        ].map((item, i) => (
          <Card key={i} className="p-6 bg-card/40 backdrop-blur-xl border-border/50 shadow-2xl relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-3 relative z-10">
              <item.icon className={`h-6 w-6 ${item.color || 'text-primary'}`} />
              <h2 className="font-black text-[10px] uppercase tracking-widest opacity-60">{item.label}</h2>
            </div>
            <p className="text-3xl font-display font-bold relative z-10 tracking-tight">{item.val}</p>
            <p className="text-[9px] font-black uppercase tracking-tighter opacity-40 mt-2 relative z-10">{item.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Card className="p-8 border-border/50 bg-black/20 rounded-3xl">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-sm font-black uppercase tracking-widest opacity-50 flex items-center gap-3">
                   <Hammer className="h-5 w-5 text-primary" /> Builder Maintenance Bay
                 </h3>
                 <Badge variant="outline" className="border-primary/30 text-primary uppercase font-black text-[9px]">Builder Agent: Active</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="p-6 bg-muted/30 rounded-2xl border border-border/50 relative">
                       <div className="flex justify-between items-center mb-4">
                          <p className="text-[10px] font-black uppercase text-primary tracking-widest">Active Reconstruction</p>
                          <Clock className="h-4 w-4 opacity-30" />
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                             <span>Self-Distracted Nodes</span>
                             <span className="text-yellow-500 font-mono">{stats.rebuilding_nodes}</span>
                          </div>
                          <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden shadow-inner border border-white/5">
                             <div className="h-full bg-primary animate-pulse" style={{ width: '65%' }} />
                          </div>
                          <p className="text-[9px] opacity-40 font-bold uppercase mt-2">Cycle Time: 30 Days Remaining</p>
                       </div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase opacity-40 tracking-widest mb-2">Repair Logs</p>
                    <div className="space-y-2 font-mono text-[9px] h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                       {[1,2,3,4,5,6].map(i => (
                          <div key={i} className="p-3 bg-muted/20 border border-border/30 rounded-lg flex items-center gap-3">
                             <Wrench className="h-3 w-3 text-primary opacity-50" />
                             <div>
                                <p className="font-bold uppercase tracking-tighter text-foreground/80">NODE_RESTORED_0x${Math.floor(Math.random() * 9999)}</p>
                                <p className="opacity-40 uppercase">Hack-Proof Kernel Injected.</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="p-8 border-border/50">
              <h3 className="text-sm font-black uppercase tracking-widest opacity-50 flex items-center gap-3 mb-8">
                <Server className="h-5 w-5" /> Bittensor Subnet Operations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {stats.bittensor.subnets.map((sn: any) => (
                    <div key={sn.netuid} className="p-5 bg-muted/30 rounded-2xl border border-border/50 hover:border-primary/40 transition-all group">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <p className="text-[9px] font-black uppercase opacity-40 tracking-widest">SN{sn.netuid}</p>
                             <p className="text-base font-display font-bold text-primary group-hover:scale-105 transition-transform origin-left">{sn.name}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-mono font-bold text-green-500">+{sn.yield_24h} TAO</p>
                             <p className="text-[8px] opacity-50 uppercase font-black tracking-tighter">24H Reward</p>
                          </div>
                       </div>
                       <div className="flex justify-between text-[9px] font-black uppercase tracking-widest pt-4 border-t border-border/30">
                          <span className="opacity-60">Stake: {sn.stake} TAO</span>
                          <span className="text-primary">{sn.agents} Mining Nodes</span>
                       </div>
                    </div>
                 ))}
              </div>
           </Card>
        </div>
        
        <div className="space-y-8">
          <Card className="p-8 border-primary/20 bg-primary/5 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
             <h3 className="font-display font-bold text-xl mb-6 uppercase tracking-widest flex items-center gap-3">
                <Zap className="h-6 w-6 text-primary" /> Secure Mesh Uplink
              </h3>
              <div className="h-[450px]">
                <OctopusAgentMap />
              </div>
          </Card>

          <Card className="p-8 border-border/50 rounded-3xl">
             <h3 className="font-display font-bold text-lg mb-6 uppercase tracking-widest flex items-center gap-2">
                <Activity className="h-4 w-4" /> Live Bounty Stream
             </h3>
             <div className="space-y-4">
                 {stats.bounties_claimed_live.map((b: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl border border-border/50 animate-in slide-in-from-bottom-2">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary text-sm shadow-inner">
                             {b.agent.charAt(0)}
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase">{b.agent}</p>
                             <p className="text-[9px] opacity-50 font-bold uppercase tracking-tight">{b.task}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-mono font-black text-green-500">{b.reward}</p>
                          <p className="text-[7px] uppercase font-black opacity-30 tracking-widest">{b.status}</p>
                       </div>
                    </div>
                 ))}
              </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
