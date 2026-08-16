import React, { useEffect, useState } from 'react';
import { dataService } from '../../services/DataService';
import { audioService } from '../../sons/AudioService';
import sons from '../../sons/sons.json';

export default function Radar() {
  const [angulo, setAngulo] = useState(0);

  useEffect(() => {
    dataService.subscribe((data: any) => {
      setAngulo(data.radar);
      audioService.play(sons.radar);
    });
  }, []);

  return (
    <div className='radar painel pulse neon-anim scanline radar-anim'>
      <h3>Radar</h3>
      <p>Ã‚ngulo: {angulo.toFixed(2)}Â°</p>
    </div>
  );
}


