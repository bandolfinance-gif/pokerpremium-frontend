export const PotImpactFX = {
  play() {
    const audio = new Audio('/assets/sounds/pot_impact.mp3');
    audio.volume = 0.7;
    audio.play();
  }
};
