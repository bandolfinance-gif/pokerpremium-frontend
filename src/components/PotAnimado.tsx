// @ts-nocheck
import React, { useEffect } from 'react';
import { PotImpactFX } from '../core/audio/PotImpactFX';
import '../styles/Pot.css';

const PotAnimado = ({ pot }) => {
  useEffect(() => {
    PotImpactFX.play();
  }, [pot]);

  return (
    <div className='pot'>
      Pot: {pot}
    </div>
  );
};

export default PotAnimado;



