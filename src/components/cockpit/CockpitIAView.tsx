import React from 'react';

import HUDEnergyBar from '../hud/HUDEnergyBar';
import HUDIndicators from '../hud/HUDIndicators';
import HUDRadar from '../hud/HUDRadar';
import HUDCompass from '../hud/HUDCompass';
import HUDRoundFlow from '../hud/HUDRoundFlow';
import HUDActionFlow from '../hud/HUDActionFlow';
import HUDIAState from '../hud/HUDIAState';
import HUDProfilePanel from '../hud/HUDProfilePanel';
import HUDMatrixGrid from '../hud/HUDMatrixGrid';
import HUDThermalMap from '../hud/HUDThermalMap';
import HUDNeuralScan from '../hud/HUDNeuralScan';
import HUDSpectrumWave from '../hud/HUDSpectrumWave';
import HUDQuantumField from '../hud/HUDQuantumField';
import HUDCryoFlux from '../hud/HUDCryoFlux';
import HUDVortexField from '../hud/HUDVortexField';
import HUDUltraVision from '../hud/HUDUltraVision';

// Telemetria completa do cockpit — todos os HUDs, numa área própria com
// rolagem. Fica separada da Mesa de propósito (referência do usuário é
// uma visão limpa; aqui é onde a densidade de dados vive).
const CockpitIAView: React.FC = () => {
  return (
    <div style={{ position: 'absolute', inset: 0, top: 50, overflowY: 'auto' }}>
      <div style={{ position: 'relative', width: '100%', height: '1450px' }}>
        <HUDEnergyBar />
        <HUDIndicators />
        <HUDRadar />
        <HUDCompass />
        <HUDRoundFlow />
        <HUDActionFlow />
        <HUDIAState />
        <HUDProfilePanel />
        <HUDMatrixGrid />
        <HUDThermalMap />
        <HUDNeuralScan />
        <HUDSpectrumWave />
        <HUDQuantumField />
        <HUDCryoFlux />
        <HUDVortexField />
        <HUDUltraVision />
      </div>
    </div>
  );
};

export default CockpitIAView;
