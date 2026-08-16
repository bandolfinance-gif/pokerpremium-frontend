import React from 'react';
import HologramHUD from '../components/cockpit/HologramHUD';
import NeonParticles from '../components/cockpit/NeonParticles';
import DealerIA from '../components/dealer/DealerIA';
import FuturisticTable from '../components/table/FuturisticTable';
import SoundSystem from './SoundSystem';
import NeonSidePanels from '../components/cockpit/NeonSidePanels';
import HUDEnergyBar from '../components/cockpit/HUDEnergyBar';
import EdgeLights from '../components/cockpit/EdgeLights';
import GlowGrid from '../components/cockpit/GlowGrid';
import PulseCore from '../components/cockpit/PulseCore';
import HologramRing from '../components/cockpit/HologramRing';
import HologramScanline from '../components/cockpit/HologramScanline';
import CornerGlow from '../components/cockpit/CornerGlow';

const CockpitSystem: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <SoundSystem />
      <GlowGrid />
      <PulseCore />
      <HologramRing />
      <HologramScanline />
      <CornerGlow />
      <NeonParticles />
      <NeonSidePanels />
      <HUDEnergyBar />
      <EdgeLights />
      <HologramHUD />
      <FuturisticTable />
      <DealerIA />
    </div>
  );
};

export default CockpitSystem;
