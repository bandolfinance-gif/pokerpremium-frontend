import React, { useContext } from 'react';
import { CockpitContext } from '../../systems/CockpitSystem';
import { SoundContext } from '../../systems/SoundSystem';

export default function GestureHandler() {
  const { setIaStatus } = useContext(CockpitContext);
  const { play } = useContext(SoundContext);

  const gesto = () => {
    setIaStatus('processando');
    play('/sounds/holo-change.mp3');
  };

  return (
    <div className='gesture-handler pulse' onClick={gesto}>
      <h3>Gestos</h3>
      <p>Ativar IA via gesto hologrÃ¡fico.</p>
    </div>
  );
}


