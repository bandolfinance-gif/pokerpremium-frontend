import React, { useContext } from 'react';
import { CockpitContext } from '../../systems/CockpitSystem';
import { SoundContext } from '../../systems/SoundSystem';

export default function IAAvatar() {
  const { alerta, iaStatus } = useContext(CockpitContext);
  const { play } = useContext(SoundContext);

  return (
    <div
      className={
        alerta
          ? 'hologram-avatar pulse alerta painel neon float-holo neon-anim'
          : 'hologram-avatar pulse painel neon float-holo neon-anim'
      }
      onClick={() => play('/sounds/voz-holografica.mp3')}
    >
      <h3>Avatar IA</h3>
      <p>Estado hologrÃ¡fico: {iaStatus}</p>
      {alerta && <p>? AtenÃ§Ã£o: energia crÃ­tica detectada!</p>}
    </div>
  );
}


