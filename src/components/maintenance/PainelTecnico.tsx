import React, { useContext } from 'react';
import { CockpitContext } from '../../systems/CockpitSystem';

export default function PainelTecnico() {
  const { energia, iaStatus } = useContext(CockpitContext);

  return (
    <div className='painel-tecnico pulse'>
      <h3>Painel TÃ©cnico</h3>
      <p>Temperatura do nÃºcleo: {energia + 30}Â°C</p>
      <p>Processamento IA: {iaStatus === 'online' ? 'EstÃ¡vel' : 'Alto'}</p>
      <p>Fluxo digital: Operacional</p>
    </div>
  );
}


