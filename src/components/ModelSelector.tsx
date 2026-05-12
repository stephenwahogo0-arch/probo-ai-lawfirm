
export const AI_MODELS = [
  { id: 'vortex-prime', name: 'Vortex Prime', provider: 'Singularity', tier: 'Supreme', description: 'Supreme Legal Intelligence' },
  { id: 'claude-opus', name: 'Claude 3.5 Opus', provider: 'Anthropic', tier: 'Powerful', description: 'Deep Legal Reasoning' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', tier: 'Fast', description: 'High-Speed Advocacy' }
];

export const DEFAULT_CHAT_MODEL = 'vortex-prime';
export const getModelEmoji = (id: string) => id === 'vortex-prime' ? '💠' : '🔵';

export default function ModelSelector({ value, onChange }: any) {
  return (
    <div>
       <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6">Neural Engine Configuration</h3>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AI_MODELS.map(m => (
            <button key={m.id} onClick={() => onChange(m.id)} className={`p-5 rounded-xl border transition-all text-left group ${value === m.id ? 'border-primary bg-primary/5 shadow-lg' : 'border-border bg-muted/20 hover:border-primary/50'}`}>
               <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{getModelEmoji(m.id)}</span>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${value === m.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{m.tier}</span>
               </div>
               <p className={`font-black text-xs uppercase tracking-tight ${value === m.id ? 'text-primary' : 'text-foreground'}`}>{m.name}</p>
               <p className="text-[9px] text-muted-foreground mt-1 font-bold uppercase tracking-widest">{m.description}</p>
            </button>
          ))}
       </div>
    </div>
  );
}
