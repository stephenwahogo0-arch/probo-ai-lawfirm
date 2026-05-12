import { useState, useEffect } from 'react';
import { Scale, Zap, Database, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function LiveTrialMonitor() {
  const [activeNodes, setActiveNodes] = useState<number>(0);
  const [logs, setLogs] = useState<{ id: string, msg: string, type: 'major' | 'minor' | 'system' }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNodes(Math.floor(Math.random() * 500000) + 9000000);
      
      const newLog = {
        id: Math.random().toString(36),
        msg: [
          "Major Agent Justice Vanguard requesting Precedent Audit...",
          "Minor Node 442,109 providing Tort Law feedback.",
          "Quantum Superposition collapsing on Argument Cluster B.",
          "Builder Agent verifying logic integrity...",
          "VORTEX: Interference pattern stabilized.",
          "Syncing knowledge across 195 jurisdictions."
        ][Math.floor(Math.random() * 6)],
        type: ['major', 'minor', 'minor', 'system', 'system', 'system'][Math.floor(Math.random() * 6)] as any
      };
      
      setLogs(prev => [newLog, ...prev.slice(0, 5)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-foreground text-background rounded-3xl p-8 shadow-2xl space-y-8 overflow-hidden relative border-4 border-primary/20">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Zap className="w-40 h-40 animate-pulse" />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <Scale className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-display font-black uppercase tracking-widest">Quantum Law Monitor</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary animate-pulse">
              <ShieldAlert className="h-3 w-3" />
              LIVE CASE DEFENSE ACTIVE
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Active Network Threads</div>
          <div className="text-2xl font-black text-primary">{activeNodes.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-primary">Inter-Agent Communication Bus</h4>
          <div className="space-y-4">
            {logs.map(log => (
              <div key={log.id} className="flex gap-3 animate-in slide-in-from-left-2 duration-300">
                <div className={cn(
                  "w-1 h-10 rounded-full shrink-0",
                  log.type === 'major' ? "bg-primary" : log.type === 'minor' ? "bg-accent" : "bg-muted"
                )} />
                <div>
                  <div className="text-[10px] font-black uppercase opacity-40">{log.type} node</div>
                  <div className="text-xs font-bold leading-tight">{log.msg}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-accent">Vortex Reasoning Phase</h4>
            <div className="flex items-center justify-between">
              {['Map', 'Entangle', 'Amplify', 'Collapse'].map((phase, i) => (
                <div key={phase} className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center",
                    i < 3 ? "border-accent bg-accent/20 text-accent" : "border-white/10 text-white/20 animate-pulse"
                  )}>
                    {i < 3 ? <CheckCircle2 className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-tighter">{phase}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
            <div className="flex items-center gap-3 mb-2">
              <Database className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Major Agent Knowledge Synthesis</span>
            </div>
            <div className="text-xs font-bold text-white/80 leading-relaxed italic">
              "Integrating feedback from 200,000 minor nodes specializing in Constitutional Law. Strengthening 'Due Process' vector by 14.5%."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
