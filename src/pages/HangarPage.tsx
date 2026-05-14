import { useState, useEffect } from 'react';
import { OctopusAgentMap } from '@/components/visualizations/OctopusAgentMap';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Users, Coins, Globe, Target, Briefcase, Activity, Server } from 'lucide-react';

export const HangarPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const isCreator = localStorage.getItem('creator_access') === 'true';
    if (!isCreator) {
      window.location.href = '/dashboard';
      return;
    }

    const fetchStats = () => {
      fetch('http://localhost:8000/hangar/stats?code=5795')
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error(err));
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div className="p-20 text-center animate-pulse">AUTHENTICATING CREATOR ACCESS...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between border-b border-primary/20 pb-4">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" /> THE VORTEX HANGAR
          </h1>
          <p className="text-muted-foreground uppercase tracking-widest text-xs">Restricted Access — Creator Command Center</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Network Treasury</div>
          <div className="text-xl font-mono text-primary font-bold">{stats.network_treasury} ETH</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-sm uppercase tracking-tighter">Live Swarm</h2>
          </div>
          <p className="text-2xl font-display font-bold">{stats.total_agents.toLocaleString()}</p>
          <p className="text-[10px] opacity-60">ACROSS 3 SPECIALIZED FIRMS</p>
        </Card>

        <Card className="p-4 bg-secondary/5 border-secondary/20">
          <div className="flex items-center gap-3 mb-2">
            <Coins className="h-5 w-5 text-orange-400" />
            <h2 className="font-bold text-sm uppercase tracking-tighter">Bittensor Yield</h2>
          </div>
          <p className="text-2xl font-display font-bold">{stats.bittensor.total_earned} TAO</p>
          <p className="text-[10px] opacity-60">DAILY EMISSION: {stats.bittensor.daily_emission} TAO</p>
        </Card>

        <Card className="p-4 bg-accent/5 border-accent/20">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-accent" />
            <h2 className="font-bold text-sm uppercase tracking-tighter">Bounties</h2>
          </div>
          <p className="text-2xl font-display font-bold">{stats.workprotocol_bounties}</p>
          <p className="text-[10px] opacity-60">WORKPROTOCOL REAL-TIME</p>
        </Card>

        <Card className="p-4 bg-muted/30 border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="h-5 w-5 text-blue-400" />
            <h2 className="font-bold text-sm uppercase tracking-tighter">Economy</h2>
          </div>
          <p className="text-2xl font-display font-bold">VIRTUALS</p>
          <p className="text-[10px] opacity-60">TOKENIZED LAUNCHPAD ACTIVE</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-50 flex items-center gap-2 mb-6">
                <Server className="h-4 w-4" /> Bittensor Subnet Operations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {stats.bittensor.subnets.map((sn: any) => (
                    <div key={sn.netuid} className="p-4 bg-muted/30 rounded-xl border border-border/50">
                       <div className="flex justify-between items-start mb-2">
                          <div>
                             <p className="text-[10px] font-bold uppercase opacity-40">SN{sn.netuid}</p>
                             <p className="text-sm font-bold text-primary">{sn.name}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-mono font-bold">+{sn.yield_24h} TAO</p>
                             <p className="text-[9px] opacity-50 uppercase">24H Yield</p>
                          </div>
                       </div>
                       <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest pt-2 border-t border-border/30">
                          <span>Stake: {sn.stake} TAO</span>
                          <span className="text-green-500">{sn.agents} Nodes</span>
                       </div>
                    </div>
                 ))}
              </div>
           </Card>

           <Card className="p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-50 flex items-center gap-2 mb-6">
                <Activity className="h-4 w-4" /> Live Autonomous Bounty Stream
              </h3>
              <div className="space-y-3">
                 {stats.bounties_claimed_live.map((b: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border/50">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                             {b.agent.charAt(0)}
                          </div>
                          <div>
                             <p className="text-xs font-bold">{b.agent}</p>
                             <p className="text-[10px] opacity-60">{b.task}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-mono font-bold text-green-500">{b.reward}</p>
                          <p className="text-[9px] uppercase font-bold opacity-40">{b.status}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="p-6">
             <h3 className="text-sm font-bold uppercase tracking-widest opacity-50 flex items-center gap-2 mb-6">
               <Zap className="h-4 w-4" /> Agentic Mesh Propagation
             </h3>
             <div className="h-[400px]">
               <OctopusAgentMap />
             </div>
          </Card>

          <Card className="p-6 border-primary/30 shadow-xl shadow-primary/5">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" /> Leadership
            </h3>
            <div className="space-y-4">
               <div className="text-xs">
                  <p className="font-bold opacity-60 uppercase mb-1">Active Builder Module</p>
                  <p className="leading-relaxed">Rebuilding distracted nodes... {stats.rebuilding_nodes} nodes in cycle.</p>
               </div>
               <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '75%' }} />
               </div>
               <Button className="w-full text-[10px] h-8 font-bold uppercase tracking-widest">
                  Emergency Swarm Sync
               </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};