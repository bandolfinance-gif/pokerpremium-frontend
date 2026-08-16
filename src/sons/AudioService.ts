export class AudioService {
  play(src: string) {
    if (!src) return;
    new Audio(src).play();
  }
}
export const audioService = new AudioService();
