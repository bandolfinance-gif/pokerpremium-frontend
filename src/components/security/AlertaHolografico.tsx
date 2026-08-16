import React, { useContext } from 'react';
import { CockpitContext } from '../../systems/CockpitSystem';
import { SoundContext } from '../../systems/SoundSystem';

export default function AlertaHolografico() {
  const { alerta } = useContext(CockpitContext);
  const { play } = useContext(SoundContext);

  if (!alerta) return null;

  return (
    <div className='alerta-holografico pulse' onClick={() => play('/sounds/alerta-holografico.mp3')}>
      <h3>? ALERTA DE ENERGIA ?</h3>
      <p>NÃ­vel crÃ­tico detectado!</p>
    </div>
  );
}


