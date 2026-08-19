import { useEffect, useState } from 'react';
import { HandState, TableSeatInfo } from './gameSocket';

// Ponte entre a mesa real (PokerTable, dona da conexão WebSocket) e o
// Cockpit IA (HUDs numa aba separada): guarda o último estado real do jogo
// recebido, pra qualquer HUD poder ler dados de verdade (pote, cartas,
// oponentes) em vez de fórmulas decorativas.
interface LiveGameState {
  hand: HandState | null;
  seats: TableSeatInfo[];
  myUserId: string | null;
}

let state: LiveGameState = { hand: null, seats: [], myUserId: null };
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

export const setLiveGameState = (hand: HandState | null, seats: TableSeatInfo[], myUserId: string) => {
  state = { hand, seats, myUserId };
  notify();
};

export const getLiveGameState = (): LiveGameState => state;

export const useLiveGameState = (): LiveGameState => {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const listener = () => forceRender((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return state;
};
