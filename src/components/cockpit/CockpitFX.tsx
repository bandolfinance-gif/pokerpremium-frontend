import './CockpitFX.css';
import React from 'react';
import { useHUDState } from '../hud/HUDCore';

// Camada de efeitos globais do cockpit (glow ambiente, pulsação de fundo).
// Efeitos específicos de cada HUD continuam isolados dentro do próprio HUD;
// aqui só vive o que é efeito do cockpit como um todo.
const CockpitFX: React.FC = () => {
  const hud = useHUDState();
  const overdrive = hud.mood === 'OVERDRIVE';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: overdrive
          ? 'radial-gradient(circle at 50% 50%, rgba(255,0,255,0.12), transparent 70%)'
          : 'radial-gradient(circle at 50% 50%, rgba(0,234,255,0.08), transparent 70%)',
        animation: 'cockpitAmbientPulse 4s ease-in-out infinite',
      }}
    />
  );
};

export default CockpitFX;
