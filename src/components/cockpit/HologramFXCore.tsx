import React, { useEffect, useState } from 'react';

const HologramFXCore: React.FC = () => {
  const [fx, setFx] = useState<string | null>(null);

  useEffect(() => {
    const handleEvent = (event: Event) => {
      const e = event as CustomEvent<{ type: string }>;
      const type = e.detail?.type;

      // Efeitos para ações do jogador
      if (type === 'poker-bet') setFx('fx-bet');
      if (type === 'poker-call') setFx('fx-call');
      if (type === 'poker-raise') setFx('fx-raise');
      if (type === 'poker-fold') setFx('fx-fold');

      // Efeitos para etapas da rodada
      if (type === 'poker-flop') setFx('fx-flop');
      if (type === 'poker-turn') setFx('fx-turn');
      if (type === 'poker-river') setFx('fx-river');
      if (type === 'poker-showdown') setFx('fx-showdown');

      // Efeito para reset
      if (type === 'poker-reset') setFx('fx-reset');

      // Efeitos para moods da IA
      if (type === 'click') setFx('fx-focused');
      if (type === 'key') setFx('fx-alert');
      if (type === 'move') setFx('fx-calm');

      // Efeito especial para overdrive
      if (type === 'fx-overdrive') setFx('fx-overdrive');

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
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {fx && (
        <div style={{
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(0, 255, 255, 0.25)',
          boxShadow: '0 0 40px #00eaff',
          animation: ${fx} 1s ease-out,
        }} />
      )}
    </div>
  );
};

export default HologramFXCore;
