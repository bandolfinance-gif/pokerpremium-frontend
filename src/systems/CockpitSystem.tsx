import React from 'react';
import HologramHUD from '../components/cockpit/HologramHUD';
import NeonParticles from '../components/cockpit/NeonParticles';
import DealerIA from '../components/dealer/DealerIA';

const CockpitSystem: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <NeonParticles />
      <HologramHUD />
      <DealerIA />
    </div>
  );
};

export default CockpitSystem;
