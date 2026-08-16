import React, { useContext } from 'react';
import { CockpitContext } from '../../systems/CockpitSystem';
import { SoundContext } from '../../systems/SoundSystem';

export default function IAVoz() {
  const { iaStatus } = useContext(CockpitContext);
  const { play } = useContext(SoundContext);

  const falar = () => {
    play('/sounds/voz-holografica.mp3');
  };

  return (
    <div className='hologram-voz pulse' onClick={falar}>
      <h3>Voz IA</h3>
      <p>Mensagem: Sistema estÃ¡ {iaStatus}</p>
    </div>
  );
}


