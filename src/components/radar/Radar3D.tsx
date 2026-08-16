import React, { useContext } from 'react';
import { CockpitContext } from '../../systems/CockpitSystem';
import { SoundContext } from '../../systems/SoundSystem';

export default function Radar3D() {
  const { alerta } = useContext(CockpitContext);
  const { play } = useContext(SoundContext);

  return (
    <div
      className={
        alerta
          ? 'radar-3d pulse alerta painel holo-border scanline glitch'
          : 'radar-3d pulse painel holo-border scanline glitch'
      }
      onClick={() => play('/sounds/warp.mp3')}
    >
      <h3>Radar 3D</h3>
      <p>Escaneamento tridimensional ativo.</p>
    </div>
  );
}


