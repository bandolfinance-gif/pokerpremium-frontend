import { useEffect, useState } from 'react';

export const HUDState: {
  stage: string;
  action: string | null;
  mood: string;
  profile: string;
  activity: number;
} = {
  stage: 'preflop',
  action: null,
  mood: 'CALM',
  profile: 'ANALITICA',
  activity: 0
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

window.addEventListener('cockpit-event', (event: Event) => {
  const e = event as CustomEvent<{ type: string }>;
  const type = e.detail?.type;
  if (!type) return;

  // Atualiza ação
  if (['poker-bet', 'poker-call', 'poker-raise', 'poker-fold'].includes(type)) {
    HUDState.action = type;
  }

  // Atualiza etapa da rodada
  if (['poker-flop', 'poker-turn', 'poker-river', 'poker-showdown', 'poker-reset'].includes(type)) {
    HUDState.stage = type.replace('poker-', '');
  }

  // Mood reage a eventos REAIS da mesa (antes reagia a tipos 'click'/'key'/
  // 'move' que nada no app nunca disparava — o mood ficava travado em CALM
  // pra sempre). Raise/bet = alerta (agressão na mesa); fold = calma;
  // call/check = foco; showdown = pico de atividade.
  if (type === 'poker-raise' || type === 'poker-bet') HUDState.mood = 'ALERT';
  else if (type === 'poker-fold') HUDState.mood = 'CALM';
  else if (type === 'poker-call') HUDState.mood = 'FOCUSED';
  else if (type === 'poker-showdown') HUDState.mood = 'OVERDRIVE';

  // Atualiza atividade
  HUDState.activity = Math.min(HUDState.activity + 5, 100);

  notify();
});

setInterval(() => {
  HUDState.activity = Math.max(HUDState.activity - 3, 0);
  notify();
}, 500);

// Hook reativo: re-renderiza o componente sempre que HUDState mudar,
// já que HUDState é um objeto mutável compartilhado (não um useState comum).
export const useHUDState = () => {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const listener = () => forceRender((n) => n + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return HUDState;
};
