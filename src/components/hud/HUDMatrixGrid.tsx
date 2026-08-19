import React from "react";
import { useIAInsight } from "../../services/iaEngine";

// Fase 3: reflete a IA Mesa (Módulo 1) — intensidade da grade acompanha
// pot odds, e os trends/alertas aparecem como leitura de texto.
export const HUDMatrixGrid: React.FC = () => {
  const { tableInsight } = useIAInsight();
  const intensity = 0.15 + (tableInsight.potOdds / 100) * 0.4;

  return (
    <div
      style={{
        position: "absolute",
        top: 1080,
        right: 20,
        width: "300px",
        background: "rgba(0, 0, 0, 0.4)",
        borderRadius: "10px",
        padding: "6px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridTemplateRows: "repeat(6, 1fr)",
          gap: "4px",
          height: "140px",
        }}
      >
        {Array.from({ length: 72 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: `rgba(0, 255, 255, ${intensity})`,
              borderRadius: "4px",
              boxShadow: `0 0 6px rgba(0, 255, 255, ${intensity + 0.2})`,
            }}
          />
        ))}
      </div>
      <div style={{ marginTop: 6, color: '#00eaff', fontFamily: 'monospace', fontSize: '11px' }}>
        {tableInsight.trends[0] ?? 'Sem padrão relevante'}
        {tableInsight.alerts.length > 0 && (
          <div style={{ color: '#ffd76a' }}>{tableInsight.alerts[0]}</div>
        )}
      </div>
    </div>
  );
};

export default HUDMatrixGrid;
