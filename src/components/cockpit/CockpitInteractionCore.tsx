import React, { useEffect } from 'react';

const CockpitInteractionCore: React.FC = () => {
  useEffect(() => {
    const sendEvent = (type: string) => {
      const event = new CustomEvent('cockpit-event', { detail: { type } });
      window.dispatchEvent(event);
    };

    const handleClick = () => sendEvent('click');
    const handleKey = () => sendEvent('key');
    const handleMove = () => sendEvent('move');

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousemove', handleMove);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousemove', handleMove);
    };
  }, []);

  return null;
};

export default CockpitInteractionCore;
