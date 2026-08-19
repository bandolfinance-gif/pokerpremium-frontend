import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage, connectChatSocket, fetchChatHistory, sendChatMessage } from '../../services/chatApi';
import {
  defaultDealerVoiceConfig,
  DealerGender,
  getDealerGender,
  isDealerMuted,
  setDealerGender,
  setDealerMuted,
  speakText,
} from '../../services/dealerVoice';

interface ChatBoxProps {
  token: string;
  tableId: string;
}

const DEALER_NAME = 'Dealer IA';

// Chat da mesa: jogadores conversam entre si em tempo real (WebSocket,
// escopado por mesa — cada mesa tem sua própria sala/histórico, não é mais
// um chat global único). A dealer narra os eventos REAIS da mão (feito no
// backend, gameServer.js) e responde quando chamada pelo nome — este
// componente só recebe e fala essas mensagens, não inventa nenhuma aqui
// (antes ecoava uma frase genérica própria a cada troca de fase, o que
// duplicava a narração real do servidor).
const ChatBox: React.FC<ChatBoxProps> = ({ token, tableId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [warning, setWarning] = useState('');
  const [muted, setMuted] = useState(isDealerMuted());
  const [dealerGender, setDealerGenderState] = useState<DealerGender>(getDealerGender());
  const socketRef = useRef<WebSocket | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // No celular a caixa de chat (fixa no canto) ficava em cima do botão
  // de FOLD/CALL/RAISE, que também é ancorado embaixo — atrapalhava a
  // jogada. Em telas estreitas ela começa recolhida, só um ícone
  // pequeno no canto, sem tomar o espaço da área de ação; o jogador abre
  // quando quiser ler/escrever.
  const [minimized, setMinimized] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    setMessages([]);
    fetchChatHistory(tableId, token).then(setMessages).catch(() => {});

    const socket = connectChatSocket(
      tableId,
      token,
      (msg) => {
        setMessages((prev) => [...prev, msg]);
        if (msg.autor === DEALER_NAME) {
          speakText(msg.texto, defaultDealerVoiceConfig);
        }
      },
      (message) => {
        setWarning(message);
        setTimeout(() => setWarning(''), 3000);
      }
    );
    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [tableId, token]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const handleSend = () => {
    if (!draft.trim() || !socketRef.current) return;
    sendChatMessage(socketRef.current, draft.trim());
    setDraft('');
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setDealerMuted(next);
    // Silenciar bloqueava só falas FUTURAS — se a dealer já estava no
    // meio de uma frase quando você clicava, ela continuava até o fim,
    // dando a impressão de que o botão não fazia nada. Isso corta na
    // hora, mesmo já em andamento.
    if (next && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleDealerGender = () => {
    const next: DealerGender = dealerGender === 'female' ? 'male' : 'female';
    setDealerGenderState(next);
    setDealerGender(next);
  };

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        title="Abrir chat da mesa"
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '1px solid #00eaff',
          background: 'rgba(0,0,0,0.65)',
          color: '#00eaff',
          boxShadow: '0 0 12px rgba(0,234,255,0.4)',
          fontSize: 18,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        💬
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 220,
        height: 170,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(0,0,0,0.55)',
        border: '1px solid #00eaff',
        borderRadius: 10,
        boxShadow: '0 0 12px rgba(0,234,255,0.4)',
        overflow: 'hidden',
        fontFamily: 'monospace',
        fontSize: 12,
      }}
    >
      <div
        style={{
          padding: '6px 10px',
          borderBottom: '1px solid rgba(0,234,255,0.3)',
          color: '#00eaff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>CHAT DA MESA</span>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          <button
            onClick={() => setMinimized(true)}
            title="Minimizar chat"
            style={{
              flexShrink: 0,
              background: 'transparent',
              border: '1px solid rgba(0,234,255,0.4)',
              borderRadius: 4,
              color: '#00eaff',
              fontSize: 10,
              padding: '2px 6px',
              cursor: 'pointer',
            }}
          >
            ▁
          </button>
          <button
            onClick={toggleDealerGender}
            title={dealerGender === 'male' ? 'Dealer: masculino (clique pra trocar)' : 'Dealer: feminino (clique pra trocar)'}
            style={{
              flexShrink: 0,
              background: 'transparent',
              border: '1px solid rgba(255,215,106,0.4)',
              borderRadius: 4,
              color: '#ffd76a',
              fontSize: 10,
              padding: '2px 6px',
              cursor: 'pointer',
            }}
          >
            {dealerGender === 'male' ? '♂' : '♀'}
          </button>
          <button
            onClick={toggleMute}
            title={muted ? 'Ativar voz da dealer' : 'Silenciar voz da dealer'}
            style={{
              flexShrink: 0,
              background: 'transparent',
              border: '1px solid rgba(0,234,255,0.4)',
              borderRadius: 4,
              color: muted ? '#ff4d6d' : '#00eaff',
              fontSize: 10,
              padding: '2px 6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {muted ? 'VOZ OFF' : 'VOZ ON'}
          </button>
        </div>
      </div>
      <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '6px 10px' }}>
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: 4, color: m.autor === DEALER_NAME ? '#ffd76a' : '#e8fdff' }}>
            <strong>{m.autor}:</strong> {m.texto}
          </div>
        ))}
      </div>
      {warning && <div style={{ padding: '4px 10px', color: '#ff4d6d', fontSize: 11 }}>{warning}</div>}
      <div style={{ display: 'flex', borderTop: '1px solid rgba(0,234,255,0.3)' }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Digite..."
          style={{
            flex: 1,
            minWidth: 0,
            background: 'transparent',
            border: 'none',
            color: '#e8fdff',
            padding: '6px 10px',
            outline: 'none',
            fontFamily: 'monospace',
            fontSize: 12,
          }}
        />
        <button
          onClick={handleSend}
          style={{
            flexShrink: 0,
            background: 'rgba(0,234,255,0.15)',
            border: 'none',
            color: '#00eaff',
            padding: '0 12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          ENVIAR
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
