
import React, { useEffect, useState } from "react";
import { dataService } from "../../services/DataService";

export default function NavegacaoTatica() {
  const [angulo, setAngulo] = useState(0);

  useEffect(() => {
    dataService.subscribe((data: any) => {
      setAngulo(data.radar);
    });
  }, []);

  return (
    <div className="navegacao-tatica painel holograma-3d neon-anim pulse">
      <h3>Navegação TÃ¡tica</h3>
      <p>Ã‚ngulo do Radar: {angulo}Â°</p>
    </div>
  );
}



