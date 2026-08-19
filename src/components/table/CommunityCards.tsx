import React from 'react';
import Card from './Card';
import { HandState } from '../../services/gameSocket';

interface CommunityCardsProps {
  hand: HandState | null;
}

// Cartas comunitárias e pote reais, vindos do motor de jogo — nada de
// placeholder ou fórmula decorativa.
const CommunityCards: React.FC<CommunityCardsProps> = ({ hand }) => {
  const cards = hand?.communityCards ?? [];
  const slots = Array.from({ length: 5 }, (_, i) => cards[i] ?? null);

  return (
    <div style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {slots.map((card, i) =>
          card ? (
            <Card key={i} card={card} />
          ) : (
            <div key={i} style={{ width: 40, height: 56, borderRadius: 6, border: '1px solid rgba(0,234,255,0.25)', background: 'rgba(0,0,0,0.35)' }} />
          )
        )}
      </div>
      <div style={{ marginTop: 10, color: '#ffd76a', fontFamily: 'monospace', fontSize: '13px' }}>
        {hand ? `POT ${hand.pot.toLocaleString('pt-BR')}` : 'Aguardando mão'}
      </div>
    </div>
  );
};

export default CommunityCards;
