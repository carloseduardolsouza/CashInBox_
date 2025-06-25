const API_URL = "http://localhost:3322";

const buscarRelatoriosBasicos = async () => {
  try {
    const res = await fetch(`${API_URL}/relatorios/home`);
    if (!res.ok) throw new Error("Erro ao buscar relatórios");

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
