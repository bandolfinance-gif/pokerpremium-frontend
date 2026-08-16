import React from 'react';

export const SoundContext = React.createContext({
  play: (src: string) => {},
});

export const SoundSystem = {
  play(src: string) {
    new Audio(src).play();
  },
  eventoCritico() { console.log('Som: evento crítico'); },
  energia() { console.log('Som: energia crítica'); },
  hud() { console.log('Som: HUD alerta'); }
};


