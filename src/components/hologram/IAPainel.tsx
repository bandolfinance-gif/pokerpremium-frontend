import React, { useContext } from 'react';
import { CockpitContext } from '../../systems/CockpitSystem';
import { SoundContext } from '../../systems/SoundSystem';

export default function IAPainel() {
  const { iaStatus, setIaStatus } = useContext(CockpitContext);
  const { play } = useContext(SoundContext);

  const toggleStatus = () => {
    const novo = iaStatus === 'online' ? 'processando' : 'online';
    setIaStatus(novo);
    play('/sounds/voz-holografica.mp3');
  };

  return (
    <div className='hologram-painel pulse' onClick={toggleStatus}>
      <h3>Painel IA</h3>
      <p>Status atual: {iaStatus}</p>
    </div>
  );
}


