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
        Pagar (Call)
      </button>

      <button
        onClick={() => window.pokerRaise()}
        style={{ padding: '12px 20px', background: '#00eaff', border: 'none', borderRadius: '8px' }}>
        Aumentar (Raise)
      </button>

      <button
        onClick={() => window.pokerFold()}
        style={{ padding: '12px 20px', background: '#00eaff', border: 'none', borderRadius: '8px' }}>
        Desistir (Fold)
      </button>

      <button
        onClick={() => window.pokerShowdown()}
        style={{ padding: '12px 20px', background: '#00eaff', border: 'none', borderRadius: '8px' }}>
        Showdown
      </button>

    </div>
  );
};

export default FuturisticTable;
