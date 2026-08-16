import React from 'react';

interface Props {
  modo: string;
  setModo: (m: string) => void;
}

const DealerModo: React.FC<Props> = ({ modo, setModo }) => {
  return (
    <div className='dealer-modo'>
      <button
        className={modo === 'voz' ? 'ativo' : ''}
        onClick={() => setModo('voz')}
      >
        Dealer com Voz
      </button>

      <button
        className={modo === 'texto' ? 'ativo' : ''}
        onClick={() => setModo('texto')}
      >
        Dealer com Texto
      </button>
    </div>
  );
};

export default DealerModo;


