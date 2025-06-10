import "./AutomacaoWhats.css";
import { useState, useEffect } from "react";
import fetchapi from "../../../../api/fetchapi";

import { FaRobot } from "react-icons/fa";

function AutomacaoWhats() {
  const [dadosBot, setDadosBot] = useState({});
  const [erro, setErro] = useState(false);

  const [clickRobo, setClickRobo] = useState(false);

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

  const statusColor = dadosBot.status_bot === "online" ? "green" : "red";

  return (
    <div id="AutomacaoWhats">
      <div
        id="divStatusRobo"
        onClick={() => {
          if (clickRobo === false) {
            setClickRobo(true);
          } else setClickRobo(false);
        }}
      >
        <div id="divSpanConectado">
          <div
            id="spanConectadoOrNo"
            style={{ backgroundColor: statusColor }}
          />
          <p>
            <FaRobot />
            {dadosBot.status_bot || "Status desconhecido"}
          </p>
          {erro && <p style={{ color: "red" }}>Erro ao buscar status</p>}
        </div>

        {clickRobo && (
          <div>
            {dadosBot.qr_code ? (
              <img src={dadosBot.qr_code} alt="QR Code do Bot" />
            ) : dadosBot.status_bot === "online" ? (
              <p>Bot conectado</p>
            ) : (
              <p>Carregando QR Code...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AutomacaoWhats;
