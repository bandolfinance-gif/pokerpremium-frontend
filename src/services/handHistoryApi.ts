import axios from 'axios';
import { CardData } from './gameSocket';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export interface HandHistoryPlayer {
  id: string;
  name: string;
  holeCards: CardData[];
  endStack: number;
  totalBet: number;
  folded: boolean;
}

export interface HandHistoryEntry {
  _id: string;
  tableId: string;
  communityCards: CardData[];
  pot: number;
  rakeCollected: number;
  wonByFold: boolean;
  winners: string[];
  handName: string | null;
  serverSeed: string;
  serverSeedHash: string;
  players: HandHistoryPlayer[];
  createdAt: string;
}

export const fetchHandHistory = async (token: string, tableId: string, limit = 20): Promise<HandHistoryEntry[]> => {
  const { data } = await axios.get<HandHistoryEntry[]>(`${API_URL}/hands`, {
    params: { tableId, limit },
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
