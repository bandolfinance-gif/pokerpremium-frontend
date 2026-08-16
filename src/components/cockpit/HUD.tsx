import React, { useContext } from 'react';
import { CockpitContext } from '../../systems/CockpitSystem';
import { SoundContext } from '../../systems/SoundSystem';

export default function HUD() {
  const { alerta } = useContext(CockpitContext);
  const { play } = useContext(SoundContext);

  return (
    <div
      className={alerta ? 'cockpit-hud pulse alerta painel neon' : 'cockpit-hud pulse painel neon'}
      onClick={() => play('/sounds/click-futurista.mp3')}
    >
      <h3>HUD Futurista</h3>
      <p>Interface principal do cockpit.</p>
    </div>
  );
}


