import React, { useEffect, useState } from "react";
import { dataService } from "../../services/DataService";
import { iaService } from "../iaInteligente/IAService";

export default function IA() {
  const [status, setStatus] = useState("OK");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    dataService.subscribe(async (data: any) => {
      setStatus(data.iaStatus);

      // CORREÇÃO: converter o objeto em texto antes de enviar
      const resposta = await iaService.analisar(JSON.stringify(data));
      setMensagem(resposta);
    });
  }, []);

  return (
    <div className="ia painel holograma-3d neon-anim pulse">
      <h3>IA Inteligente</h3>
      <p>Status: {status}</p>
      <p>{mensagem}</p>
    </div>
  );
}


