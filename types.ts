export interface Lot {
  id: string;
  label: string;
  color?: string;
  probability?: number; // 0-1 weight, default 1
}

export interface HistoryItem {
  id: string;
  type: 'WHEEL' | 'NUMBER';
  value: string;
  timestamp: number;
}

export type ZoomStage = 'IDLE' | 'ZOOM_IN' | 'REVEALED';

export interface AppState {
  lots: Lot[];
  history: HistoryItem[];
  drawnNumbers: number[];
  isSpinning: boolean;
  winner: Lot | null;
  vipMode: boolean;
  forcedLotId: string | null;
  maxNumber: number;
  resetKey: number; 
  zoomStage: ZoomStage; // NEW: Controls the camera drama
  
  addLot: (label: string) => void;
  removeLot: (id: string) => void;
  resetHistory: () => void;
  resetDrawnNumbers: () => void;
  setSpinning: (spinning: boolean) => void;
  setWinner: (lot: Lot | null) => void;
  setZoomStage: (stage: ZoomStage) => void;
  addToHistory: (item: HistoryItem) => void;
  addDrawnNumber: (num: number) => void;
  toggleVipMode: () => void;
  setForcedLot: (id: string | null) => void;
  resetAll: () => void;
  setMaxNumber: (n: number) => void;
}

export const DEFAULT_LOTS: Lot[] = [
  { id: '1', label: "Conférence Futur du Travail", color: "#BF5AF2" },
  { id: '2', label: "Atelier Acculturation IA", color: "#0A84FF" },
  { id: '3', label: "Guide Charge Cognitive", color: "#5E2B77" },
  { id: '4', label: "Diagnostic Flash ATHENA", color: "#FF9F0A" },
  { id: '5', label: "Atelier Soft Skills", color: "#30D158" },
  { id: '6', label: "Coaching Stratégique RH", color: "#FF453A" },
  { id: '7', label: "Session Spa", color: "#BF5AF2" },
  { id: '8', label: "Atelier Céramique", color: "#0A84FF" },
  { id: '9', label: "Bulle de Flottaison", color: "#5E2B77" },
  { id: '10', label: "Surprise Tomorrow Theory", color: "#FFD60A" },
  { id: '11', label: "Audit QVT Flash", color: "#30D158" },
  { id: '12', label: "Licence Outil Productivité", color: "#64D2FF" },
  { id: '13', label: "Déjeuner avec les fondateurs", color: "#FF453A" },
  { id: '14', label: "Livre : La 25e Heure", color: "#BF5AF2" },
  { id: '15', label: "Séance Yoga au bureau", color: "#0A84FF" },
  { id: '16', label: "Casque à réduction de bruit", color: "#5E2B77" },
];