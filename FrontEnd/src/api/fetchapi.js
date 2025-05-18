const ProcurarCliente = async (p) => {
  if (p === "") {
    const clientes = await fetch(`http://localhost:3322/clientes/all`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
    const data = await clientes.json();
    return data;
  } else {
    const clientes = await fetch(`http://localhost:3322/clientes/${p}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
    const data = await clientes.json();
    return data;
  }
};

const ProcurarClienteId = async (p) => {
  const clientes = await fetch(`http://localhost:3322/procurarClienteId/${p}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  const data = await clientes.json();
  return data;
};

const AtualizarCliente = async (dados) => {
  const { id } = dados;
  const response = await fetch(`http://localhost:3322/editarCliente/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  }).catch((error) => {
    return error;
  });

  if (!response.ok) {
    throw new Error("Erro ao tentar adicionar novo cliente");
  }

  return response;
};

const DeletarCliente = async (p) => {
  const response = await fetch(`http://localhost:3322/deletarCliente/${p}`, {
    method: "DELETE",
  }).catch((error) => {
    return error;
  });

  if (response.ok) {
    // Cliente excluído com sucesso
    console.log("Cliente excluído com sucesso");
  } else {
    // Se a resposta não estiver ok, lançar um erro
    throw new Error("Falha ao excluir cliente");
  }
};

const NovoCliente = async (dados) => {
  const response = await fetch("http://localhost:3322/novoCliente", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  }).catch((error) => {
    return error;
  });

  if (!response.ok) {
    throw new Error("Erro ao tentar adicionar novo funcionario");
  }

  return response;
};

const ProcurarFuncionario = async (p) => {
  if (p === "") {
    const funcionario = await fetch(`http://localhost:3322/funcionario/all`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
    const data = await funcionario.json();
    return data;
  } else {
    const funcionario = await fetch(`http://localhost:3322/funcionario/${p}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
    const data = await funcionario.json();
    return data;
  }
};

const ProcurarFuncionarioId = async (p) => {
  const funcionario = await fetch(
    `http://localhost:3322/procurarFuncionarioId/${p}`
  )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  const data = await funcionario.json();
  return data;
};

const AtualizarFuncionario = async (dados) => {
  const { id } = dados;
  const response = await fetch(
    `http://localhost:3322/editarFuncionario/${id}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    }
  ).catch((error) => {
    return error;
  });

  if (!response.ok) {
    throw new Error("Erro ao tentar adicionar novo cliente");
  }

  return response;
};

const DeletarFuncionario = async (p) => {
  const response = await fetch(
    `http://localhost:3322/deletarFuncionario/${p}`,
    {
      method: "DELETE",
    }
  ).catch((error) => {
    return error;
  });

  if (response.ok) {
    // Cliente excluído com sucesso
    console.log("Cliente excluído com sucesso");
  } else {
    // Se a resposta não estiver ok, lançar um erro
    throw new Error("Falha ao excluir cliente");
  }
};

const NovoFuncionario = async (dados) => {
  const response = await fetch("http://localhost:3322/novoFuncionario", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  }).catch((error) => {
    return error;
  });

  if (!response.ok) {
    throw new Error("Erro ao tentar adicionar novo cliente");
  }

  return response;
};

const novaCategoria = async (dados) => {
  const response = await fetch("http://localhost:3322/novaCategoria", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  }).catch((error) => {
    return error;
  });

  if (!response.ok) {
    return;
  }

  return response;
};

const listarCategorias = async () => {
  const funcionario = await fetch(`http://localhost:3322/categorias`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  const data = await funcionario.json();
  return data;
};

const novoProduto = async (dados, imageReq) => {
  const filePadrao = new Blob(["file_padrão"], { type: "text/plain" });
  const formData = new FormData();
  formData.append("dados", JSON.stringify(dados));
  if (imageReq == undefined) {
    formData.append(`imagens`, filePadrao);
  } else {
    imageReq.forEach((image) => {
      formData.append(`imagens`, image); // Adiciona cada imagem com uma chave diferente
    });
  }

  const response = await fetch("http://localhost:3322/novoProduto", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Erro ao tentar adicionar novo cliente");
  }

  return response;
};

const AtualizarProduto = async (dados) => {
  const { id } = dados;
  const response = await fetch(`http://localhost:3322/editarProduto/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  }).catch((error) => {
    return error;
  });

  if (!response.ok) {
    throw new Error("Erro ao tentar adicionar novo cliente");
  }

  return response;
};

const ProcurarProdutos = async (p) => {
  if (p === "") {
    const produtos = await fetch(`http://localhost:3322/produtos/all`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
    const data = await produtos.json();
    return data;
  } else {
    const produtos = await fetch(`http://localhost:3322/produtos/${p}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
    const data = await produtos.json();
    return data;
  }
};

const ProcurarProdutoId = async (p) => {
  const produtos = await fetch(`http://localhost:3322/procurarProdutoId/${p}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  const data = await produtos.json();
  return data;
};

const DeletarProduto = async (p) => {
  const response = await fetch(`http://localhost:3322/deletarProduto/${p}`, {
    method: "DELETE",
  }).catch((error) => {
    return error;
  });

  if (response.ok) {
    // Cliente excluído com sucesso
    console.log("produto excluído com sucesso");
  } else {
    // Se a resposta não estiver ok, lançar um erro
    throw new Error("Falha ao excluir produto");
  }
};

const listarImagens = async (id) => {
  const imagens = await fetch(`http://localhost:3322/imageProdutoId/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  const data = await imagens.json();
  return data;
};

const deletarVariacaoProduto = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3322/deletarVariacaoProduto/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Falha ao excluir variação");
    }

    console.log("Variação excluída com sucesso");
  } catch (error) {
    console.error("Erro ao excluir variação:", error.message);
  }
};

const listarVendas = async (filtro, pesquisa) => {
  if (filtro == undefined && pesquisa == undefined) {
    const vendas = await fetch(`http://localhost:3322/listarVendas`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
    const data = await vendas.json();
    return data;
  }
};

const listarOrcamentos = async (filtro, pesquisa) => {
  if (filtro == undefined && pesquisa == undefined) {
    const Orcamentos = await fetch(`http://localhost:3322/listarOrcamentos`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
    const data = await Orcamentos.json();
    return data;
  }
};

const produrarVendaId = async (id) => {
  const venda = await fetch(`http://localhost:3322/procurarVendaId/${id}`)
    .then((response) => {
      return response;
    })
    .catch((erro) => {
      return erro;
    });

  const dados = await venda.json();
  return dados;
};

const NovaVendaEmBloco = async (dados) => {
  const response = await fetch("http://localhost:3322/novaVenda", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  }).catch((error) => {
    return error;
  });

  if (!response.ok) {
    throw new Error("Erro ao tentar adicionar nova venda");
  }

  return response;
};

const procurarProdutosVenda = async (id) => {
  const produtos = await fetch(
    `http://localhost:3322/procurarProdutosVenda/${id}`
  )
    .then((response) => {
      return response;
    })
    .catch((erro) => {
      return erro;
    });

  const dados = await produtos.json();
  return dados;
};

const deletarVenda = async (id) => {
  const venda = await fetch(`http://localhost:3322/deletarVenda/${id}`, {
    method: "DELETE",
  });

  if (!venda.ok) {
    throw new Error("Falha ao excluir venda");
  }

  console.log("venda excluída com sucesso");
};

const restartApi = async () => {
  const response = await fetch("http://localhost:3322/restart").catch(
    (error) => {
      return error;
    }
  );
};

export default {
  restartApi,

  ProcurarCliente,
  ProcurarClienteId,
  AtualizarCliente,
  NovoCliente,
  DeletarCliente,

  ProcurarFuncionario,
  NovoFuncionario,
  ProcurarFuncionarioId,
  DeletarFuncionario,
  AtualizarFuncionario,
  listarImagens,

  novaCategoria,
  listarCategorias,

  novoProduto,
  ProcurarProdutos,
  ProcurarProdutoId,
  deletarVariacaoProduto,
  DeletarProduto,
  AtualizarProduto,

  listarVendas,
  listarOrcamentos,
  NovaVendaEmBloco,
  produrarVendaId,
  procurarProdutosVenda,
  deletarVenda
};
