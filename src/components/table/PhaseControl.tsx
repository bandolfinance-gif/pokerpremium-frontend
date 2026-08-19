import React from 'react';
import { HandState } from '../../services/gameSocket';

interface PhaseControlProps {
  hand: HandState | null;
  seatedCount: number;
  onStartHand: () => void;
}

const STAGE_LABELS: Record<string, string> = {
  preflop: 'PRÉ-FLOP',
  flop: 'FLOP',
  turn: 'TURN',
  river: 'RIVER',
  showdown: 'SHOWDOWN',
};

// Antes era um botão manual "próxima fase" (fake, sem regra nenhuma por
// trás). Agora o motor real avança sozinho conforme as apostas fecham —
// esse controle só serve pra iniciar uma mão nova quando não há uma
// rodando.
const PhaseControl: React.FC<PhaseControlProps> = ({ hand, seatedCount, onStartHand }) => {
  const canStart = (!hand || hand.complete) && seatedCount >= 2;

  return (
    <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
      {hand && !hand.complete ? (
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid rgba(0,234,255,0.4)',
            background: 'rgba(0,0,0,0.4)',
            color: 'rgba(0,234,255,0.8)',
            fontFamily: 'monospace',
            fontSize: '11px',
          }}
        >
          {STAGE_LABELS[hand.stage] ?? hand.stage.toUpperCase()}
        </div>
      ) : (
        <button
          onClick={onStartHand}
          disabled={!canStart}
          style={{
            padding: '6px 16px',
            borderRadius: 6,
            border: canStart ? '1px solid #ffd76a' : '1px solid rgba(255,215,106,0.3)',
            background: canStart ? 'rgba(255,215,106,0.15)' : 'rgba(0,0,0,0.3)',
            color: canStart ? '#ffd76a' : 'rgba(255,215,106,0.4)',
            fontFamily: 'monospace',
            fontSize: '11px',
            cursor: canStart ? 'pointer' : 'not-allowed',
          }}
        >
          {seatedCount < 2 ? 'AGUARDANDO JOGADORES' : 'NOVA MÃO'}
        </button>
      )}
    </div>
  );
};

export default PhaseControl;
