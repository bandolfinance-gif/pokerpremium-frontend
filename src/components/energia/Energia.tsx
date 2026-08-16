
import React, { useEffect, useState } from "react";
import { dataService } from "../../services/DataService";
import { audioService } from "../../sons/AudioService";
import sons from "../../sons/sons.json";

export default function Energia() {
  const [nivel, setNivel] = useState(0);

  useEffect(() => {
    dataService.subscribe((data: any) => {
      setNivel(data.energia);
      audioService.play(sons.energia);
    });
  }, []);

  return (
    <div className="energia painel pulse neon-anim scanline energia-fluxo">
      <h3>NÃ­vel de Energia</h3>
      <p>{nivel}%</p>
    </div>
  );
}



