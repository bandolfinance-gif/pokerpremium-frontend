import React, { useEffect } from 'react';

const SoundFXCore: React.FC = () => {

  const play = (file: string) => {
    const audio = new Audio(file);
    audio.volume = 0.45;
    audio.play();
  };

  useEffect(() => {
    const handleEvent = (event: Event) => {
      const e = event as CustomEvent<{ type: string }>;
      const type = e.detail?.type;

      // Sons para ações do jogador
      if (type === 'poker-bet') play('/sounds/bet.wav');
      if (type === 'poker-call') play('/sounds/call.wav');
      if (type === 'poker-raise') play('/sounds/raise.wav');
      if (type === 'poker-fold') play('/sounds/fold.wav');

      // Sons para etapas da rodada
      if (type === 'poker-flop') play('/sounds/flop.wav');
      if (type === 'poker-turn') play('/sounds/turn.wav');
      if (type === 'poker-river') play('/sounds/river.wav');
      if (type === 'poker-showdown') play('/sounds/showdown.wav');

      // Reset
      if (type === 'poker-reset') play('/sounds/reset.wav');

      // Sons para moods da IA
      if (type === 'click') play('/sounds/focused.wav');
      if (type === 'key') play('/sounds/alert.wav');
      if (type === 'move') play('/sounds/calm.wav');

      // Overdrive
      if (type === 'fx-overdrive') play('/sounds/overdrive.wav');
    };

    window.addEventListener('cockpit-event', handleEvent);

    return () => {
      window.removeEventListener('cockpit-event', handleEvent);
    };
  }, []);

  return null;
};

export default SoundFXCore;
