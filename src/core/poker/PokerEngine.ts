// @ts-nocheck
import { AllInFX } from "../audio/AllInFX";

export class PokerEngine {
  constructor(table) {
    this.table = table;
  }

  raise(valor) {
    const player = this.table.players[this.table.currentPlayerIndex];
    if (!player) return;

    if (valor >= player.stack) {
      AllInFX.play();
    }
  }
}

