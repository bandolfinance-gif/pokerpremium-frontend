export type Suit = '?' | '?' | '?' | '?';

export type Rank =
  | '2' | '3' | '4' | '5' | '6'
  | '7' | '8' | '9' | '10'
  | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  rank: Rank;
  suit: Suit;
}

export type PlayerStatus = 'active' | 'folded' | 'all-in' | 'out';

export interface Player {
  id: string;
  nome: string;
  stack: number;
  holeCards: Card[];
  status: PlayerStatus;
  currentBet: number;
  seatPosition: number;
}

export type Phase = 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';

export interface Table {
  id: string;
  players: Player[];
  dealerPosition: number;
  smallBlind: number;
  bigBlind: number;
  communityCards: Card[];
  pot: number;
  sidePots: number[];
  currentBet: number;
  currentPlayerIndex: number;
  phase: Phase;
}
