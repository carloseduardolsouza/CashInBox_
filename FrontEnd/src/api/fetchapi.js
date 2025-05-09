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

  return response
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
};
