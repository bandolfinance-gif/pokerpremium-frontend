import React from "react";
import { useHUDState } from "./HUDCore";

// Antes recebia um `value` via prop com default fixo (75) e ninguém nunca
// passava um valor real — ficava sempre parado em 75%. Agora lê a
// atividade real do HUDCore (sobe a cada evento de mesa, decai sozinha).
export const HUDEnergyBar: React.FC = () => {
  const hud = useHUDState();
  const value = hud.activity;
  const glow = value > 50 ? "0 0 22px #00ffcc" : "0 0 12px #ff0066";

  return (
    <div
      style={{
        position: "absolute",
        top: 1120,
        left: 20,
        width: "300px",
        height: "28px",
        background: "rgba(0, 0, 0, 0.45)",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: glow,
      }}
    >
      <div
        style={{
          width: `${value}%`,
          height: "100%",
          background: "linear-gradient(90deg, #00ffcc, #0066ff)",
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
};

export default HUDEnergyBar;
