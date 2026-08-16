export const DealerAudio = {
  preflop: new Audio('/audio/preflop.mp3'),
  flop: new Audio('/audio/flop.mp3'),
  turn: new Audio('/audio/turn.mp3'),
  river: new Audio('/audio/river.mp3'),
  showdown: new Audio('/audio/showdown.mp3'),
  acao: (texto: string) => {
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = 'pt-BR';
    fala.pitch = 1.2;
    fala.rate = 1.05;
    fala.volume = 1;
    speechSynthesis.speak(fala);
  }
};
