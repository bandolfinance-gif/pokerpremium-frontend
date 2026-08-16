export class IAService {
  analisarEstado(estado: any) {
    if (!estado) return "Sistema aguardando dados.";

    const energia = estado.energia ?? 0;
    const fluxo = estado.fluxo ?? 0;
    const risco = estado.risco ?? 0;

    if (energia < 20) return "Energia crítica! Reduza o consumo imediatamente.";
    if (fluxo > 80) return "Fluxo elevado detectado. Ajustando parâmetros.";
    if (risco > 70) return "Risco alto! Protocolo de segurança ativado.";

    return "IA monitorando o sistema normalmente.";
  }

  async analisar(texto: string) {
    const response = await fetch("http://localhost:3001/ia/analisar", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ texto })
    });

    if (!response.ok) {
      throw new Error("Erro ao analisar texto");
    }

    const data = await response.json();

    // RETORNO LIMPO — sem conversão que causa erro
    return data.resultado;
  }
}

export const iaService = new IAService();
