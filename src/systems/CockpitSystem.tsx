import React from 'react';
import PokerEventCore from './PokerEventCore';
import PokerRoundFlow from './PokerRoundFlow';
import HologramFXCore from '../components/cockpit/HologramFXCore';
import SoundFXCore from '../components/cockpit/SoundFXCore';
import LightFXCore from '../components/cockpit/LightFXCore';
import HologramHUD from '../components/cockpit/HologramHUD';
import NeonParticles from '../components/cockpit/NeonParticles';
import DealerIA from '../components/dealer/DealerIA';
import DealerIAReactive from '../components/dealer/DealerIAReactive';
import FuturisticTable from '../components/table/FuturisticTable';
import SoundSystem from './SoundSystem';
import NeonSidePanels from '../components/cockpit/NeonSidePanels';
import HUDEnergyBar from '../components/hud/HUDEnergyBar';
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
      <PokerEventCore />
      <PokerRoundFlow />
      <HologramFXCore />
      <SoundFXCore />
      <LightFXCore />
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
import HUDCore from '../components/hud/HUDCore';
<HUDCore />
import HUDPulse from '../components/hud/HUDPulse';
<HUDPulse />
import HUDIndicators from '../components/hud/HUDIndicators';
<HUDIndicators />
import HUDRadar from '../components/hud/HUDRadar';
<HUDRadar />
import HUDCompass from '../components/hud/HUDCompass';
<HUDCompass />
import HUDRoundFlow from '../components/hud/HUDRoundFlow';
<HUDRoundFlow />
import HUDActionFlow from '../components/hud/HUDActionFlow';
<HUDActionFlow />
import HUDIAState from '../components/hud/HUDIAState';
<HUDIAState />
import HUDProfilePanel from '../components/hud/HUDProfilePanel';
<HUDProfilePanel />
