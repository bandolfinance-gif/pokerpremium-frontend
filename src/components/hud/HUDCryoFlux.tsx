import React from "react";
import { useHUDState } from "./HUDCore";

// Antes recebia `intensity` via prop com default fixo (0.8), nunca passado
// por ninguém — sempre parado. Agora acompanha a atividade real da mesa.
export const HUDCryoFlux: React.FC = () => {
  const hud = useHUDState();
  const intensity = 0.4 + (hud.activity / 100) * 0.6;

  return (
    <div
      style={{
        position: "absolute",
        top: 1180,
        left: 20,
        width: "300px",
        height: "120px",
        background: "linear-gradient(90deg, #00eaff, #0066ff)",
        opacity: intensity,
        borderRadius: "12px",
        boxShadow: "0 0 25px rgba(0, 200, 255, 0.6)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0px, rgba(255,255,255,0.15) 2px, transparent 4px)",
        }}
      />
    </div>
  );
};

export default HUDCryoFlux;
