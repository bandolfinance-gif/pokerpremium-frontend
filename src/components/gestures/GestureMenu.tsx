import React, { useContext, useState } from 'react';
import { SoundContext } from '../../systems/SoundSystem';

export default function GestureMenu() {
  const { play } = useContext(SoundContext);
  const [aberto, setAberto] = useState(false);

  const toggle = () => {
    setAberto(!aberto);
    play('/sounds/holo-change.mp3');
  };

  return (
    <div className='gesture-menu pulse' onClick={toggle}>
      <h3>Menu HologrÃ¡fico</h3>
      {aberto ? <p>Menu aberto</p> : <p>Menu fechado</p>}
    </div>
  );
}


