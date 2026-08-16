import React, { useState, useEffect } from 'react';
import '../../styles/DealerIA.css';
import DealerVoice from './DealerVoice';
import { dealerPhrases } from './DealerPhrases';

const DealerIA: React.FC = () => {
  const [fraseIA, setFraseIA] = useState(dealerPhrases[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * dealerPhrases.length);
      setFraseIA(dealerPhrases[random]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

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
