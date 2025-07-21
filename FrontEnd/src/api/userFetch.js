const API_URL = "http://localhost:3322";

const dadosEmpresa = async () => {
  const produtos = await fetch(`${API_URL}/user/dadosEmpresa`)
    .then((response) => {
      return response;
    })
    .catch((erro) => {
      return erro;
    });

  const dados = await produtos.json();
  return dados;
};

const editarDadosEmpresa = async (data) => {
  const produtos = await fetch(`${API_URL}/user/editar/dadosEmpresa`, {
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

const verConfigAutomacao = async () => {
  const produtos = await fetch(`${API_URL}/user/config/automacao`)
    .then((response) => {
      return response;
    })
    .catch((erro) => {
      return erro;
    });

  const dados = await produtos.json();
  return dados;
};

const editarConfigAutomacao = async (data) => {
  const produtos = await fetch(`${API_URL}/user/config/automacao`, {
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

const cadastrarCredenciais = async (dados) => {
  const response = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    throw new Error("Erro ao fazer login");
  }

  return await response.json();
};

const informacoesPlanos = async () => {
  const response = await fetch(`${API_URL}/user/informacoesPlano`);
  const dados = await response.json().catch(() => null); // Evita erro se não houver JSON válido
  return {
    status: response.status,
    data: dados,
  };
};

const gerarBoleto = async () => {
  const boleto = await fetch(`${API_URL}/user/gerarBoleto`);
  const dados = await boleto.json();
  return dados;
};

export default {
  informacoesPlanos,
  gerarBoleto,
  editarDadosEmpresa,
  cadastrarCredenciais,
  editarConfigAutomacao,
  verConfigAutomacao,
  dadosEmpresa,
};
