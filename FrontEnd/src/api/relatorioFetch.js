const API_URL = "http://localhost:3322";

const buscarRelatoriosBasicos = async () => {
  try {
    const res = await fetch(`${API_URL}/relatorios/home`);

    const dados = await res.json();
    return dados;
  } catch (error) {
    console.error("Erro em buscarRelatoriosBasicos:", error);
    throw error;
  }
};

const buscarResumoRelatorios = async () => {
  try {
    const res = await fetch(`${API_URL}/relatorios/resumoRelatorios`);

    const dados = await res.json();
    return dados;
  } catch (error) {
    console.error("Erro em resumoRelatorios:", error);
    throw error;
  }
}

export default {
  buscarRelatoriosBasicos,
  buscarResumoRelatorios
};
