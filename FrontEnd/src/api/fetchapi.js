const API_URL = "http://localhost:3322"; // Porta da sua API rodando local

const ProcurarCliente = async (p) => {
  if (p === "") {
    const clientes = await fetch(`${API_URL}/clientes/all`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
    const data = await clientes.json();
    return data;
  } else {
    const clientes = await fetch(`${API_URL}/clientes/${p}`)
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
  const clientes = await fetch(`${API_URL}/procurarClienteId/${p}`)
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
  const response = await fetch(`${API_URL}/editarCliente/${id}`, {
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
  const response = await fetch(`${API_URL}/deletarCliente/${p}`, {
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
  const response = await fetch(`${API_URL}/novoCliente`, {
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
    const funcionario = await fetch(`${API_URL}/funcionario/all`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
    const data = await funcionario.json();
    return data;
  } else {
    const funcionario = await fetch(`${API_URL}/funcionario/${p}`)
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
  const funcionario = await fetch(`${API_URL}/procurarFuncionarioId/${p}`)
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
  const response = await fetch(`${API_URL}/editarFuncionario/${id}`, {
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

const DeletarFuncionario = async (p) => {
  const response = await fetch(`${API_URL}/deletarFuncionario/${p}`, {
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

const NovoFuncionario = async (dados) => {
  const response = await fetch(`${API_URL}/novoFuncionario`, {
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
  const response = await fetch(`${API_URL}/novaCategoria`, {
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
  const funcionario = await fetch(`${API_URL}/categorias`)
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

  const response = await fetch(`${API_URL}/novoProduto`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Erro ao tentar adicionar novo cliente");
  }

  return response;
};

const novaImagemProduto = async (id, imageReq) => {
  const filePadrao = new Blob(["file_padrão"], { type: "text/plain" });
  const formData = new FormData();

  if (!imageReq || !imageReq.length) {
    formData.append("imagens", filePadrao);
  } else {
    imageReq.forEach((image) => {
      formData.append("imagens", image);
    });
  }

  const response = await fetch(`${API_URL}/novaImagemProduto/${id}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Erro ao tentar adicionar nova imagem de produto");
  }

  return response;
};

const AtualizarProduto = async (dados) => {
  const { id } = dados;
  const response = await fetch(`${API_URL}/editarProduto/${id}`, {
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
    const produtos = await fetch(`${API_URL}/produtos/all`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
    const data = await produtos.json();
    return data;
  } else {
    const produtos = await fetch(`${API_URL}/produtos/${p}`)
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
  const produtos = await fetch(`${API_URL}/procurarProdutoId/${p}`)
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
  const response = await fetch(`${API_URL}/deletarProduto/${p}`, {
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
  const imagens = await fetch(`${API_URL}/imageProdutoId/${id}`)
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
    const response = await fetch(`${API_URL}/deletarVariacaoProduto/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Falha ao excluir variação");
    }

    console.log("Variação excluída com sucesso");
  } catch (error) {
    console.error("Erro ao excluir variação:", error.message);
  }
};

const listarVendas = async (filtro) => {
  const vendas = await fetch(`${API_URL}/listarVendas/${filtro}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  const data = await vendas.json();
  return data;
};

const listarVendasCrediario = async (filtro, pesquisa) => {
  if (filtro == undefined && pesquisa == undefined) {
    const vendas = await fetch(`${API_URL}/listarVendasCrediario`)
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

const listarVendasCliente = async (id) => {
  const vendas = await fetch(`${API_URL}/listarVendasCliente/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  const data = await vendas.json();
  return data;
};

const listarVendasCrediarioVenda = async (id) => {
  const vendas = await fetch(`${API_URL}/listarVendasCrediarioVenda/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  const data = await vendas.json();
  return data;
};

const receberPagamentoParcela = async (id) => {
  const vendas = await fetch(`${API_URL}/receberVendaCrediario/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  const data = await vendas.json();
  return data;
};

const listarVendasFuncionario = async (id) => {
  const vendas = await fetch(`${API_URL}/listarVendasFuncionario/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  const data = await vendas.json();
  return data;
};

const listarOrcamentoCliente = async (id) => {
  const vendas = await fetch(`${API_URL}/listarOrcamentoCliente/${id}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
  const data = await vendas.json();
  return data;
};

const listarOrcamentos = async (filtro, pesquisa) => {
  if (filtro == undefined && pesquisa == undefined) {
    const Orcamentos = await fetch(`${API_URL}/listarOrcamentos`)
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
  const venda = await fetch(`${API_URL}/procurarVendaId/${id}`)
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
  const response = await fetch(`${API_URL}/novaVenda`, {
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

const NovaVendaCrediario = async (dados) => {
  const response = await fetch(`${API_URL}/novaVendaCrediario`, {
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
  const produtos = await fetch(`${API_URL}/procurarProdutosVenda/${id}`)
    .then((response) => {
      return response;
    })
    .catch((erro) => {
      return erro;
    });

  const dados = await produtos.json();
  return dados;
};

const procurarPagamentoVenda = async (id) => {
  const pagamentos = await fetch(`${API_URL}/procurarPagamentoVenda/${id}`)
    .then((response) => {
      return response;
    })
    .catch((erro) => {
      return erro;
    });

  const dados = await pagamentos.json();
  return dados;
};

const deletarVenda = async (id) => {
  const venda = await fetch(`${API_URL}/deletarVenda/${id}`, {
    method: "DELETE",
  });

  if (!venda.ok) {
    throw new Error("Falha ao excluir venda");
  }

  console.log("venda excluída com sucesso");
};

const dadosEmpresa = async () => {
  const produtos = await fetch(`${API_URL}/dadosEmpresa`)
    .then((response) => {
      return response;
    })
    .catch((erro) => {
      return erro;
    });

  const dados = await produtos.json();
  return dados;
};

const EditarDadosEmpresa = async (data) => {
  const produtos = await fetch(`${API_URL}/salvarDadosEmpresa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response;
    })
    .catch((erro) => {
      return erro;
    });

  const dados = await produtos.json();
  return dados;
};

const AbrirCaixa = async (data) => {
  await fetch(`${API_URL}/iniciarNovoCaixa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    return response;
  });
};

const FecharCaixa = async (data, id) => {
  await fetch(`${API_URL}/fecharCaixa/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((response) => {
    return response;
  });
};

const BuscarCaixasAbertos = async () => {
  const caixaAberto = await fetch(`${API_URL}/buscarCaixasAbertos`);
  const dados = await caixaAberto.json();
  return dados;
};

const BuscarCaixas = async () => {
  const caixas = await fetch(`${API_URL}/buscarCaixas`);
  const dados = await caixas.json();
  return dados;
};

const NovaMovimentacao = async (id, data) => {
  const response = await fetch(`${API_URL}/adicionarMovimentacoes/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao adicionar movimentação");
  }

  return await response.json(); // agora retorna o corpo da resposta
};

const BuscarMovimentacao = async (id) => {
  const movimentacao = await fetch(`${API_URL}/buscarMovimentacoes/${id}`);
  const dados = await movimentacao.json();
  return dados;
};

const restartApi = async () => {
  const response = await fetch(`${API_URL}/restart`).catch((error) => {
    return error;
  });
};

const pegarQrCode = async () => {
  const responde = await fetch(`${API_URL}/qrCodeAutomacao`);
  const dados = await responde.json();
  return dados;
};

const enviarMensagem = async (dados) => {
  const response = await fetch(`${API_URL}/EnviarMenssagemWhatsapp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error("Erro ao enviar mensagem");
  }

  const resultado = await response.json();
  return resultado;
};

const buscarRelatoriosBasicos = async () => {
  const buscarRelatoriosBasicos = await fetch(`${API_URL}/faturamentoMes`);
  const dados = await buscarRelatoriosBasicos.json();
  return dados;
};

export default {
  restartApi,

  buscarRelatoriosBasicos,

  pegarQrCode,
  enviarMensagem,

  dadosEmpresa,
  EditarDadosEmpresa,

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
  novaImagemProduto,
  ProcurarProdutos,
  ProcurarProdutoId,
  deletarVariacaoProduto,
  DeletarProduto,
  AtualizarProduto,

  listarVendas,
  listarVendasCrediario,
  listarVendasCrediarioVenda,
  listarVendasCliente,
  listarVendasFuncionario,
  receberPagamentoParcela,
  listarOrcamentoCliente,
  listarOrcamentos,
  NovaVendaCrediario,
  NovaVendaEmBloco,
  produrarVendaId,
  procurarProdutosVenda,
  procurarPagamentoVenda,
  deletarVenda,

  AbrirCaixa,
  BuscarCaixas,
  BuscarCaixasAbertos,
  FecharCaixa,
  NovaMovimentacao,
  BuscarMovimentacao,
};
