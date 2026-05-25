import { get } from "svelte/store";
import { sessionStore } from "../stores/session";
import { api } from "./api";
import { irParaLogin } from "../stores/navigation";

export async function fazerLogout() {
  try {
    await api.post("/api/logout");
  } catch (err) {
    console.error("Erro ao fazer logout:", err);
  } finally {
    sessionStore.set(null);
    irParaLogin();
  }
}

export function isAuthenticated() {
  return Boolean(get(sessionStore));
}
