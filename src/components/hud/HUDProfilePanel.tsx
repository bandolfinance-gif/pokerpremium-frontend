import React from 'react';
import { useHUDState } from './HUDCore';

const HUDProfilePanel: React.FC = () => {
  const hud = useHUDState();

  const profileDesc = (profile: string) => {
    if (profile === 'ANALITICA') return 'IA focada em padrões, estatísticas e precisão.';
    if (profile === 'DIRETA') return 'IA agressiva, objetiva e rápida nas decisões.';
    if (profile === 'ESTRATEGICA') return 'IA calculista, adaptativa e de longo prazo.';
    return 'IA em modo neutro.';
  };

  const moodDesc = (mood: string) => {
    if (mood === 'FOCUSED') return 'Concentrada e com alta precisão.';
    if (mood === 'ALERT') return 'Atenta a riscos e movimentos do jogador.';
    if (mood === 'CALM') return 'Estável e processando informações.';
    if (mood === 'OVERDRIVE') return 'Processamento máximo ativado.';
    return 'Estado neutro.';
  };

  return (
    <div style={{
      position: 'absolute',
      top: 920,
      left: 20,
      width: '260px',
      padding: '12px',
      borderRadius: '10px',
      background: 'rgba(0,0,0,0.45)',
      border: '1px solid #00eaff',
      boxShadow: '0 0 12px #00eaff',
      color: '#00eaff',
      fontFamily: 'monospace',
      fontSize: '13px'
    }}>
      <div>PERFIL DA IA</div>
      <hr style={{ borderColor: '#00eaff' }} />

      <div style={{ marginBottom: '8px' }}>
        <strong>Perfil:</strong> {hud.profile}
        <br />
        <span style={{ opacity: 0.8 }}>{profileDesc(hud.profile)}</span>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Mood:</strong> {hud.mood}
        <br />
        <span style={{ opacity: 0.8 }}>{moodDesc(hud.mood)}</span>
      </div>

      <div>
        <strong>Atividade:</strong> {hud.activity}%
      </div>
    </div>
  );
};

export default HUDProfilePanel;
