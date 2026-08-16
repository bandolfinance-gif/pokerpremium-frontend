import React from 'react';
import { useHUDState } from './HUDCore';

const HUDMatrixGrid: React.FC = () => {
  const hud = useHUDState();

  const intensity = hud.activity / 100;

  return (
    <div style={{
      position: 'absolute',
      top: 380,
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
        backgroundImage: 
          linear-gradient(#00eaff22 1px, transparent 1px),
          linear-gradient(90deg, #00eaff22 1px, transparent 1px)
        ,
        backgroundSize: '20px 20px',
        animation: 'gridMove 4s linear infinite',
        opacity: 0.4 + intensity
      }} />
    </div>
  );
};

export default HUDMatrixGrid;
