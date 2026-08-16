import React from 'react';
import { useHUDState } from './HUDCore';

const HUDIndicators: React.FC = () => {
  const hud = useHUDState();

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      right: 20,
      width: '180px',
      padding: '10px',
      borderRadius: '10px',
      background: 'rgba(0,0,0,0.45)',
      border: '1px solid #00eaff',
      boxShadow: '0 0 12px #00eaff',
      color: '#00eaff',
      fontSize: '13px',
      fontFamily: 'monospace'
    }}>
      <div>AÇÃO: {hud.action || '---'}</div>
      <div>ETAPA: {hud.stage}</div>
      <div>MOOD IA: {hud.mood}</div>
      <div>PERFIL IA: {hud.profile}</div>
      <div>ENERGIA: {hud.activity}%</div>
    </div>
  );
};

export default HUDIndicators;
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
      top: 20,
      right: 20,
      width: '180px',
      padding: '10px',
      borderRadius: '10px',
      background: 'rgba(0,0,0,0.45)',
      border: '1px solid #00eaff',
      boxShadow: '0 0 12px #00eaff',
      color: '#00eaff',
      fontSize: '13px',
      fontFamily: 'monospace'
    }}>
      <div style={{ color: moodColor(hud.mood) }}>AÇÃO: {hud.action || '---'}</div>
      <div>ETAPA: {hud.stage}</div>
      <div style={{ color: moodColor(hud.mood) }}>MOOD IA: {hud.mood}</div>
      <div style={{ color: profileColor(hud.profile) }}>PERFIL IA: {hud.profile}</div>
      <div>ENERGIA: {hud.activity}%</div>
    </div>
  );
