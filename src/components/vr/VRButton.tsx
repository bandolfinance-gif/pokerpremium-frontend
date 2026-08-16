// @ts-nocheck

import React from "react";
import { VRSystem } from "../../systems/VRSystem";

export default function VRButton() {
  function ativar() {
    VRSystem.ativarVR();
  }

  function desativar() {
    VRSystem.desativarVR();
  }

  return (
    <div className="vr painel holograma-3d neon-anim pulse">
      <h3>Modo VR</h3>
      <button onClick={ativar}>Ativar VR</button>
      <button onClick={desativar}>Desativar VR</button>
    </div>
  );
}




