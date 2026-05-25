const STORAGE_KEY = "bxd_booking_v1";

const emptyState = () => ({
  data: "",
  horario: null,
  tamanho: "",
  complexidade: "",
  cores: "",
  preco: null,
});

export function getBooking() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    return { ...emptyState(), ...JSON.parse(raw) };
  } catch {
    return emptyState();
  }
}

function saveBooking(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function setBookingHorario(data, horario) {
  const state = getBooking();
  state.data = data;
  state.horario = horario;
  saveBooking(state);
}

export function setBookingServico({ tamanho, complexidade, cores, preco }) {
  const state = getBooking();
  state.tamanho = String(tamanho);
  state.complexidade = complexidade;
  state.cores = cores;
  state.preco = preco;
  saveBooking(state);
}

export function clearBooking() {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasHorarioSelecionado() {
  const { data, horario } = getBooking();
  return Boolean(data && horario?.id_horario);
}

export function hasServicoCalculado() {
  const { tamanho, complexidade, cores, preco } = getBooking();
  return (
    tamanho !== "" &&
    complexidade !== "" &&
    cores !== "" &&
    preco !== null &&
    !Number.isNaN(Number(preco))
  );
}

/** Data mínima para input date (hoje, fuso local). */
export function dataMinimaHoje() {
  const hoje = new Date();
  const y = hoje.getFullYear();
  const m = String(hoje.getMonth() + 1).padStart(2, "0");
  const d = String(hoje.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
