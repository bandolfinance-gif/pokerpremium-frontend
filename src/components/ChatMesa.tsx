import React, { useState, useEffect } from 'react';

interface ChatMesaProps {
  acao?: string;
}

const ChatMesa: React.FC<ChatMesaProps> = ({ acao }) => {
  const [mensagens, setMensagens] = useState<string[]>([]);

  useEffect(() => {
    if (acao) {
      const texto = 
        acao === 'fold' ? 'Jogador desistiu.' :
        acao === 'call' ? 'Jogador pagou a aposta.' :
        acao === 'raise' ? 'Jogador aumentou a aposta.' :
        '';
      setMensagens(prev => [...prev, texto]);
    }
  }, [acao]);

  return (
    <div className='chat-mesa'>
      {mensagens.map((msg, i) => (
        <div key={i} className='chat-msg'>{msg}</div>
      ))}
    </div>
  );
};

export default ChatMesa;


