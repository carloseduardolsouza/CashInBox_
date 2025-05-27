import "./AutomacaoWhats.css";
import { useState, useEffect  } from "react";
import fetchapi from "../../../../api/fetchapi";

function AutomacaoWhats() {
  const [dadosBot, setDadosBot] = useState({});
  const [erro, setErro] = useState(false);

  const fetchQrCode = async () => {
    try {
      const response = await fetchapi.pegarQrCode();
      setDadosBot(response);
      setErro(false);
    } catch (error) {
      console.error("Erro ao buscar QR Code:", error);
      setErro(true);
    }
  };

  useEffect(() => {
    fetchQrCode(); // Já chama logo de cara
    const interval = setInterval(() => {
      fetchQrCode();
    }, 1000); // 1 segundo

    return () => clearInterval(interval);
  }, []);

  const statusColor =
    dadosBot.status_bot === "online" ? "green" : "red";

  return (
    <div id="AutomacaoWhats">
      <div>
        <div id="divSpanConectado">
          <div
            id="spanConectadoOrNo"
            style={{ backgroundColor: statusColor }}
          />
          <p>{dadosBot.status_bot || "Status desconhecido"}</p>
          {erro && <p style={{ color: "red" }}>Erro ao buscar status</p>}
        </div>
      </div>

      <div>
        {dadosBot.qr_code ? (
          <img src={dadosBot.qr_code} alt="QR Code do Bot" />
        ) : (
          <p>Carregando QR Code...</p>
        )}
      </div>
    </div>
  );
}

export default AutomacaoWhats;
