import React, { useEffect, useState } from 'react';
import { useHUDState } from './HUDCore';

const HUDEnergyBar: React.FC = () => {
  const hud = useHUDState();
  const [energy, setEnergy] = useState(0);

  useEffect(() => {
    setEnergy(hud.activity);
  }, [hud.activity]);

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: 20,
      width: '260px',
      height: '18px',
      borderRadius: '10px',
      background: 'rgba(0,0,0,0.4)',
      border: '1px solid #00eaff',
      overflow: 'hidden',
      boxShadow: '0 0 12px #00eaff'
    }}>
      <div style={{
        width: energy + '%',
        height: '100%',
        background: 'linear-gradient(90deg, #00eaff, #00ffaa)',
        transition: 'width 0.25s ease-out'
      }} />
    </div>
  );
};

export default HUDEnergyBar;
const glowLevel = (energy: number) => {
  if (energy < 30) return '0 0 6px #005577';
  if (energy < 60) return '0 0 10px #00aaff';
  if (energy < 85) return '0 0 14px #00ffee';
  return '0 0 22px #00ffcc';
};
  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: 20,
      width: '260px',
      height: '18px',
      borderRadius: '10px',
      background: 'rgba(0,0,0,0.4)',
      border: '1px solid #00eaff',
      overflow: 'hidden',
      boxShadow: glowLevel(energy)
    }}>
      <div style={{
        width: energy + '%',
        height: '100%',
        background: 'linear-gradient(90deg, #00eaff, #00ffaa)',
        transition: 'width 0.25s ease-out'
      }} />
    </div>
  );
