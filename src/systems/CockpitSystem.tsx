import React from 'react';

import HUDEnergyBar from '../components/hud/HUDEnergyBar';
import HUDPulse from '../components/hud/HUDPulse';
import HUDIndicators from '../components/hud/HUDIndicators';
import HUDRadar from '../components/hud/HUDRadar';
import HUDCompass from '../components/hud/HUDCompass';
import HUDRoundFlow from '../components/hud/HUDRoundFlow';
import HUDActionFlow from '../components/hud/HUDActionFlow';
import HUDIAState from '../components/hud/HUDIAState';
import HUDProfilePanel from '../components/hud/HUDProfilePanel';
import HUDMatrixGrid from '../components/hud/HUDMatrixGrid';
import HUDThermalMap from '../components/hud/HUDThermalMap';
import HUDOverdrivePulse from '../components/hud/HUDOverdrivePulse';
import HUDNeuralScan from '../components/hud/HUDNeuralScan';
import HUDSpectrumWave from '../components/hud/HUDSpectrumWave';
import HUDQuantumField from '../components/hud/HUDQuantumField';
import HUDCryoFlux from '../components/hud/HUDCryoFlux';
import HUDVortexField from '../components/hud/HUDVortexField';

const CockpitSystem: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <HUDEnergyBar />
      <HUDPulse />
      <HUDIndicators />
      <HUDRadar />
      <HUDCompass />
      <HUDRoundFlow />
      <HUDActionFlow />
      <HUDIAState />
      <HUDProfilePanel />
      <HUDMatrixGrid />
      <HUDThermalMap />
      <HUDOverdrivePulse />
      <HUDNeuralScan />
      <HUDSpectrumWave />
      <HUDQuantumField />
      <HUDCryoFlux />
      <HUDVortexField />
    </div>
  );
};

export default CockpitSystem;
