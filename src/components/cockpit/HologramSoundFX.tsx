import React, { useEffect } from 'react';

const HologramSoundFX: React.FC = () => {
  const clickSound = new Audio('/sounds/holo-click.ogg');
  const activateSound = new Audio('/sounds/holo-activate.ogg');
  const pulseSound = new Audio('/sounds/holo-pulse.ogg');

  useEffect(() => {
    const handleClick = () => clickSound.play();
    const handleActivate = () => activateSound.play();

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleActivate);

    pulseSound.loop = true;
    pulseSound.volume = 0.4;
    pulseSound.play();

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleActivate);
      pulseSound.pause();
    };
  }, []);

  return null;
};

export default HologramSoundFX;
