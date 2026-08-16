import React, { useContext, useEffect, useState } from "react";
import { CockpitContext } from "../../systems/CockpitSystem";

export default function PainelLogs() {
  const { energia, iaStatus, alerta } = useContext(CockpitContext);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    setLogs(l => [...l, "Energia atual: " + energia]);
  }, [energia]);

  useEffect(() => {
    setLogs(l => [...l, "IA mudou para: " + iaStatus]);
  }, [iaStatus]);

  useEffect(() => {
    setLogs(l => [...l, "Alerta: " + alerta]);
  }, [alerta]);

  return (
    <div className="painel-logs">
      {logs.map((log, i) => (
        <p key={i}>{log}</p>
      ))}
    </div>
  );
}
