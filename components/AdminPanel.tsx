import React, { useState } from 'react';
import { useStore } from '../store';
import { X, Plus, Trash2, Settings, RefreshCcw, Hash, Activity } from 'lucide-react';
import { runRandomnessDiagnostic } from '../utils/testRandomness';

export const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { lots, addLot, removeLot, vipMode, toggleVipMode, forcedLotId, setForcedLot, resetAll, maxNumber, setMaxNumber } = useStore();
  const [newLotName, setNewLotName] = useState("");

  const handleAdd = () => {
    if (newLotName.trim()) {
      addLot(newLotName);
      setNewLotName("");
    }
  };

  const handleReset = () => {
    if (window.confirm('ATTENTION: Effacer toute la mémoire des gains (roue et numéros) ? Cette action est irréversible.')) {
      // 1. Clear State
      resetAll();
      
      // 2. Clear Visuals (Confetti)
      if ((window as any).confetti) {
        (window as any).confetti.reset();
      }

      // 3. Close Admin Panel to show the fresh result immediately
      onClose();
    }
  };

  const handleDiagnostic = () => {
    const report = runRandomnessDiagnostic(1000);
    const message = report.rawLogs.join('\n');
    alert(message);
    console.table(report.buckets);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-[#1C1C1E] w-full max-w-2xl max-h-[90vh] rounded-3xl border border-gray-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-purple" />
            Admin Configuration
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Controls */}
          <div className="space-y-4">
             <h3 className="text-sm font-medium text-gray-400 uppercase">Contrôles du jeu</h3>
             <div className="grid grid-cols-2 gap-4">
                <button 
                   onClick={toggleVipMode}
                   className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${vipMode ? 'bg-brand-purple/20 border-brand-purple text-brand-purple' : 'bg-white/5 border-white/10 text-gray-400'}`}
                >
                   <span className="font-bold">Mode VIP</span>
                   <span className="text-xs opacity-70">{vipMode ? 'ACTIVÉ - Sélectionnez un lot ci-dessous' : 'DÉSACTIVÉ - Hasard total'}</span>
                </button>
                
                <button 
                   onClick={handleReset}
                   className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all flex flex-col gap-2"
                >
                   <span className="font-bold flex items-center gap-2"><RefreshCcw className="w-4 h-4"/> Reset Mémoire</span>
                   <span className="text-xs opacity-70">Efface l'historique (garde les lots)</span>
                </button>
             </div>
          </div>

          {/* Configuration */}
           <div className="space-y-4">
             <h3 className="text-sm font-medium text-gray-400 uppercase">Configuration Tirage</h3>
             <div className="flex gap-4">
                <div className="flex-1 flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                    <Hash className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                    <div className="font-bold">Nombre Maximum</div>
                    <div className="text-xs text-gray-400">Pour le tirage aléatoire des numéros</div>
                    </div>
                    <input 
                    type="number"
                    min="1"
                    max="9999"
                    value={maxNumber}
                    onChange={(e) => setMaxNumber(Math.max(1, parseInt(e.target.value) || 100))}
                    className="w-24 bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-center font-mono font-bold focus:border-brand-blue focus:outline-none"
                    />
                </div>
                
                {/* Diagnostic Button */}
                <button 
                    onClick={handleDiagnostic}
                    className="w-24 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 flex flex-col items-center justify-center gap-1 transition-colors"
                    title="Lancer le diagnostic RNG"
                >
                    <Activity className="w-5 h-5 text-green-400" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Test RNG</span>
                </button>
             </div>
           </div>

          {/* Lots Management */}
          <div className="space-y-4">
             <h3 className="text-sm font-medium text-gray-400 uppercase">Lots de la roue ({lots.length})</h3>
             
             <div className="flex gap-2">
               <input 
                 value={newLotName}
                 onChange={(e) => setNewLotName(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                 placeholder="Nouveau lot..."
                 className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-purple transition-colors"
               />
               <button onClick={handleAdd} className="bg-brand-purple text-white px-4 rounded-xl hover:bg-brand-darkPurple transition-colors">
                 <Plus className="w-6 h-6" />
               </button>
             </div>

             <div className="space-y-2">
               {lots.map(lot => (
                 <div 
                    key={lot.id} 
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${vipMode && forcedLotId === lot.id ? 'bg-brand-purple/20 border-brand-purple' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                    onClick={() => vipMode && setForcedLot(lot.id)}
                 >
                   <span className="font-medium truncate flex-1">{lot.label}</span>
                   {vipMode && forcedLotId === lot.id && <span className="text-xs text-brand-purple font-bold px-2">FORCE</span>}
                   <button 
                     onClick={(e) => { e.stopPropagation(); removeLot(lot.id); }}
                     className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
               ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};