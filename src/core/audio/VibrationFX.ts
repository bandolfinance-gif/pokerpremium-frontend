export const VibrationFX = {
  play() {
    const audio = new Audio('/assets/sounds/vibration_fx.mp3');
    audio.volume = 0.8;
    audio.play();
  }
};
