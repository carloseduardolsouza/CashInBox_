const API_URL = "http://localhost:3322";

async function handleFetch(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText || response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

const abrirCaixa = (data) =>
  handleFetch(`${API_URL}/caixa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

const fecharCaixa = (data, id) =>
  handleFetch(`${API_URL}/caixa/${encodeURIComponent(id)}/fechar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

const buscarCaixasAbertos = () => handleFetch(`${API_URL}/caixa/abertos`);

const buscarCaixas = () => handleFetch(`${API_URL}/caixa`);

const novaMovimentacao = (id, data) =>
  handleFetch(`${API_URL}/caixa/${encodeURIComponent(id)}/movimentacoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

const buscarMovimentacao = (id) =>
  handleFetch(`${API_URL}/caixa/${encodeURIComponent(id)}/movimentacoes`);

export default {
  abrirCaixa,
  fecharCaixa,
  buscarCaixasAbertos,
  buscarCaixas,
  novaMovimentacao,
  buscarMovimentacao,
};
