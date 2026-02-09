import { create } from 'zustand';
import { AppState, DEFAULT_LOTS, Lot, HistoryItem, ZoomStage } from './types';
import { v4 as uuidv4 } from 'uuid';

export const useStore = create<AppState>((set) => ({
  lots: DEFAULT_LOTS,
  history: [],
  drawnNumbers: [],
  isSpinning: false,
  winner: null,
  vipMode: false,
  forcedLotId: null,
  maxNumber: 100,
  resetKey: 0,
  zoomStage: 'IDLE',

  addLot: (label: string) => set((state) => ({
    lots: [...state.lots, { id: uuidv4(), label, color: '#BF5AF2' }]
  })),

  removeLot: (id: string) => set((state) => ({
    lots: state.lots.filter(l => l.id !== id)
  })),

  resetHistory: () => set({ history: [], drawnNumbers: [], winner: null }),
  
  resetDrawnNumbers: () => set((state) => ({ 
    drawnNumbers: [],
    history: state.history.filter(h => h.type !== 'NUMBER')
  })),

  setSpinning: (isSpinning: boolean) => set({ isSpinning }),

  setWinner: (winner: Lot | null) => set({ winner }),
  
  setZoomStage: (zoomStage: ZoomStage) => set({ zoomStage }),

  addToHistory: (item: HistoryItem) => set((state) => ({
    history: [item, ...state.history]
  })),

  addDrawnNumber: (num: number) => set((state) => ({
    drawnNumbers: [...state.drawnNumbers, num]
  })),

  toggleVipMode: () => set((state) => ({ vipMode: !state.vipMode })),

  setForcedLot: (id: string | null) => set({ forcedLotId: id }),
  
  resetAll: () => {
    set((state) => ({ 
      history: [], 
      drawnNumbers: [], 
      winner: null, 
      isSpinning: false,
      forcedLotId: null,
      zoomStage: 'IDLE',
      resetKey: state.resetKey + 1 
    }));
  },

  setMaxNumber: (maxNumber: number) => set({ maxNumber })
}));