
import React, { useEffect, useState } from "react";
import { dataService } from "../../services/DataService";

export default function CircuitoFluxo() {
  const [fluxo, setFluxo] = useState(0);

  useEffect(() => {
    dataService.subscribe((data: any) => {
      setFluxo(data.fluxo);
    });
  }, []);

  return (
    <div className="fluxo-digital painel holograma-3d neon-anim pulse">
      <h3>Fluxo Digital</h3>
      <p>Fluxo: {fluxo}</p>
    </div>
  );
}



