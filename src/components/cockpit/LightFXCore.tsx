import React, { useEffect, useState } from 'react';

const LightFXCore: React.FC = () => {
  const [fx, setFx] = useState<string | null>(null);

  useEffect(() => {
    const handleEvent = (event: Event) => {
      const e = event as CustomEvent<{ type: string }>;
      const type = e.detail?.type;

      // Luzes para ações do jogador
      if (type === 'poker-bet') setFx('light-bet');
      if (type === 'poker-call') setFx('light-call');
      if (type === 'poker-raise') setFx('light-raise');
      if (type === 'poker-fold') setFx('light-fold');

      // Luzes para etapas da rodada
      if (type === 'poker-flop') setFx('light-flop');
      if (type === 'poker-turn') setFx('light-turn');
      if (type === 'poker-river') setFx('light-river');
      if (type === 'poker-showdown') setFx('light-showdown');

      // Reset
      if (type === 'poker-reset') setFx('light-reset');

      // Moods da IA
      if (type === 'click') setFx('light-focused');
      if (type === 'key') setFx('light-alert');
      if (type === 'move') setFx('light-calm');

      // Overdrive
      if (type === 'fx-overdrive') setFx('light-overdrive');

      // Limpa o efeito após 1 segundo
      setTimeout(() => setFx(null), 1000);
    };

    window.addEventListener('cockpit-event', handleEvent);

    return () => {
      window.removeEventListener('cockpit-event', handleEvent);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 9998
    }}>
      {fx && (
        <div className={fx} style={{
          position: 'absolute',
          inset: 0,
          background: 'transparent'
        }} />
      )}
    </div>
  );
};

export default LightFXCore;
