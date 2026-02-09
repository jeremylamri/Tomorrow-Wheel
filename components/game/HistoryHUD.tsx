import React, { useMemo } from 'react';
import { History } from 'lucide-react';
import { useStore } from '../../store';
import { HistoryItem } from '../../types';

export const HistoryHUD: React.FC = () => {
  const { history, zoomStage } = useStore();

  const latestHistory = useMemo(() => {
    const groups: { wheel?: HistoryItem; number?: HistoryItem; id: string }[] = [];
    let i = 0;
    while (i < history.length && groups.length < 4) { // Limit to 4 items
      const current = history[i];
      if (current.type === 'NUMBER') {
        const next = history[i + 1];
        if (next && next.type === 'WHEEL') {
          groups.push({ id: current.id, number: current, wheel: next });
          i += 2;
          continue;
        } else {
          groups.push({ id: current.id, number: current });
          i++;
          continue;
        }
      }
      if (current.type === 'WHEEL') {
         groups.push({ id: current.id, wheel: current });
         i++;
      }
    }
    return groups;
  }, [history]);

  if (latestHistory.length === 0) return null;

  return (
    <div className={`absolute bottom-8 right-8 z-30 flex flex-col items-end gap-3 transition-all duration-500 ${zoomStage !== 'IDLE' ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
        
        <div className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
            <History className="w-3 h-3" /> Derniers Tirages
        </div>

        {latestHistory.map((group, idx) => (
            <div 
                key={group.id} 
                className="relative overflow-hidden rounded-xl bg-black/40 backdrop-blur-md border border-white/10 p-4 w-72 shadow-xl animate-in slide-in-from-right fade-in duration-500"
                style={{ opacity: 1 - (idx * 0.2), transform: `scale(${1 - (idx * 0.05)})`, transformOrigin: 'right bottom' }}
            >
                <div className="flex flex-col gap-2">
                    {group.wheel && (
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-purple shadow-[0_0_8px_#BF5AF2]"></div>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-bold text-white truncate leading-tight">{group.wheel.value}</div>
                            </div>
                        </div>
                    )}
                    
                    {group.wheel && group.number && <div className="ml-[6px] w-[1px] h-2 bg-white/10"></div>}
                    
                    {group.number && (
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-blue shadow-[0_0_8px_#0A84FF]"></div>
                            <div className="flex items-center justify-between flex-1">
                                <div className="text-[10px] text-brand-blue uppercase font-bold tracking-wider opacity-80">Numéro</div>
                                <div className="text-xl font-black text-white tracking-tighter tabular-nums font-display">{group.number.value}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        ))}
    </div>
  );
};