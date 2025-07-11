const API_URL = "http://localhost:3322";

const pegarQrCode = async () => {
  try {
    const res = await fetch(`${API_URL}/whatsapp/loginQrCode`);
    if (!res.ok) throw new Error("Erro ao obter QR Code");

    return await res.json();
  } catch (error) {
    console.error("Erro em pegarQrCode:", error);
    throw error;
  }
};

const enviarMensagem = async (dados) => {
  try {
    const res = await fetch(`${API_URL}/whatsapp/detalhesVenda`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(dados),
    });
    return await res.json();
  } catch (error) {
    console.error("Erro em enviarMensagem:", error);
    throw error;
  }
};

const cumprirRotinasManual = async (dados) => {
  try {
    const res = await fetch(`${API_URL}/whatsapp/cumprirRotinasManual`);

    if (!res.ok) throw new Error("Erro ao executar rotinas");

    return await res.json();
  } catch (error) {
    console.error("Erro em executar rotinas:", error);
    throw error;
  }
};

export default {
  pegarQrCode,
  enviarMensagem,
  cumprirRotinasManual
};
