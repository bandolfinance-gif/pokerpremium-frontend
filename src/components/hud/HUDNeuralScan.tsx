import React from 'react';
import { useHUDState } from './HUDCore';

const HUDNeuralScan: React.FC = () => {
  const hud = useHUDState();

  const intensity = hud.activity / 100;

  return (
    <div style={{
      position: 'absolute',
      top: 740,
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
        background: 'linear-gradient(90deg, #00eaff33, transparent)',
        animation: 'neuralScan 2s linear infinite',
        opacity: 0.4 + intensity
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: hud.mood === 'OVERDRIVE'
          ? 'rgba(255,0,255,0.25)'
          : 'rgba(0,255,200,0.15)',
        filter: 'blur(18px)',
        opacity: 0.3 + intensity
      }} />
    </div>
  );
};

export default HUDNeuralScan;
import './HUDNeuralScan.css';
