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
    throw err;
  }
};

const procurarFuncionario = async (p) => {
  const endpoint =
    p === "" || p === "all" ? "/funcionarios/all" : `/funcionarios/${encodeURIComponent(p)}`;
  return fetchJson(API_URL + endpoint);
};

const procurarFuncionarioId = async (id) => {
  return fetchJson(`${API_URL}/funcionarios/buscar/${encodeURIComponent(id)}`);
};

const atualizarFuncionario = async (dados) => {
  const { id } = dados;
  return fetchJson(`${API_URL}/funcionarios/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
};

const deletarFuncionario = async (id) => {
  try {
    const res = await fetch(`${API_URL}/funcionarios/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Falha ao excluir funcionário: HTTP ${res.status} - ${errorBody}`);
    }
    console.log("Funcionário excluído com sucesso");
    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const novoFuncionario = async (dados) => {
  return fetchJson(`${API_URL}/funcionarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
};

export default {
  procurarFuncionario,
  procurarFuncionarioId,
  atualizarFuncionario,
  deletarFuncionario,
  novoFuncionario,
};
