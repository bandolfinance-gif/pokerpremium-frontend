import React, { useEffect } from 'react';

const SoundSystem: React.FC = () => {
  useEffect(() => {
    const audio = new Audio('/sounds/cockpit-ambient.ogg');
    audio.loop = true;
    audio.volume = 0.35;
    audio.play().catch(() => {
      console.warn('Som futurista aguardando interação do usuário.');
    });

    return () => {
      audio.pause();
    };
  }, []);

  return null;
};

export default SoundSystem;
