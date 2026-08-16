export class AnimationSystem {
  static pulse(el: HTMLElement | null) {
    if (!el) return;
    el.style.animation = 'pulse 1.5s infinite';
  }
  static holograma(el: HTMLElement | null) {
    if (!el) return;
    el.style.animation = 'holograma 3s infinite';
  }
}


