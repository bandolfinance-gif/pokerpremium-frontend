import React from 'react';
import { CardData } from '../../services/gameSocket';

interface CardProps {
  card?: CardData | null;
  faceDown?: boolean;
  width?: number;
  height?: number;
}

const RED_SUITS = ['♥', '♦'];

// Carta de baralho real — naipe grande de fundo, com o número centralizado
// exatamente no mesmo ponto (um símbolo integrado, número "dentro" do
// naipe, em vez de duas peças soltas empilhadas), mais um índice pequeno
// no canto pra quem já está acostumado a ler carta de baralho de verdade.
// Legível mesmo pequena (assento de mesa), sem perder o visual limpo.
const Card: React.FC<CardProps> = ({ card, faceDown, width = 40, height = 56 }) => {
  if (faceDown || !card) {
    return (
      <div
        style={{
          width,
          height,
          borderRadius: 6,
          background: 'repeating-linear-gradient(45deg, rgba(0,234,255,0.12), rgba(0,234,255,0.12) 4px, rgba(0,0,0,0.5) 4px, rgba(0,0,0,0.5) 8px)',
          border: '1px solid rgba(0,234,255,0.4)',
        }}
      />
    );
  }

  const color = RED_SUITS.includes(card.suit) ? '#ff5f7a' : '#f4fbff';
  const glow = RED_SUITS.includes(card.suit) ? 'rgba(255,95,122,0.55)' : 'rgba(244,251,255,0.4)';

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 6,
        background: 'linear-gradient(160deg, #12161f, #05070a)',
        border: '1px solid #ffd76a',
        boxShadow: '0 0 8px rgba(255,215,106,0.35)',
        overflow: 'hidden',
        fontFamily: 'monospace',
        fontWeight: 'bold',
      }}
    >
      {/* naipe grande, de fundo — ampliado e centralizado no mesmo ponto
          onde o número vai ficar, pra virar um símbolo só (número dentro
          do naipe), não duas camadas soltas. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: width * 1.15,
          color,
          opacity: 0.4,
          lineHeight: 1,
        }}
      >
        {card.suit}
      </div>

      {/* valor centralizado no MESMO ponto do naipe de fundo — contorno
          escuro (fake stroke via múltiplas text-shadow) garante leitura
          mesmo em cima do naipe ou da borda dourada, sem depender só do
          glow. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          fontSize: width * 0.62,
          lineHeight: 1,
          textShadow: `-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 8px ${glow}`,
        }}
      >
        {card.rank}
      </div>

      {/* índice pequeno no canto, leitura tradicional de carta */}
      <div
        style={{
          position: 'absolute',
          top: 1,
          left: 3,
          fontSize: Math.max(8, width * 0.24),
          color,
          lineHeight: 1,
          opacity: 1,
          textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
        }}
      >
        {card.rank}
      </div>
    </div>
  );
};

export default Card;
