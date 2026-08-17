import React from "react";

export const HUDMatrixGrid: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "200px",
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gridTemplateRows: "repeat(6, 1fr)",
        gap: "4px",
        background: "rgba(0, 0, 0, 0.4)",
        borderRadius: "10px",
        padding: "6px",
      }}
    >
      {Array.from({ length: 72 }).map((_, i) => (
        <div
          key={i}
          style={{
            background: "rgba(0, 255, 255, 0.15)",
            borderRadius: "4px",
            boxShadow: "0 0 6px rgba(0, 255, 255, 0.4)",
          }}
        />
      ))}
    </div>
  );
};

export default HUDMatrixGrid;
