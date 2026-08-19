import { useEffect, useState } from 'react';
import { HUDState } from '../components/hud/HUDCore';
import { getLiveGameState } from './liveGameStore';

export interface TableState {
  cards: string[];
  pot: number;
  players: number;
  position: number;
}

export interface TableInsight {
  potOdds: number;
  trends: string[];
  alerts: string[];
}

export interface OpponentProfile {
  aggression: number;
  frequency: number;
  style: 'tight' | 'loose' | 'aggressive' | 'passive';
  riskLevel: number;
}

export interface StrategySuggestion {
  action: 'fold' | 'call' | 'raise' | 'aguardando';
  confidence: number;
  reason: string;
}

// Fase 3 — Módulo 1: Leitura de Mesa.
// Lê o estado REAL da mão em andamento (pote, board, jogadores ainda na
// mão) direto da mesa real — antes disso era uma fórmula decorativa
// baseada só na fase (`revealed * 250 + 500`), sem nenhum jogo por trás.
export const getTableState = (): TableState => {
  const { hand } = getLiveGameState();
  if (!hand) {
    return { cards: [], pot: 0, players: 0, position: 0 };
  }
  return {
    cards: hand.communityCards.map((c) => `${c.rank}${c.suit}`),
    pot: hand.pot,
    players: hand.players.filter((p) => !p.folded).length,
    position: 0,
  };
};

export const analisarMesa = (table: TableState): TableInsight => {
  const potOdds = table.pot > 0 ? Math.round((table.pot / (table.pot + 2000)) * 100) : 0;
  const trends: string[] = [];
  const alerts: string[] = [];

  if (table.pot === 0) trends.push('Sem mão em andamento nesta mesa');
  else if (table.cards.length >= 3) trends.push('Board aberto — leitura de textura possível');
  else if (table.cards.length === 0) trends.push('Pré-flop — sem informação de board ainda');
  if (table.players >= 5) trends.push('Mesa cheia — variância alta');

  if (potOdds >= 40) alerts.push('Pot odds favoráveis para continuação');
  if (table.pot >= 1500) alerts.push('Pot em crescimento — risco elevado');

  return { potOdds, trends, alerts };
};

// Fase 3 — Módulo 2: Leitura de Oponentes.
// Antes contava as MINHAS próprias ações (bug — os eventos só disparavam
// quando eu mesmo clicava um botão). Agora lê o actionHistory real da mão
// vindo do servidor e agrega só as ações dos OUTROS jogadores sentados —
// isso sim é "leitura de oponentes".
export const analisarOponente = (): OpponentProfile => {
  const { hand, myUserId } = getLiveGameState();
  if (!hand || !hand.actionHistory) {
    return { aggression: 0, frequency: 0, style: 'passive', riskLevel: 0 };
  }

  const opponentActions = hand.actionHistory.filter((a) => a.playerId !== myUserId);
  const raises = opponentActions.filter((a) => a.action === 'raise').length;
  const calls = opponentActions.filter((a) => a.action === 'call' || a.action === 'check').length;
  const folds = opponentActions.filter((a) => a.action === 'fold').length;
  const total = raises + calls + folds;

  if (total === 0) {
    return { aggression: 0, frequency: 0, style: 'passive', riskLevel: 0 };
  }

  const aggression = Math.round((raises / total) * 100);
  const frequency = Math.round(((raises + calls) / total) * 100);

  let style: OpponentProfile['style'] = 'passive';
  if (aggression >= 50) style = 'aggressive';
  else if (frequency >= 60) style = 'loose';
  else if (frequency <= 30) style = 'tight';

  const riskLevel = Math.round((aggression + (100 - frequency)) / 2);
  return { aggression, frequency, style, riskLevel };
};

// Fase 3 — Módulo 3: Assistente Estratégico.
// Heurística simples e declarada como tal — não é solver de equity real,
// só combina os sinais dos módulos 1 e 2 numa sugestão explicável.
export const sugerirAcao = (table: TableInsight, opponent: OpponentProfile): StrategySuggestion => {
  if (table.trends.includes('Sem mão em andamento nesta mesa')) {
    return { action: 'aguardando', confidence: 0, reason: 'Sem mão em andamento — nada a sugerir ainda.' };
  }
  if (opponent.style === 'aggressive' && table.alerts.includes('Pot em crescimento — risco elevado')) {
    return { action: 'fold', confidence: 65, reason: 'Oponente agressivo em pot grande — risco não compensa.' };
  }
  if (table.alerts.includes('Pot odds favoráveis para continuação')) {
    return { action: 'call', confidence: 70, reason: 'Pot odds favoráveis para pagar.' };
  }
  if (opponent.style === 'tight' || opponent.style === 'passive') {
    return { action: 'raise', confidence: 55, reason: 'Oponente passivo — espaço para pressionar.' };
  }
  return { action: 'call', confidence: 50, reason: 'Sem sinal forte — ação neutra.' };
};

const PROFILE_BY_STYLE: Record<OpponentProfile['style'], string> = {
  aggressive: 'DIRETA',
  tight: 'ANALITICA',
  loose: 'ESTRATEGICA',
  passive: 'ANALITICA',
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

window.addEventListener('cockpit-event', (event: Event) => {
  const e = event as CustomEvent<{ type: string }>;
  const type = e.detail?.type;
  if (!type) return;
  // Recalcula o perfil do oponente a cada evento de mesa e alimenta de
  // volta o HUDState — assim os painéis que só leem mood/perfil (sem
  // passar pelo iaEngine diretamente) também refletem dado real.
  const opponent = analisarOponente();
  HUDState.profile = PROFILE_BY_STYLE[opponent.style];
  notify();
});

export interface IAInsight {
  table: TableState;
  tableInsight: TableInsight;
  opponent: OpponentProfile;
  suggestion: StrategySuggestion;
}

// Hook reativo: recalcula os 3 módulos sempre que um evento de mesa chega.
export const useIAInsight = (): IAInsight => {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const listener = () => forceRender((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const table = getTableState();
  const tableInsight = analisarMesa(table);
  const opponent = analisarOponente();
  const suggestion = sugerirAcao(tableInsight, opponent);

  return { table, tableInsight, opponent, suggestion };
};
