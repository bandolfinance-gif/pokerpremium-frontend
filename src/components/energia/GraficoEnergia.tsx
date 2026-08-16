import React, { useContext } from 'react';
import { CockpitContext } from '../../systems/CockpitSystem';

export default function GraficoEnergia() {
  const { energia } = useContext(CockpitContext);

  return (
    <div className='grafico-energia pulse painel scanline neon-anim'>
      <h3>GrÃ¡fico de Energia</h3>

      <div className='barra-externa'>
        <div
          className='barra-interna'
          style={{
            width: energia + '%',
            background: energia > 30 ? 'cyan' : 'red'
          }}
        ></div>
      </div>

      <p>NÃ­vel atual: {energia}%</p>
    </div>
  );
}


