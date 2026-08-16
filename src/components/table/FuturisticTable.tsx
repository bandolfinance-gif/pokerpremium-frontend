import React from 'react';

const FuturisticTable: React.FC = () => {

  return (
    <div style={{
      position: 'absolute',
      bottom: 40,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '20px'
    }}>

      <button
        onClick={() => window.pokerBet()}
        style={{ padding: '12px 20px', background: '#00eaff', border: 'none', borderRadius: '8px' }}>
        Apostar
      </button>

      <button
        onClick={() => window.pokerCall()}
        style={{ padding: '12px 20px', background: '#00eaff', border: 'none', borderRadius: '8px' }}>
        Call
      </button>

      <button
        onClick={() => window.pokerRaise()}
        style={{ padding: '12px 20px', background: '#00eaff', border: 'none', borderRadius: '8px' }}>
        Raise
      </button>

      <button
        onClick={() => window.pokerFold()}
        style={{ padding: '12px 20px', background: '#00eaff', border: 'none', borderRadius: '8px' }}>
        Fold
      </button>

      <button
        onClick={() => window.pokerNextStage()}
        style={{ padding: '12px 20px', background: '#00eaff', border: 'none', borderRadius: '8px' }}>
        Próxima Etapa
      </button>

      <button
        onClick={() => window.pokerResetRound()}
        style={{ padding: '12px 20px', background: '#00eaff', border: 'none', borderRadius: '8px' }}>
        Resetar Rodada
      </button>

    </div>
  );
};

export default FuturisticTable;
