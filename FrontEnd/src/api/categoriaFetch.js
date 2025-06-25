const API_URL = "http://localhost:3322";

// Função para tratar as respostas da API
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ${response.status}: ${errorText || response.statusText}`);
  }
  return response.json();
};

// Criar nova categoria
const novaCategoria = async (dados) => {
  try {
    const response = await fetch(`${API_URL}/categorias`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Erro ao criar categoria:", error.message);
    throw error;
  }
};

// Listar categorias
const listarCategorias = async () => {
  try {
    const response = await fetch(`${API_URL}/categorias`);
    return handleResponse(response);
  } catch (error) {
    console.error("Erro ao listar categorias:", error.message);
    throw error;
  }
};

const deletarCategoria = async (id) => {
  try {
    const res = await fetch(`${API_URL}/categorias/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Falha ao excluir categoria: HTTP ${res.status} - ${errorBody}`);
    }
    console.log("categoria excluído com sucesso");
    return true;
  } catch (error) {
    console.error("Erro ao deletar categoria:", error.message);
    throw error;
  }
}

export default {
  novaCategoria,
  listarCategorias,
  deletarCategoria
};
