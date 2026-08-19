import './HUDUltraVision.css';
import React from 'react';
import { useIAInsight } from '../../services/iaEngine';

const actionLabel: Record<string, string> = {
  fold: 'FOLD',
  call: 'CALL',
  raise: 'RAISE',
  aguardando: 'AGUARDANDO',
};

// Fase 3: reflete o Assistente Estratégico (Módulo 3) — ação sugerida,
// confiança e a justificativa, combinando os Módulos 1 e 2.
const HUDUltraVision: React.FC = () => {
  const { suggestion } = useIAInsight();

  return (
    <div
      style={{
        position: 'absolute',
        top: 560,
        right: 20,
        width: '300px',
        height: '160px',
        borderRadius: '10px',
        background: 'rgba(0,0,0,0.45)',
        border: '1px solid #00eaff',
        boxShadow: '0 0 12px #00eaff',
        overflow: 'hidden',
        color: '#00eaff',
        fontFamily: 'monospace',
        fontSize: '13px',
        padding: '10px',
      }}
    >
      <div>ULTRA VISION</div>
      <hr style={{ borderColor: '#00eaff' }} />
      <div style={{ opacity: 0.9, fontWeight: 'bold', color: suggestion.action === 'aguardando' ? '#00eaff' : '#ffd76a' }}>
        {actionLabel[suggestion.action]}{suggestion.action !== 'aguardando' ? ` — ${suggestion.confidence}%` : ''}
      </div>
      <div style={{ opacity: 0.75, marginTop: 4 }}>{suggestion.reason}</div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '40%',
          background:
            'linear-gradient(180deg, rgba(0,234,255,0) 0%, rgba(0,234,255,0.35) 50%, rgba(0,234,255,0) 100%)',
          animation: 'ultraVisionScan 2.4s linear infinite',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default HUDUltraVision;
