import React from 'react';
import HologramHUD from '../components/cockpit/HologramHUD';
import NeonParticles from '../components/cockpit/NeonParticles';
import DealerIA from '../components/dealer/DealerIA';
import FuturisticTable from '../components/table/FuturisticTable';
import SoundSystem from './SoundSystem';
import NeonSidePanels from '../components/cockpit/NeonSidePanels';
import HUDEnergyBar from '../components/cockpit/HUDEnergyBar';

const CockpitSystem: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <SoundSystem />
      <NeonParticles />
      <NeonSidePanels />
      <HUDEnergyBar />
      <HologramHUD />
      <FuturisticTable />
      <DealerIA />
    </div>
  );
};

export default CockpitSystem;
