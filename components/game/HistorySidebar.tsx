import React, { useMemo } from 'react';
import { History } from 'lucide-react';
import { useStore } from '../../store';
import { HistoryItem } from '../../types';

export const HistorySidebar: React.FC = () => {
  const { history, zoomStage } = useStore();

  const groupedHistory = useMemo(() => {
    const groups: { wheel?: HistoryItem; number?: HistoryItem; id: string }[] = [];
    let i = 0;
    while (i < history.length) {
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

  return (
    <div className={`flex-1 md:max-w-sm flex flex-col justify-end gap-6 z-20 pb-12 md:pb-0 h-full max-h-[90vh] pt-32 md:pt-40 transition-opacity duration-500 ${zoomStage !== 'IDLE' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex-1 hidden md:flex flex-col glass p-6 rounded-3xl shadow-2xl overflow-hidden">
        <h3 className="text-gray-400 text-xs font-bold uppercase mb-4 tracking-widest flex items-center gap-2 opacity-80 font-display">
            <History className="w-4 h-4" /> Historique
        </h3>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-none hover:scrollbar-thin scrollbar-thumb-white/20">
            {groupedHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 text-center opacity-40">
                <span className="text-3xl mb-3 grayscale opacity-50">🎡</span>
                <p className="text-xs font-medium uppercase tracking-widest">En attente de jeu</p>
            </div>
            ) : (
            groupedHistory.map((group) => (
                <div key={group.id} className="relative overflow-hidden group rounded-xl bg-white/5 border border-white/5 p-0 hover:bg-white/10 transition-colors">
                    <div className="p-4 flex flex-col gap-3">
                        {group.wheel && (
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-6 h-6 rounded bg-brand-purple/20 flex items-center justify-center text-xs shrink-0 border border-brand-purple/30">🎁</div>
                                <div className="min-w-0">
                                    <div className="text-[9px] text-brand-purple uppercase font-bold tracking-wider mb-0.5 font-display">Lot</div>
                                    <div className="text-sm font-bold text-white leading-tight">{group.wheel.value}</div>
                                </div>
                            </div>
                        )}
                        {group.wheel && group.number && <div className="ml-7 w-[2px] h-3 bg-white/10 rounded-full"></div>}
                        {group.number && (
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-brand-blue/20 flex items-center justify-center text-xs font-mono font-bold text-brand-blue shrink-0 border border-brand-blue/30">#</div>
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="min-w-0">
                                        <div className="text-[9px] text-brand-blue uppercase font-bold tracking-wider mb-0.5 font-display">Numéro</div>
                                    </div>
                                    <div className="ml-auto text-2xl font-black text-white tracking-tighter tabular-nums font-display">{group.number.value}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))
            )}
        </div>
        </div>
    </div>
  );
};
