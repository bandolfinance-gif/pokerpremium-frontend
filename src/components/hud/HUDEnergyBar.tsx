import React from "react";

interface HUDEnergyBarProps {
  value?: number;
}

export const HUDEnergyBar: React.FC<HUDEnergyBarProps> = ({ value = 75 }) => {
  const glow = value > 50 ? "0 0 22px #00ffcc" : "0 0 12px #ff0066";

  return (
    <div
      style={{
        width: "100%",
        height: "28px",
        background: "rgba(0, 0, 0, 0.45)",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: glow,
      }}
    >
      <div
        style={{
          width: ${value}%,
          height: "100%",
          background: "linear-gradient(90deg, #00ffcc, #0066ff)",
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
};

export default HUDEnergyBar;
