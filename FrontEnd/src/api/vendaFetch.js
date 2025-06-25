const API_URL = "http://localhost:3322";

async function handleFetch(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Erro ${response.status}: ${errorText || response.statusText}`
      );
    }
    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Repassa o erro para o chamador tratar
  }
}

const listarVendas = (filtro) =>
  handleFetch(`${API_URL}/vendas/${encodeURIComponent(filtro)}`);

const listarVendasCrediario = (filtro, pesquisa) => {
  if (filtro === undefined && pesquisa === undefined) {
    return handleFetch(`${API_URL}/vendas/crediario/todas` , {method: "GET",});
  }
  // Se quiser lógica para outros casos, bota aqui
  return Promise.resolve([]); // Ou qualquer retorno padrão
};

const listarVendasCrediarioCliente = (id) =>
  handleFetch(`${API_URL}/vendas/crediario/cliente/${encodeURIComponent(id)}`);

const listarVendasCliente = (id) =>
  handleFetch(`${API_URL}/vendas/cliente/${encodeURIComponent(id)}`);

const listarVendasCrediarioVenda = (id) =>
  handleFetch(`${API_URL}/vendas/crediario/venda/${encodeURIComponent(id)}`);

const receberPagamentoParcela = (id, dados) =>
  handleFetch(`${API_URL}/vendas/crediario/receber/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

const listarVendasFuncionario = (id) =>
  handleFetch(`${API_URL}/vendas/${encodeURIComponent(id)}`);

const listarOrcamentoCliente = (id) =>
  handleFetch(`${API_URL}/vendas/orcamento/cliente/${encodeURIComponent(id)}`);

const listarOrcamentos = () =>
  handleFetch(`${API_URL}/vendas/orcamentos`, {
    method: "POST",
  });

const procurarVendaId = (id) =>
  handleFetch(`${API_URL}/vendas/id/${encodeURIComponent(id)}`);

const novaVendaEmBloco = (dados) =>
  handleFetch(`${API_URL}/vendas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

const novaVendaCrediario = (dados) =>
  handleFetch(`${API_URL}/vendas/crediario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

const procurarProdutosVenda = (id) =>
  handleFetch(`${API_URL}/vendas/produtos/${encodeURIComponent(id)}`);

const procurarPagamentoVenda = (id) =>
  handleFetch(`${API_URL}/vendas/pagamento/${encodeURIComponent(id)}`);

const deletarVenda = async (id) => {
  try {
    const response = await fetch(
      `${API_URL}/vendas/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Falha ao excluir venda: ${errorText || response.statusText}`
      );
    }
    console.log("Venda excluída com sucesso");
  } catch (error) {
    console.error("Erro ao deletar venda:", error);
    throw error;
  }
};

export default {
  listarVendas,
  listarVendasCrediario,
  listarVendasCrediarioCliente,
  listarVendasCliente,
  listarVendasCrediarioVenda,
  receberPagamentoParcela,
  listarVendasFuncionario,
  listarOrcamentoCliente,
  listarOrcamentos,
  procurarVendaId,
  novaVendaEmBloco,
  novaVendaCrediario,
  procurarProdutosVenda,
  procurarPagamentoVenda,
  deletarVenda,
};
