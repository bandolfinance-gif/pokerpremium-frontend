import React from 'react';
import { useHUDState } from './HUDCore';

const HUDRoundFlow: React.FC = () => {
  const hud = useHUDState();

  const stepStyle = (step: string) => ({
    padding: '6px 10px',
    marginBottom: '6px',
    borderRadius: '6px',
    background: hud.stage === step ? 'rgba(0,255,200,0.25)' : 'rgba(0,0,0,0.35)',
    border: hud.stage === step ? '1px solid #00ffaa' : '1px solid #00eaff',
    color: hud.stage === step ? '#00ffaa' : '#00eaff',
    boxShadow: hud.stage === step ? '0 0 10px #00ffaa' : 'none',
    fontFamily: 'monospace',
    fontSize: '13px'
  });

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      width: '160px',
      padding: '10px',
      borderRadius: '10px',
      background: 'rgba(0,0,0,0.45)',
      border: '1px solid #00eaff',
      boxShadow: '0 0 12px #00eaff'
    }}>
      <div style={stepStyle('preflop')}>Pré-Flop</div>
      <div style={stepStyle('flop')}>Flop</div>
      <div style={stepStyle('turn')}>Turn</div>
      <div style={stepStyle('river')}>River</div>
      <div style={stepStyle('showdown')}>Showdown</div>
    </div>
  );
};

export default HUDRoundFlow;
