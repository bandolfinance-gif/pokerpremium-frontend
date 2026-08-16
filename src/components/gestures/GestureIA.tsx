import React, { useContext } from 'react';
import { CockpitContext } from '../../systems/CockpitSystem';
import { SoundContext } from '../../systems/SoundSystem';

export default function GestureIA() {
  const { iaStatus, setIaStatus } = useContext(CockpitContext);
  const { play } = useContext(SoundContext);

  const acionar = () => {
    const novo = iaStatus === 'online' ? 'processando' : 'online';
    setIaStatus(novo);
    play('/sounds/voz-holografica.mp3');
  };

  return (
    <div className='gesture-ia pulse' onClick={acionar}>
      <h3>Gesto IA</h3>
      <p>Status atual: {iaStatus}</p>
    </div>
  );
}


