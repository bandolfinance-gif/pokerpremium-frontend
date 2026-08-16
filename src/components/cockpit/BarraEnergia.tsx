import React, { useContext } from 'react';
import { CockpitContext } from '../../systems/CockpitSystem';
import { SoundContext } from '../../systems/SoundSystem';

export default function BarraEnergia() {
  const { energia } = useContext(CockpitContext);
  const { play } = useContext(SoundContext);

  return (
    <div
      className='cockpit-barra-energia pulse painel neon-anim'
      onClick={() => play('/sounds/trilha-ambiente.mp3')}
    >
      <h3>Energia</h3>
      <p>NÃ­vel atual: {energia}%</p>
    </div>
  );
}


