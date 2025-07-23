const API_URL = "http://localhost:3322";

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erro ${response.status}: ${errorText || response.statusText}`
    );
  }
  return response.json();
};

const novoProduto = async (dados, imageReq) => {
  const formData = new FormData();
  formData.append("dados", JSON.stringify(dados));

  if (!imageReq || imageReq.length === 0) {
    const filePadrao = new Blob(["file_padrão"], { type: "text/plain" });
    formData.append("imagens", filePadrao);
  } else {
    imageReq.forEach((image) => formData.append("imagens", image));
  }

  const response = await fetch(`${API_URL}/produtos`, {
    method: "POST",
    body: formData,
  });

  return handleResponse(response);
};

const novaImagemProduto = async (id, imageReq) => {
  const formData = new FormData();

  if (!imageReq || imageReq.length === 0) {
    const filePadrao = new Blob(["file_padrão"], { type: "text/plain" });
    formData.append("imagens", filePadrao);
  } else {
    imageReq.forEach((image) => formData.append("imagens", image));
  }

  const response = await fetch(
    `${API_URL}/produtos/${encodeURIComponent(id)}/imagens`,
    {
      method: "POST",
      body: formData,
    }
  );

  return handleResponse(response);
};

const atualizarProduto = async (dados) => {
  const { id } = dados;

  const response = await fetch(
    `${API_URL}/produtos/${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    }
  );

  return handleResponse(response);
};

const procurarProdutos = async (p = "", filtro = "") => {
  let endpoint = "";

  if (p.trim() === "" || p === "all") {
    endpoint = "/produtos/all";
  } else {
    endpoint = `/produtos/${encodeURIComponent(p)}`;
  }

  // Se filtro existir, adiciona como query param
  if (filtro && filtro != "todos") {
    endpoint += `/${encodeURIComponent(filtro)}`;
  }

  const response = await fetch(API_URL + endpoint);
  return response.json();
};

const procurarProdutoId = async (id) => {
  const response = await fetch(
    `${API_URL}/produtos/id/${encodeURIComponent(id)}`
  );
  return handleResponse(response);
};

const deletarProduto = async (id) => {
  const response = await fetch(
    `${API_URL}/produtos/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Falha ao excluir produto: ${errorText || response.statusText}`
    );
  }

  console.log("Produto excluído com sucesso");
  return true;
};

const listarImagens = async (id) => {
  const response = await fetch(
    `${API_URL}/produtos/produtos/${encodeURIComponent(id)}/variacoes`
  );
  return handleResponse(response);
};

const deletarVariacaoProduto = async (id) => {
  const response = await fetch(
    `${API_URL}/produtos/variacoes/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Falha ao excluir variação: ${errorText || response.statusText}`
    );
  }

  console.log("Variação excluída com sucesso");
  return true;
};

export default {
  novoProduto,
  novaImagemProduto,
  atualizarProduto,
  procurarProdutos,
  procurarProdutoId,
  deletarProduto,
  listarImagens,
  deletarVariacaoProduto,
};
