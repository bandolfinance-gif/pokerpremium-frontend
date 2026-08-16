import React from 'react';
import { useHUDState } from './HUDCore';

const HUDThermalMap: React.FC = () => {
  const hud = useHUDState();

  const heat = hud.activity / 100;

  const heatColor = () => {
    if (hud.mood === 'OVERDRIVE') return 'rgba(255,0,255,0.35)';
    if (heat > 0.75) return 'rgba(255,80,0,0.35)';
    if (heat > 0.45) return 'rgba(255,180,0,0.25)';
    return 'rgba(0,200,255,0.25)';
  };

  return (
    <div style={{
      position: 'absolute',
      top: 560,
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
        background: heatColor(),
        filter: 'blur(20px)',
        animation: 'thermalPulse 2s ease-in-out infinite',
        opacity: 0.5 + heat
      }} />
    </div>
  );
};

export default HUDThermalMap;
