// @ts-nocheck
import React, { useEffect } from 'react';
import { VictoryFX } from '../core/audio/VictoryFX';
import '../styles/VictoryFireworks.css';

const Showdown = ({ vencedor }) => {
  useEffect(() => {
    VictoryFX.play();
  }, []);

  return (
    <div className='victory-fireworks'>
      ??? {vencedor} venceu a mÃ£o! ???
    </div>
  );
};

export default Showdown;



