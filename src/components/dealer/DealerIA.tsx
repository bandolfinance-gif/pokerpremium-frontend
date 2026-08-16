import React from 'react';
import '../../styles/DealerIA.css';

const DealerIA: React.FC = () => {
  return (
    <div className='dealer-ia-wrapper'>
      <div className='dealer-hologram'>
        <div className='dealer-avatar'></div>
      </div>

      <div className='dealer-text'>
        <span>Olá jogador, estou pronta para iniciar a mesa futurista.</span>
      </div>
    </div>
  );
};

export default DealerIA;
