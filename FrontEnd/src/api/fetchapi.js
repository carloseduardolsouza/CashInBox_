const API_URL = "http://localhost:3322"; // Porta da sua API rodando local

const informacoesPlanos = async () => {
  const informacoesPlanos = await fetch(`${API_URL}/informacoesPlano`);
  const dados = await informacoesPlanos.json();
  return dados;
};

const gerarBoleto = async () => {
  const boleto = await fetch(`${API_URL}/gerarBoleto`);
  const dados = await boleto.json();
  return dados;
};

export default {
  informacoesPlanos,
  gerarBoleto,
};
