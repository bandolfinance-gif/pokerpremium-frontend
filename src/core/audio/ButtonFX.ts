export const ButtonFX = {
  play() {
    const audio = new Audio('/assets/sounds/click_futuristic.mp3');
    audio.volume = 0.4;
    audio.play();
  }
};
