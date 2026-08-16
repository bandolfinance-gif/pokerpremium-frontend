import React from 'react';
import HologramHUD from '../components/cockpit/HologramHUD';
import NeonParticles from '../components/cockpit/NeonParticles';
import DealerIA from '../components/dealer/DealerIA';
import DealerIAReactive from '../components/dealer/DealerIAReactive';
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
import QuantumSparks from '../components/cockpit/QuantumSparks';
import AmbientNebula from '../components/cockpit/AmbientNebula';
import StarfieldWarp from '../components/cockpit/StarfieldWarp';
import HologramRadar from '../components/cockpit/HologramRadar';
import HologramCompass from '../components/cockpit/HologramCompass';
import StatusPanel from '../components/cockpit/StatusPanel';
import CockpitCommandPanel from '../components/cockpit/CockpitCommandPanel';
import AdvancedIndicators from '../components/cockpit/AdvancedIndicators';
import HologramSoundFX from '../components/cockpit/HologramSoundFX';
import CockpitInteractionCore from '../components/cockpit/CockpitInteractionCore';

const CockpitSystem: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <SoundSystem />
      <HologramSoundFX />
      <CockpitInteractionCore />
      <AmbientNebula />
      <StarfieldWarp />
      <GlowGrid />
      <PulseCore />
      <HologramRing />
      <HologramScanline />
      <CornerGlow />
      <QuantumSparks />
      <NeonParticles />
      <NeonSidePanels />
      <HUDEnergyBar />
      <EdgeLights />
      <HologramRadar />
      <HologramCompass />
      <StatusPanel />
      <AdvancedIndicators />
      <CockpitCommandPanel />
      <HologramHUD />
      <FuturisticTable />
      <DealerIA />
      <DealerIAReactive />
    </div>
  );
};

export default CockpitSystem;
