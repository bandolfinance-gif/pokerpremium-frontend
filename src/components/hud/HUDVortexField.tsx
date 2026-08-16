import React, { useEffect, useState } from 'react';
import { useHUDState } from './HUDCore';

const HUDVortexField: React.FC = () => {
  const hud = useHUDState();
  const [vortex, setVortex] = useState(false);

  useEffect(() => {
    if (
      hud.action === 'poker-raise' ||
      hud.action === 'poker-fold' ||
      hud.mood === 'OVERDRIVE'
    ) {
      setVortex(true);
      setTimeout(() => setVortex(false), 1200);
    }
  }, [hud.action, hud.mood]);

  return (
    <div style={{
      position: 'absolute',
      top: 1460,
      left: 20,
      width: '300px',
      height: '160px',
      borderRadius: '10px',
      background: 'rgba(0,0,0,0.35)',
      border: '1px solid #00eaff',
      boxShadow: '0 0 12px #00eaff',
      overflow: 'hidden'
    }}>
      {vortex && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,0,255,0.25)',
          animation: 'vortexSpin 1.2s linear',
          filter: 'blur(18px)'
        }} />
      )}
    </div>
  );
};

export default HUDVortexField;
import './HUDVortexField.css';
