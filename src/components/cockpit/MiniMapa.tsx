import React, { useContext } from 'react';
import { SoundContext } from '../../systems/SoundSystem';

export default function MiniMapa() {
  const { play } = useContext(SoundContext);

  return (
    <div
      className='cockpit-minimapa pulse painel scanline'
      onClick={() => play('/sounds/holo-change.mp3')}
    >
      <h3>MiniMapa</h3>
      <p>VisualizaÃ§Ã£o tÃ¡tica do ambiente.</p>
    </div>
  );
}


