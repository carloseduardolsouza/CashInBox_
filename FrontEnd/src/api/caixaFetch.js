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


const novaMovimentacao = (id, data) =>
  handleFetch(`${API_URL}/caixa/${encodeURIComponent(id)}/movimentacoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

const buscarMovimentacao = () =>
  handleFetch(`${API_URL}/caixa/movimentacoes`);

export default {
  novaMovimentacao,
  buscarMovimentacao,
};
