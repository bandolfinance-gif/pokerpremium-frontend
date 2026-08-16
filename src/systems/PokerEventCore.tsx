import React from 'react';

const PokerEventCore: React.FC = () => {

  const sendPokerEvent = (type: string) => {
    const event = new CustomEvent('cockpit-event', { detail: { type } });
    window.dispatchEvent(event);
  };

  // Eventos públicos que a mesa futurista pode chamar
  window.pokerBet = () => sendPokerEvent('poker-bet');
  window.pokerCall = () => sendPokerEvent('poker-call');
  window.pokerRaise = () => sendPokerEvent('poker-raise');
  window.pokerFold = () => sendPokerEvent('poker-fold');
  window.pokerShowdown = () => sendPokerEvent('poker-showdown');

  return null;
};

export default PokerEventCore;
