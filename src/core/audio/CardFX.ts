export const CardFX = {
  play() {
    const audio = new Audio('/assets/sounds/card_deal.mp3');
    audio.volume = 0.5;
    audio.play();
  }
};
