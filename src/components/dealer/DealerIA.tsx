import React from 'react';
import '../../styles/DealerIA.css';
import DealerVoice from './DealerVoice';

const DealerIA: React.FC = () => {
  const fraseIA = 'Olá jogador, iniciando a mesa futurista. Prepare-se para uma experiência premium.';

  return (
    <div className='dealer-ia-wrapper'>
      <DealerVoice text={fraseIA} />

      <div className='dealer-hologram'>
        <div className='dealer-avatar'></div>
      </div>

      <div className='dealer-text'>
        <span>{fraseIA}</span>
      </div>
    </div>
  );
};

export default DealerIA;
