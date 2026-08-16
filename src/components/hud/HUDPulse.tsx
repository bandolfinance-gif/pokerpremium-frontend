import React, { useEffect, useState } from 'react';
import { useHUDState } from './HUDCore';

const HUDPulse: React.FC = () => {
  const hud = useHUDState();
  const [pulse, setPulse] = useState<string | null>(null);

  useEffect(() => {
    const handleHudEvent = (event: Event) => {
      const e = event as CustomEvent<{ type: string }>;
      const type = e.detail?.type;

      if (type === 'poker-raise') setPulse('pulse-raise');
      if (type === 'poker-showdown') setPulse('pulse-showdown');
      if (type === 'fx-overdrive') setPulse('pulse-overdrive');

      if (hud.activity > 85) setPulse('pulse-energy');

      setTimeout(() => setPulse(null), 600);
    };

    window.addEventListener('hud-event', handleHudEvent);

    return () => {
      window.removeEventListener('hud-event', handleHudEvent);
    };
  }, [hud.activity]);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 9997
    }}>
      {pulse && (
        <div className={pulse} style={{
          position: 'absolute',
          inset: 0,
          background: 'transparent'
        }} />
      )}
    </div>
  );
};

export default HUDPulse;
