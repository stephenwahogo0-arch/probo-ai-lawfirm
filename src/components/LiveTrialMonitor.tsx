import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Activity } from 'lucide-react';

interface Event {
  id: string;
  type: 'cancellation' | 'amplification';
  message: string;
  agent: string;
}

export const LiveTrialMonitor: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const OPPOSING_CLAIMS = [
    "Unreliable Witness Testimony",
    "Illegal Search Warrant",
    "Inadmissible Digital Trace",
    "Statute of Limitations Expiry",
    "Prosecutorial Overreach",
    "Chain of Custody Defect"
  ];

  const WINNING_VECTORS = [
    "Constitutional Privacy Shield",
    "Precedent: State v. VORTEX (2025)",
    "Quantum-Simulated Alibi",
    "Forensic Error Neutralization",
    "Jurisdictional Immunity Claim"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const isCancellation = Math.random() > 0.5;
      const newEvent: Event = {
        id: Math.random().toString(36).substr(2, 9),
        type: isCancellation ? 'cancellation' : 'amplification',
        agent: `VORTEX Sub-Node ${Math.floor(Math.random() * 99999)}`,
        message: isCancellation 
          ? `Neutralizing Opposing Claim: ${OPPOSING_CLAIMS[Math.floor(Math.random() * OPPOSING_CLAIMS.length)]}`
          : `Amplifying Winning Vector: ${WINNING_VECTORS[Math.floor(Math.random() * WINNING_VECTORS.length)]}`
      };

      setEvents(prev => [newEvent, ...prev].slice(0, 5));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-black/40 backdrop-blur-xl border border-primary/20 shadow-2xl rounded-3xl overflow-hidden relative min-h-[300px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <Activity className="h-4 w-4 text-primary animate-pulse" />
           <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Live Quantum Interference Cancellation</span>
        </div>
        <div className="text-[9px] font-mono opacity-50 uppercase">Active Agents: 3.3M</div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-4 rounded-xl border flex items-start gap-4 ${
                event.type === 'cancellation' 
                  ? 'border-red-500/20 bg-red-500/5' 
                  : 'border-green-500/20 bg-green-500/5'
              }`}
            >
              <div className={`mt-1 ${event.type === 'cancellation' ? 'text-red-400' : 'text-green-400'}`}>
                {event.type === 'cancellation' ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] font-mono opacity-40 uppercase tracking-tighter">{event.agent}</span>
                  <span className={`text-[7px] px-1.5 py-0.5 rounded-full border ${
                    event.type === 'cancellation' ? 'border-red-500/30 text-red-500' : 'border-green-500/30 text-green-500'
                  }`}>
                    {event.type.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs font-bold leading-tight">{event.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-shimmer" />
    </div>
  );
};
