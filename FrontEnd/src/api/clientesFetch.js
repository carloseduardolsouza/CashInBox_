const API_URL = "http://localhost:3322";

const fetchJson = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorBody}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err; // Repassa o erro para o chamador decidir o que fazer
  }
};

const procurarCliente = async (p) => {
  const endpoint = p === "" || p === "all" ? "/clientes/all" : `/clientes/${encodeURIComponent(p)}`;
  return fetchJson(API_URL + endpoint);
};

const procurarClienteId = async (id) => {
  return fetchJson(`${API_URL}/clientes/procurar/id/${encodeURIComponent(id)}`);
};

const atualizarCliente = async (dados) => {
  const { id } = dados;
  return fetchJson(`${API_URL}/clientes/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
};

const deletarCliente = async (id) => {
  try {
    const res = await fetch(`${API_URL}/clientes/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Falha ao excluir cliente: HTTP ${res.status} - ${errorBody}`);
    }
    console.log("Cliente excluído com sucesso");
    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const novoCliente = async (dados) => {
  return fetchJson(`${API_URL}/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
};

export default {
  procurarCliente,
  procurarClienteId,
  atualizarCliente,
  deletarCliente,
  novoCliente,
};
