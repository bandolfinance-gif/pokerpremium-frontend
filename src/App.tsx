import React from "react";
import { CockpitProvider } from "./systems/CockpitSystem";

import HUD from "./components/cockpit/HUD";
import IAAvatar from "./components/hologram/IAAvatar";
import IAPainel from "./components/hologram/IAPainel";
import IAVoz from "./components/hologram/IAVoz";

import Radar3D from "./components/radar/Radar3D";
import PainelLogs from "./components/logs/PainelLogs";
import Diagnostico from "./components/maintenance/Diagnostico";
import PainelTecnico from "./components/maintenance/PainelTecnico";

import UltraButton from "./components/ultra/UltraButton";
import VRButton from "./components/vr/VRButton";

import MesaPremium from "./components/MesaPremium";

export default function App() {
  const mesaFake = {
    phase: "idle",
    vencedor: "Jogador X"
  };

  return (
    <CockpitProvider>
      <div className="app-container">
        <HUD />
        <IAAvatar />
        <IAPainel />
        <IAVoz />

        <Radar3D />
        <PainelLogs />
        <Diagnostico />
        <PainelTecnico />

        <UltraButton />
        <VRButton />

        <MesaPremium table={mesaFake} />
      </div>
    </CockpitProvider>
  );
}
