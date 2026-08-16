import React from 'react';
import { useHUDState } from './HUDCore';

const HUDCryoFlux: React.FC = () => {
  const hud = useHUDState();

  const isCalm = hud.mood === 'CALM' || hud.activity < 40;

  return (
    <div style={{
      position: 'absolute',
      top: 1280,
      left: 20,
      width: '300px',
      height: '160px',
      borderRadius: '10px',
      background: 'rgba(0,0,0,0.35)',
      border: '1px solid #00eaff',
      boxShadow: '0 0 12px #00eaff',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: isCalm
          ? 'rgba(0,180,255,0.35)'
          : 'rgba(0,255,200,0.15)',
        animation: isCalm ? 'cryoFlux 3s ease-in-out infinite' : 'none',
        filter: 'blur(22px)',
        opacity: isCalm ? 0.9 : 0.4
      }} />
    </div>
  );
};

export default HUDCryoFlux;
