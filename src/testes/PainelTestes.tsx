import React from 'react';

import HUD from '../components/hud/HUD';
import Radar from '../components/radar/Radar';
import IA from '../components/ia/IA';
import MiniMapa from '../components/minimapa/MiniMapa';
import Energia from '../components/energia/Energia';
import PainelLogs from '../components/logs/PainelLogs';
import GraficoEnergia from '../components/energia/GraficoEnergia';
import CircuitoFluxo from '../components/fluxo/CircuitoFluxo';
import Diagnostico from '../components/diagnostico/Diagnostico';
import PainelTecnico from '../components/tecnico/PainelTecnico';
import DesmontagemDigital from '../components/desmontagem/DesmontagemDigital';
import Gestos from '../components/gestos/Gestos';

export default function PainelTestes() {
  return (
    <div className='painel-testes'>
      <h2>Painel de Testes</h2>

      <HUD />
      <Radar />
      <IA />
      <MiniMapa />
      <Energia />
      <PainelLogs />
      <GraficoEnergia />
      <CircuitoFluxo />
      <Diagnostico />
      <PainelTecnico />
      <DesmontagemDigital />
      <Gestos />
    </div>
  );
}


