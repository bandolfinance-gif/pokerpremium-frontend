import React from "react";
import { useIAInsight } from "../../services/iaEngine";

const styleLabel: Record<string, string> = {
  tight: 'FECHADO',
  loose: 'SOLTO',
  aggressive: 'AGRESSIVO',
  passive: 'PASSIVO',
};

// Fase 3: reflete a IA Oponentes (Módulo 2) — estilo e risco do
// oponente-referência, derivados das ações reais na mesa.
export const HUDNeuralScan: React.FC = () => {
  const { opponent } = useIAInsight();

  return (
    <div
      style={{
        position: "absolute",
        top: 1260,
        right: 20,
        width: "300px",
        background: "rgba(0, 0, 0, 0.55)",
        borderRadius: "12px",
        padding: "12px",
        boxShadow: "0 0 22px rgba(0, 255, 200, 0.4)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100px",
          borderRadius: "8px",
          backgroundImage:
            `radial-gradient(circle at center, rgba(0,255,200,${0.25 + opponent.riskLevel / 200}), transparent 70%)`,
        }}
      />
      <div style={{ marginTop: 8, color: '#00ffc8', fontFamily: 'monospace', fontSize: '11px' }}>
        ESTILO: {styleLabel[opponent.style]}
        <br />
        RISCO: {opponent.riskLevel}%
      </div>
    </div>
  );
};

export default HUDNeuralScan;
