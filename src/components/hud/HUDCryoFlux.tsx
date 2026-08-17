import React from "react";

interface HUDCryoFluxProps {
  intensity?: number;
}

export const HUDCryoFlux: React.FC<HUDCryoFluxProps> = ({ intensity = 0.8 }) => {
  return (
    <div
      style={{
        width: "100%",
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
