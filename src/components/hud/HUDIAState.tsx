import React from 'react';
import { useHUDState } from './HUDCore';

const HUDIAState: React.FC = () => {
  const hud = useHUDState();

  const moodColor = (mood: string) => {
    if (mood === 'FOCUSED') return '#00ffaa';
    if (mood === 'ALERT') return '#ff4444';
    if (mood === 'OVERDRIVE') return '#ff00ff';
    return '#00eaff';
  };

  const profileColor = (profile: string) => {
    if (profile === 'ANALITICA') return '#00ffcc';
    if (profile === 'DIRETA') return '#ffaa00';
    if (profile === 'ESTRATEGICA') return '#ff00aa';
    return '#00eaff';
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: 200,
      width: '240px',
      padding: '12px',
      borderRadius: '10px',
      background: 'rgba(0,0,0,0.45)',
      border: '1px solid #00eaff',
      boxShadow: '0 0 12px #00eaff',
      color: '#00eaff',
      fontFamily: 'monospace',
      fontSize: '13px'
    }}>
      <div>ESTADO DA IA</div>
      <hr style={{ borderColor: '#00eaff' }} />

      <div style={{ color: moodColor(hud.mood) }}>
        Mood: {hud.mood}
      </div>

      <div style={{ color: profileColor(hud.profile) }}>
        Perfil: {hud.profile}
      </div>

      <div>
        Atividade: {hud.activity}%
      </div>

      <div style={{
        marginTop: '10px',
        padding: '6px',
        borderRadius: '6px',
        background: hud.mood === 'OVERDRIVE'
          ? 'rgba(255,0,255,0.25)'
          : 'rgba(0,0,0,0.35)',
        border: hud.mood === 'OVERDRIVE'
          ? '1px solid #ff00ff'
          : '1px solid #00eaff',
        color: hud.mood === 'OVERDRIVE'
          ? '#ff00ff'
          : '#00eaff',
        boxShadow: hud.mood === 'OVERDRIVE'
          ? '0 0 10px #ff00ff'
          : 'none'
      }}>
        {hud.mood === 'OVERDRIVE'
          ? '? IA EM OVERDRIVE'
          : 'IA Estável'}
      </div>
    </div>
  );
};

export default HUDIAState;
