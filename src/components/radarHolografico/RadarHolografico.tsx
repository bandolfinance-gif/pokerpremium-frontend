
import React, { useEffect, useState } from "react";
import { dataService } from "../../services/DataService";

export default function RadarHolografico() {
  const [angulo, setAngulo] = useState(0);

  useEffect(() => {
    dataService.subscribe((data: any) => {
      setAngulo(data.radar);
    });
  }, []);

  return (
    <div className="radar-holografico painel holograma-3d neon-anim pulse">
      <h3>Radar Holográfico</h3>
      <p>Ângulo: {angulo}°</p>
    </div>
  );
}



