
import { api } from "./api";
import { getToken } from "./auth";

export async function obterRelatorios() {
  const token = getToken();

  const resposta = await api.get("/relatorios", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  return resposta.data;
}

