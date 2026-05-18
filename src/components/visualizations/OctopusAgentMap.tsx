import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  type: 'Major' | 'Minor' | 'Sub';
  x: number;
  y: number;
  label: string;
}

interface Connection {
  from: string;
  to: string;
}

export const OctopusAgentMap: React.FC = () => {
  const { initialNodes, initialConnections } = useMemo(() => {
    const centerX = 400;
    const centerY = 300;
    const majorNode: Node = { id: 'major-1', type: 'Major', x: centerX, y: centerY, label: 'MAJOR AGENT' };
    
    const nodes: Node[] = [majorNode];
    const conns: Connection[] = [];

    for (let i = 0; i < 8; i++) {
      const angle = (i * 2 * Math.PI) / 8;
      const x = centerX + Math.cos(angle) * 150;
      const y = centerY + Math.sin(angle) * 150;
      const minorId = `minor-${i}`;
      nodes.push({ id: minorId, type: 'Minor', x, y, label: `MINOR ${i}` });
      conns.push({ from: 'major-1', to: minorId });

      for (let j = 0; j < 3; j++) {
        const subAngle = angle + (j - 1) * 0.3;
        const subX = x + Math.cos(subAngle) * 80;
        const subY = y + Math.sin(subAngle) * 80;
        const subId = `sub-${i}-${j}`;
        nodes.push({ id: subId, type: 'Sub', x: subX, y: subY, label: `SUB ${j}` });
        conns.push({ from: minorId, to: subId });
      }
    }
    return { initialNodes: nodes, initialConnections: conns };
  }, []);

  const [nodes] = useState<Node[]>(initialNodes);
  const [connections] = useState<Connection[]>(initialConnections);
  const [activeComm, setActiveComm] = useState<{ id: string, type: 'legal' | 'finance' } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomConn = connections[Math.floor(Math.random() * connections.length)];
      const type = Math.random() > 0.3 ? 'legal' : 'finance';
      setActiveComm({ id: `${randomConn.from}->${randomConn.to}`, type });
      setTimeout(() => setActiveComm(null), 1200);
    }, 1800);

    return () => clearInterval(interval);
  }, [connections]);

  return (
    <div className="relative w-full h-[600px] bg-background/50 rounded-xl overflow-hidden border border-border/50 backdrop-blur-sm shadow-inner">
      <svg width="100%" height="100%" viewBox="0 0 800 600">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {connections.map((conn, i) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          const isActive = activeComm?.id === `${conn.from}->${conn.to}`;
          const pulseColor = activeComm?.type === 'finance' ? '#FACC15' : '#60A5FA';

          return (
            <g key={i}>
              <line
                x1={fromNode.x} y1={fromNode.y}
                x2={toNode.x} y2={toNode.y}
                stroke="currentColor" strokeWidth="1" strokeOpacity="0.1"
                className="text-foreground"
              />
              {isActive && (
                <motion.line
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  x1={fromNode.x} y1={fromNode.y}
                  x2={toNode.x} y2={toNode.y}
                  stroke={pulseColor} strokeWidth="2" filter="url(#glow)"
                />
              )}
            </g>
          );
        })}

        {nodes.map((node) => (
          <motion.g
            key={node.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
          >
            <circle
              cx={node.x} cy={node.y}
              r={node.type === 'Major' ? 14 : node.type === 'Minor' ? 7 : 4}
              fill={node.type === 'Major' ? pulseColorForNode(node.id, activeComm) : 'currentColor'}
              className="text-foreground opacity-80"
              filter="url(#glow)"
            />
            {node.type !== 'Sub' && (
              <text
                x={node.x} y={node.y + 28}
                textAnchor="middle" fontSize="10" fontWeight="bold"
                fill="currentColor" className="opacity-40 uppercase tracking-tighter"
              >
                {node.label}
              </text>
            )}
          </motion.g>
        ))}
      </svg>
      
      <div className="absolute top-4 left-4 flex gap-4">
        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Legal Reasoning
        </div>
        <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" /> Financial Settlement
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 font-bold">
        VORTEX MESH — CONFIGURED CAPACITY: 9,999,999
      </div>
    </div>
  );
};

function pulseColorForNode(id: string, active: any) {
  if (active?.id.includes(id)) {
    return active.type === 'finance' ? '#FACC15' : '#60A5FA';
  }
  return 'var(--primary)';
}
