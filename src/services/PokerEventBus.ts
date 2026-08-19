// Ponte de eventos do jogo para o cockpit: dispara 'cockpit-event' (consumido por
// HUDCore, que já atualiza mood/stage/action) e serve de gatilho único também
// para a voz do dealer (DealerVoice).
export type PokerEventType =
  | 'poker-bet'
  | 'poker-call'
  | 'poker-raise'
  | 'poker-fold'
  | 'poker-flop'
  | 'poker-turn'
  | 'poker-river'
  | 'poker-showdown'
  | 'poker-reset';

export const dispatchPokerEvent = (type: PokerEventType, detail?: Record<string, unknown>) => {
  window.dispatchEvent(new CustomEvent('cockpit-event', { detail: { type, ...detail } }));
};
