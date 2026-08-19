import React, { useEffect, useState } from 'react';
import { useHUDState } from './HUDCore';

const HUDCompass: React.FC = () => {
  const hud = useHUDState();
  const [direction, setDirection] = useState<string | null>(null);

  useEffect(() => {
    if (hud.mood === 'FOCUSED') setDirection('compass-focused');
    if (hud.mood === 'ALERT') setDirection('compass-alert');
    if (hud.mood === 'CALM') setDirection('compass-calm');
    if (hud.mood === 'OVERDRIVE') setDirection('compass-overdrive');

    setTimeout(() => setDirection(null), 1200);
  }, [hud.mood]);

  return (
    <div style={{
      position: 'absolute',
      top: 740,
      right: 20,
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      border: '2px solid #00eaff',
      boxShadow: '0 0 12px #00eaff',
      overflow: 'hidden',
      background: 'rgba(0,0,0,0.35)'
    }}>
      <div className={direction || ''} style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        border: '2px solid #00ffaa'
      }} />
    </div>
  );
};

export default HUDCompass;
