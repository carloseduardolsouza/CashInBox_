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

export default {
  buscarRelatoriosBasicos,
};
