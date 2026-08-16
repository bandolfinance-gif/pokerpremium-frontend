import React, { useEffect, useState } from 'react';
import { useHUDState } from './HUDCore';

const HUDOverdrivePulse: React.FC = () => {
  const hud = useHUDState();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (hud.mood === 'OVERDRIVE') {
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
    }
  }, [hud.mood]);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 9999
    }}>
      {pulse && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,0,255,0.25)',
          animation: 'overdrivePulse 0.8s ease-out',
          filter: 'blur(12px)'
        }} />
      )}
    </div>
  );
};

export default HUDOverdrivePulse;
