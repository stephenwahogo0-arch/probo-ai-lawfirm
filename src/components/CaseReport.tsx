
export default function CaseReport({ report }: { report: string }) {
  const sections = report.split('##').filter(Boolean);
  return (
    <div className="space-y-10">
       <div className="flex items-center gap-4 text-primary mb-8 border-b border-primary/10 pb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Extraction Complete • Win Confidence 99.99%</span>
       </div>
       {sections.map((s, i) => {
         const [title, ...content] = s.split('\n');
         return (
           <div key={i} className="space-y-4">
              <h3 className="text-primary font-black uppercase tracking-widest text-xs border-l-4 border-primary pl-4">{title.trim()}</h3>
              <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap pl-5">{content.join('\n').trim()}</div>
           </div>
         );
       })}
    </div>
  );
}
