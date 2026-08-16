// @ts-nocheck
export const DealerFX = {
  falar(msg) {
    const audio = new Audio('/assets/sounds/dealer_voice_fx.mp3');
    audio.volume = 0.7;
    audio.play();
  }
};

