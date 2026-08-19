import { CardData } from './gameSocket';

// Formato mínimo necessário pra auditar uma mão — tanto o estado ao vivo
// (HandState) quanto um registro do histórico (HandHistoryEntry) cabem
// aqui, sem acoplar esse serviço a nenhum dos dois tipos específicos.
export interface VerifiableHand {
  serverSeed: string | null;
  serverSeedHash: string;
  communityCards: CardData[];
  players: { id: string; holeCards: CardData[] | null }[];
}

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const createDeck = (): CardData[] => {
  const deck: CardData[] = [];
  SUITS.forEach((suit) => {
    RANKS.forEach((rank, i) => {
      deck.push({ rank, suit, value: i + 2 });
    });
  });
  return deck;
};

const sha256Hex = async (input: string): Promise<string> => {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

// Mesmo stream determinístico usado no backend (provablyFair.js) — MESMA
// seed sempre produz a MESMA sequência, é isso que permite reproduzir o
// embaralhamento aqui, de forma independente do servidor.
const seededRandomUint32 = async (seed: string, counter: number): Promise<number> => {
  const hex = await sha256Hex(`${seed}:${counter}`);
  return parseInt(hex.slice(0, 8), 16);
};

const shuffleWithSeed = async (deck: CardData[], seed: string): Promise<CardData[]> => {
  const arr = [...deck];
  let counter = 0;
  for (let i = arr.length - 1; i > 0; i--) {
    const r = await seededRandomUint32(seed, counter);
    counter += 1;
    const j = r % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const cardEq = (a: CardData, b: CardData) => a.rank === b.rank && a.suit === b.suit;
const arrEq = (a: CardData[], b: CardData[]) => a.length === b.length && a.every((c, i) => cardEq(c, b[i]));

export interface FairnessResult {
  hashOk: boolean;
  dealOk: boolean;
  recomputedHash: string;
}

// Auditoria independente de uma mão já encerrada: (1) confere que o hash
// publicado ANTES da mão bate com sha256(seed revelada) — prova que o
// servidor não trocou a seed depois de saber como a mão ia terminar; (2)
// re-simula o embaralhamento com a seed revelada e confere se reproduz
// exatamente as cartas de mão e o board que realmente saíram. Roda inteiro
// no navegador — não depende de o servidor "confirmar" nada, o cálculo é
// seu.
export const verifyHandFairness = async (hand: VerifiableHand): Promise<FairnessResult | null> => {
  if (!hand.serverSeed) return null;

  const recomputedHash = await sha256Hex(hand.serverSeed);
  const hashOk = recomputedHash === hand.serverSeedHash;

  const shuffled = await shuffleWithSeed(createDeck(), hand.serverSeed);
  const drawPile = [...shuffled];
  const dealtHole: Record<string, CardData[]> = {};
  for (let round = 0; round < 2; round += 1) {
    for (const p of hand.players) {
      if (!dealtHole[p.id]) dealtHole[p.id] = [];
      dealtHole[p.id].push(drawPile.pop() as CardData);
    }
  }
  const dealtCommunity: CardData[] = [];
  for (let i = 0; i < 5; i += 1) dealtCommunity.push(drawPile.pop() as CardData);

  let dealOk = true;
  for (const p of hand.players) {
    if (p.holeCards && !arrEq(p.holeCards, dealtHole[p.id])) dealOk = false;
  }
  if (!arrEq(hand.communityCards, dealtCommunity.slice(0, hand.communityCards.length))) dealOk = false;

  return { hashOk, dealOk, recomputedHash };
};
