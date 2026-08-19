import './HUDSpectrumWave.css';
import React from 'react';
import { useHUDState } from './HUDCore';

const HUDSpectrumWave: React.FC = () => {
  const hud = useHUDState();

  const intensity = hud.activity / 100;

  const waveColor = () => {
    if (hud.mood === 'OVERDRIVE') return 'rgba(255,0,255,0.35)';
    if (hud.mood === 'ALERT') return 'rgba(255,80,80,0.35)';
    if (hud.mood === 'FOCUSED') return 'rgba(0,200,255,0.35)';
    return 'rgba(0,255,200,0.25)';
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
        background: waveColor(),
        opacity: 0.4 + intensity,
        animation: 'spectrumWave 3s ease-in-out infinite',
        filter: 'blur(18px)'
      }} />
    </div>
  );
};

export default HUDSpectrumWave;
