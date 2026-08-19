import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
// Chat, jogo e sinalização de vídeo dividem a MESMA porta/host do backend
// agora (ver server.js) — só o CAMINHO muda (/chat vs /game).
const WS_BASE_URL = process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:3001';
const WS_URL = `${WS_BASE_URL}/chat`;

export interface ChatMessage {
  id: string;
  autor: string;
  texto: string;
}

export const fetchChatHistory = async (tableId: string, token: string): Promise<ChatMessage[]> => {
  const { data } = await axios.get<ChatMessage[]>(`${API_URL}/chat`, {
    params: { tableId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

// Autenticado por JWT — o servidor identifica quem está falando pelo
// token, nunca por um campo "autor" que o cliente poderia inventar.
export const connectChatSocket = (
  tableId: string,
  token: string,
  onMessage: (msg: ChatMessage) => void,
  onModeration?: (message: string) => void
): WebSocket => {
  const socket = new WebSocket(`${WS_URL}?tableId=${encodeURIComponent(tableId)}&token=${encodeURIComponent(token)}`);
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'chat') onMessage(data);
      if (data.type === 'moderation' && onModeration) onModeration(data.message);
    } catch {
      // mensagem não-JSON, ignora
    }
  };
  return socket;
};

export const sendChatMessage = (socket: WebSocket, texto: string) => {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ texto }));
  }
};
