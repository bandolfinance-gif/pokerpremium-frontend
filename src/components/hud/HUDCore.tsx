import React, { useEffect, useState } from 'react';

const HUDCore: React.FC = () => {
  const [hudEvent, setHudEvent] = useState<string | null>(null);

  useEffect(() => {
    const handleEvent = (event: Event) => {
      const e = event as CustomEvent<{ type: string }>;
      const type = e.detail?.type;

      setHudEvent(type);

      // Reenvia o evento para todos os módulos do HUD
      const hudDispatch = new CustomEvent('hud-event', { detail: { type } });
      window.dispatchEvent(hudDispatch);
    };

    window.addEventListener('cockpit-event', handleEvent);

    return () => {
      window.removeEventListener('cockpit-event', handleEvent);
    };
  }, []);

  return null;
};

export default HUDCore;
export const HUDState = {
  stage: 'preflop',
  action: null,
  mood: 'CALM',
  profile: 'CALMA',
  activity: 0
};

window.addEventListener('hud-event', (event: Event) => {
  const e = event as CustomEvent<{ type: string }>;
  const type = e.detail?.type;

  // Atualiza ação
  if (['poker-bet','poker-call','poker-raise','poker-fold'].includes(type)) {
    HUDState.action = type;
  }

  // Atualiza etapa da rodada
  if (['poker-flop','poker-turn','poker-river','poker-showdown','poker-reset'].includes(type)) {
    HUDState.stage = type.replace('poker-', '');
  }

  // Atualiza moods
  if (type === 'click') HUDState.mood = 'FOCUSED';
  if (type === 'key') HUDState.mood = 'ALERT';
  if (type === 'move') HUDState.mood = 'CALM';

  // Overdrive
  if (type === 'fx-overdrive') HUDState.mood = 'OVERDRIVE';

  // Atualiza atividade
  HUDState.activity = Math.min(HUDState.activity + 5, 100);
});
setInterval(() => {
  HUDState.activity = Math.max(HUDState.activity - 3, 0);
}, 500);

export const useHUDState = () => HUDState;
