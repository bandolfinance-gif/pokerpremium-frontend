import React from 'react';
import { useHUDState } from './HUDCore';

const HUDActionFlow: React.FC = () => {
  const hud = useHUDState();

  const actionStyle = (action: string) => ({
    padding: '6px 10px',
    marginBottom: '6px',
    borderRadius: '6px',
    background: hud.action === action ? 'rgba(255,255,0,0.25)' : 'rgba(0,0,0,0.35)',
    border: hud.action === action ? '1px solid #ffee00' : '1px solid #00eaff',
    color: hud.action === action ? '#ffee00' : '#00eaff',
    boxShadow: hud.action === action ? '0 0 10px #ffee00' : 'none',
    fontFamily: 'monospace',
    fontSize: '13px'
  });

  return (
    <div style={{
      position: 'absolute',
      top: 200,
      left: 20,
      width: '160px',
      padding: '10px',
      borderRadius: '10px',
      background: 'rgba(0,0,0,0.45)',
      border: '1px solid #00eaff',
      boxShadow: '0 0 12px #00eaff'
    }}>
      <div style={actionStyle('poker-bet')}>Bet</div>
      <div style={actionStyle('poker-call')}>Call</div>
      <div style={actionStyle('poker-raise')}>Raise</div>
      <div style={actionStyle('poker-fold')}>Fold</div>
    </div>
  );
};

export default HUDActionFlow;
