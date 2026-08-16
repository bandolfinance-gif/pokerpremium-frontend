import React, { useEffect, useState } from 'react';
import { useHUDState } from './HUDCore';

const HUDRadar: React.FC = () => {
  const hud = useHUDState();
  const [spin, setSpin] = useState<string | null>(null);

  useEffect(() => {
    const handleHudEvent = (event: Event) => {
      const e = event as CustomEvent<{ type: string }>;
      const type = e.detail?.type;

      if (['poker-flop','poker-turn','poker-river','poker-showdown'].includes(type)) {
        setSpin('radar-spin');
        setTimeout(() => setSpin(null), 1200);
      }
    };

    window.addEventListener('hud-event', handleHudEvent);

    return () => {
      window.removeEventListener('hud-event', handleHudEvent);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      right: 20,
      width: '140px',
      height: '140px',
      borderRadius: '50%',
      border: '2px solid #00eaff',
      boxShadow: '0 0 12px #00eaff',
      overflow: 'hidden',
      background: 'rgba(0,0,0,0.35)'
    }}>
      <div className={spin || ''} style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        border: '2px dashed #00ffaa'
      }} />
    </div>
  );
};

export default HUDRadar;
