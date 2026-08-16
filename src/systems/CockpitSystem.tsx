import React from 'react';
import PokerEventCore from './PokerEventCore';
...
// resto do cockpit

const CockpitSystem: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <PokerEventCore />
      ...
    </div>
  );
};

export default CockpitSystem;
