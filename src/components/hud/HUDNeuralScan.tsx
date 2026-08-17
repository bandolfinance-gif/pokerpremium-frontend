import React from "react";

export const HUDNeuralScan: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "160px",
        background: "rgba(0, 0, 0, 0.55)",
        borderRadius: "12px",
        padding: "12px",
        boxShadow: "0 0 22px rgba(0, 255, 200, 0.4)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundImage:
            "radial-gradient(circle at center, rgba(0,255,200,0.4), transparent 70%)",
        }}
      />
    </div>
  );
};

export default HUDNeuralScan;
