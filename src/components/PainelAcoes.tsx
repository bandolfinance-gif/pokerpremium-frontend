import React, { useState } from 'react';
import RaiseSlider from './RaiseSlider';
import { ButtonFX } from '../core/audio/ButtonFX';

interface PainelAcoesProps {
  stackAtual: number;
  apostaMinima: number;
  onFold: () => void;
  onCall: () => void;
  onRaise: (valor: number) => void;
}

const PainelAcoes: React.FC<PainelAcoesProps> = ({
  stackAtual,
  apostaMinima,
  onFold,
  onCall,
  onRaise
}) => {
  const [valorRaise, setValorRaise] = useState(apostaMinima * 2);

  return (
    <div className='painel-acoes'>
      <button onClick={() => { ButtonFX.play(); onFold(); }}>FOLD</button>
      <button onClick={() => { ButtonFX.play(); onCall(); }}>CALL {apostaMinima}</button>
      <button onClick={() => { ButtonFX.play(); onRaise(valorRaise); }}>RAISE</button>

      <RaiseSlider
        valor={valorRaise}
        min={apostaMinima}
        max={stackAtual}
        onChange={setValorRaise}
      />
    </div>
  );
};

export default PainelAcoes;


