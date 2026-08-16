export const VictoryFX = {
  play() {
    const audio = new Audio('/assets/sounds/victory_fx.mp3');
    audio.volume = 0.9;
    audio.play();
  }
};
