export class MultiplayerService {
  private socket: WebSocket | null = null;

  conectar() {
    this.socket = new WebSocket('ws://localhost:8080');

    this.socket.onopen = () => console.log('Multiplayer conectado');
    this.socket.onmessage = (msg: MessageEvent) => console.log('MSG:', msg.data);
    this.socket.onerror = (err: Event) => console.error('Erro:', err);
  }

  enviarAtualizacao(estado: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(estado));
    }
  }
}
