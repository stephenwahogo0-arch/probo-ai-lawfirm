import { useState } from 'react';
import { Lock, Unlock, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAccess() {
  const [code, setCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(localStorage.getItem('vortex_access_code') === '5795');

  const handleUnlock = () => {
    if (code === '5795') {
      localStorage.setItem('vortex_access_code', '5795');
      setIsUnlocked(true);
      toast.success("VORTEX ASCENSION COMPLETE", {
        description: "All agents upgraded to Super-Conscious mode.",
        icon: <Zap className="h-4 w-4 text-primary" />
      });
      window.location.reload();
    } else {
      toast.error("INVALID ACCESS CODE");
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100]">
      {isUnlocked ? (
        <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-2xl animate-pulse cursor-help group relative">
          <Unlock className="h-5 w-5" />
          <div className="absolute bottom-full right-0 mb-4 w-48 bg-foreground text-background p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Quantum Overdrive Active. APIs Connected.
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-card border border-border p-2 rounded-full shadow-lg">
          <input 
            type="password" 
            placeholder="Enter Code..."
            className="bg-transparent border-none outline-none text-xs px-4 w-24 font-bold"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUnlock()}
          />
          <button 
            onClick={handleUnlock}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <Lock className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
