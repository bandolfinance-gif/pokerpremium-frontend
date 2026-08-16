import React, { useState } from 'react';

const PokerRoundFlow: React.FC = () => {

  const sendEvent = (type: string) => {
    const event = new CustomEvent('cockpit-event', { detail: { type } });
    window.dispatchEvent(event);
  };

  const [stage, setStage] = useState('preflop');

  const nextStage = () => {
    if (stage === 'preflop') {
      setStage('flop');
      sendEvent('poker-flop');
    } else if (stage === 'flop') {
      setStage('turn');
      sendEvent('poker-turn');
    } else if (stage === 'turn') {
      setStage('river');
      sendEvent('poker-river');
    } else if (stage === 'river') {
      setStage('showdown');
      sendEvent('poker-showdown');
    }
  };

  const resetRound = () => {
    setStage('preflop');
    sendEvent('poker-reset');
  };

  // Expor funções globais
  window.pokerNextStage = nextStage;
  window.pokerResetRound = resetRound;

  return null;
};

export default PokerRoundFlow;
