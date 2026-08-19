import React, { useEffect, useState } from 'react';
import { LegalActions } from '../../services/gameSocket';

interface ActionBarProps {
  legalActions: LegalActions | null;
  turnDeadline: number | null;
  onAction: (action: 'fold' | 'check' | 'call' | 'raise', amount?: number) => void;
}

const pillStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: '8px',
  border: '1px solid #00eaff',
  background: 'rgba(0,234,255,0.12)',
  color: '#00eaff',
  fontFamily: 'monospace',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const disabledStyle: React.CSSProperties = {
  ...pillStyle,
  opacity: 0.3,
  cursor: 'not-allowed',
  borderColor: 'rgba(0,234,255,0.3)',
  color: 'rgba(0,234,255,0.4)',
};

// Barra de ações real: só fica ativa quando é a sua vez (legalActions vem
// null do servidor quando não é), e os valores de call/raise são os
// calculados pelo motor de jogo — nada de slider decorativo solto.
const ActionBar: React.FC<ActionBarProps> = ({ legalActions, turnDeadline, onAction }) => {
  const [raiseTo, setRaiseTo] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (legalActions) setRaiseTo(legalActions.minRaiseTo);
  }, [legalActions]);

  useEffect(() => {
    if (!turnDeadline) {
      setSecondsLeft(null);
      return undefined;
    }
    const tick = () => setSecondsLeft(Math.max(0, Math.ceil((turnDeadline - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [turnDeadline]);

  if (!legalActions) {
    return (
      <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', color: 'rgba(0,234,255,0.5)', fontFamily: 'monospace', fontSize: 12 }}>
        Aguardando sua vez...
      </div>
    );
  }

  const urgent = secondsLeft !== null && secondsLeft <= 8;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        width: 'max-content',
        maxWidth: '95%',
      }}
    >
      {secondsLeft !== null && (
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: urgent ? '#ff4d6d' : 'rgba(0,234,255,0.7)', letterSpacing: 1 }}>
          {urgent ? '⏱ ' : ''}Tempo pra agir: {secondsLeft}s
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={legalActions.canFold ? pillStyle : disabledStyle} disabled={!legalActions.canFold} onClick={() => onAction('fold')}>
          FOLD
        </button>
        {legalActions.canCheck ? (
          <button style={pillStyle} onClick={() => onAction('check')}>CHECK</button>
        ) : (
          <button style={legalActions.canCall ? pillStyle : disabledStyle} disabled={!legalActions.canCall} onClick={() => onAction('call')}>
            CALL {legalActions.callAmount.toLocaleString('pt-BR')}
          </button>
        )}
        <button
          style={legalActions.canRaise ? { ...pillStyle, background: 'rgba(255,215,106,0.15)', borderColor: '#ffd76a', color: '#ffd76a' } : disabledStyle}
          disabled={!legalActions.canRaise}
          onClick={() => onAction('raise', raiseTo)}
        >
          RAISE {raiseTo.toLocaleString('pt-BR')}
        </button>
      </div>
      {legalActions.canRaise && (
        <input
          type="range"
          min={legalActions.minRaiseTo}
          max={legalActions.maxRaiseTo}
          step={1}
          value={raiseTo}
          onChange={(e) => setRaiseTo(Number(e.target.value))}
          style={{ width: 180 }}
        />
      )}
    </div>
  );
};

export default ActionBar;
