import React, { useEffect, useState } from 'react';
import { useHUDState } from './HUDCore';

const HUDRadar: React.FC = () => {
  const hud = useHUDState();
  const [spin, setSpin] = useState<string | null>(null);

  useEffect(() => {
    // Antes escutava 'hud-event', um evento que nunca era disparado em
    // lugar nenhum do app — o radar nunca girava. O evento real (disparado
    // por PokerTable em toda mudança de fase de verdade) é 'cockpit-event'.
    const handleCockpitEvent = (event: Event) => {
      const e = event as CustomEvent<{ type: string }>;
      const type = e.detail?.type;

      if (type && ['poker-flop', 'poker-turn', 'poker-river', 'poker-showdown'].includes(type)) {
        setSpin('radar-spin');
        setTimeout(() => setSpin(null), 1200);
      }
    };

    window.addEventListener('cockpit-event', handleCockpitEvent);

    return () => {
      window.removeEventListener('cockpit-event', handleCockpitEvent);
    };
  }, []);

  const sweepColor = hud.mood === 'ALERT' ? '#ff4444' : hud.mood === 'OVERDRIVE' ? '#ff00ff' : '#00ffaa';

  return (
    <div style={{
      position: 'absolute',
      top: 900,
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
        border: `2px dashed ${sweepColor}`
      }} />
    </div>
  );
};

export default HUDRadar;
