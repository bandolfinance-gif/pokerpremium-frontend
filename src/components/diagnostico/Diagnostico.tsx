
import React, { useEffect, useState } from "react";
import { dataService } from "../../services/DataService";
import { audioService } from "../../sons/AudioService";
import sons from "../../sons/sons.json";

export default function Diagnostico() {
  const [status, setStatus] = useState("OK");

  useEffect(() => {
    dataService.subscribe((data: any) => {
      setStatus(data.diagnostico);
      if (data.diagnostico !== "OK") {
        audioService.play(sons.alerta);
      }
    });
  }, []);

  return (
    <div className="diagnostico painel pulse neon-anim scanline ia-pulso">
      <h3>DiagnÃ³stico</h3>
      <p>Status: {status}</p>
    </div>
  );
}



