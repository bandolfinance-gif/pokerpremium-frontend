import { useCallback, useEffect, useRef, useState } from 'react';

export interface CardData {
  rank: string;
  suit: string;
  value: number;
}

export interface HandPlayerState {
  id: string;
  name: string;
  stack: number;
  folded: boolean;
  allIn: boolean;
  currentBet: number;
  totalBet: number;
  holeCards: CardData[] | null;
}

export interface HandResults {
  wonByFold: boolean;
  pots: { amount: number; winners: string[]; handName: string | null }[];
  hands: Record<string, { name: string; cards: CardData[] }>;
}

export interface LegalActions {
  canFold: boolean;
  canCheck: boolean;
  canCall: boolean;
  callAmount: number;
  canRaise: boolean;
  minRaiseTo: number;
  maxRaiseTo: number;
}

export interface ActionHistoryEntry {
  playerId: string;
  action: string;
  amount?: number;
  stage: string;
}

export interface HandState {
  stage: 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';
  communityCards: CardData[];
  pot: number;
  currentBet: number;
  actingPlayerId: string | null;
  dealerPlayerId: string;
  complete: boolean;
  results: HandResults | null;
  players: HandPlayerState[];
  legalActions: LegalActions | null;
  turnDeadline: number | null;
  serverSeedHash: string;
  serverSeed: string | null;
  actionHistory: ActionHistoryEntry[];
  rakePercent: number;
  rakeCollected: number | null;
}

export interface TableSeatInfo {
  userId: string;
  name: string;
  chips: number;
  connected: boolean;
  avatarImage: string | null;
}

export interface GameState {
  tableSeats: TableSeatInfo[];
  hand: HandState | null;
  leavingPlayerIds: string[];
}

// Chat, jogo e sinalização de vídeo dividem a MESMA porta/host do backend
// agora (ver server.js) — só o CAMINHO muda (/chat vs /game). Uma única
// variável de ambiente de base, em vez de uma porta por serviço.
const WS_BASE_URL = process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:3001';
const GAME_WS_URL = `${WS_BASE_URL}/game`;

// Conexão com a mesa de jogo real (motor de Hold'em no backend). Reconecta
// sozinho se cair, e some com o socket quando token/tableId mudam ou o
// componente desmonta.
export const useGameSocket = (token: string, tableId: string) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token || !tableId) return undefined;

    let cancelled = false;
    const ws = new WebSocket(`${GAME_WS_URL}?token=${encodeURIComponent(token)}&tableId=${encodeURIComponent(tableId)}`);
    wsRef.current = ws;

    ws.onopen = () => {
      if (!cancelled) setConnected(true);
    };
    ws.onclose = () => {
      if (!cancelled) setConnected(false);
    };
    ws.onerror = () => {
      if (!cancelled) setError('Conexão com a mesa perdida.');
    };
    ws.onmessage = (evt) => {
      if (cancelled) return;
      try {
        const msg = JSON.parse(evt.data);
        if (msg.type === 'gameState') {
          setState({ tableSeats: msg.tableSeats, hand: msg.hand, leavingPlayerIds: msg.leavingPlayerIds ?? [] });
          setError('');
        } else if (msg.type === 'error') {
          setError(msg.message);
        }
      } catch {
        // ignore
      }
    };

    return () => {
      cancelled = true;
      ws.close();
    };
  }, [token, tableId]);

  const startHand = useCallback(() => {
    wsRef.current?.send(JSON.stringify({ type: 'startHand' }));
  }, []);

  const sendAction = useCallback((action: 'fold' | 'check' | 'call' | 'raise', amount?: number) => {
    wsRef.current?.send(JSON.stringify({ type: 'action', action, amount }));
  }, []);

  const leaveTable = useCallback(() => {
    wsRef.current?.send(JSON.stringify({ type: 'leaveTable' }));
  }, []);

  return { state, error, connected, startHand, sendAction, leaveTable };
};
