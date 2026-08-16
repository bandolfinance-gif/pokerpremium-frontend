// @ts-nocheck

import React from "react";
import { UltraSystem } from "../../systems/UltraSystem";

export default function UltraButton() {
  return (
    <div className="ultra painel holograma-3d neon-anim pulse">
      <h3>Modo Ultra</h3>
      <button onClick={() => UltraSystem.ativarUltra()}>Ativar Ultra</button>
      <button onClick={() => UltraSystem.desativarUltra()}>Desativar Ultra</button>
    </div>
  );
}




