// @ts-nocheck
import React, { useContext, useEffect, useState } from "react";
import { CockpitContext } from "../../systems/CockpitSystem";
import { SoundSystem } from "../../core/audio/SoundSystem";

export default function AlertaGlobal() {
  const data = useContext(CockpitContext);
  const [mensagem, setMensagem] = useState("");
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    if (data.energia < 20) {
      setMensagem("? Alerta: Nível de energia crítico.");
      setAtivo(true);
      SoundSystem.energia();
      return;
    }
    setAtivo(false);
  }, [data.energia]);

  if (!ativo) return null;

  return <div className="alerta-global pulse">{mensagem}</div>;
}

