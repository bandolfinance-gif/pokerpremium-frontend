// @ts-nocheck

import { api } from "./api";

export async function login(usuario, senha) {
  const resposta = await api.post("/login", { usuario, senha });
  localStorage.setItem("token", resposta.data.token);
  return resposta.data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}


